import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import { build } from 'esbuild';

const { outputFiles } = await build({
    entryPoints: [fileURLToPath(new URL('../src/lib/dailyFightApi.js', import.meta.url))],
    bundle: true, format: 'cjs', platform: 'node', write: false,
    external: ['firebase/firestore'],
});

// Exercise the actual API module against an in-memory Firestore adapter with
// optimistic transaction retries, rather than needing production credentials.
function localStorageFixture() {
    const values = new Map();
    return {
        getItem: key => values.get(key) ?? null,
        setItem: (key, value) => values.set(key, value),
        removeItem: key => values.delete(key),
    };
}

function fixture(initial = {}, now = '2026-11-06T12:00:00Z') {
    const records = new Map(Object.entries(initial));
    const versions = new Map();
    const reads = [];
    const updates = [];
    const storage = localStorageFixture();
    const snapshot = path => ({
        exists: () => records.has(path),
        data: () => structuredClone(records.get(path)),
    });
    const sdk = {
        doc: (_db, ...path) => path.join('/'),
        getDoc: async path => { reads.push(path); return snapshot(path); },
        updateDoc: async (path, value) => {
            if (!records.has(path)) throw new Error('Document not available');
            updates.push({ path, value });
            const next = { ...records.get(path) };
            for (const [key, transform] of Object.entries(value)) {
                next[key] = (next[key] || 0) + transform.incrementBy;
            }
            records.set(path, next);
            versions.set(path, (versions.get(path) || 0) + 1);
        },
        increment: value => ({ incrementBy: value }),
        serverTimestamp: () => 'server-time',
        runTransaction: async (_db, callback) => {
            for (let attempt = 0; attempt < 100; attempt++) {
                const seen = new Map();
                const writes = [];
                const result = await callback({
                    get: async path => {
                        assert.equal(writes.length, 0, 'reads must precede writes');
                        seen.set(path, versions.get(path) || 0);
                        reads.push(path);
                        const value = structuredClone(records.get(path));
                        return { exists: () => value !== undefined, data: () => value };
                    },
                    set: (path, value) => writes.push({ path, value, update: false }),
                    update: (path, value) => writes.push({ path, value, update: true }),
                });
                if ([...seen].some(([path, version]) => (versions.get(path) || 0) !== version)) continue;
                for (const { path, value, update } of writes) {
                    const next = update ? { ...records.get(path) } : { ...value };
                    if (update) {
                        assert.ok(records.has(path), 'cannot update a missing document');
                        for (const [key, transform] of Object.entries(value)) {
                            next[key] = transform.incrementBy === undefined ? transform : next[key] + transform.incrementBy;
                        }
                    }
                    records.set(path, next);
                    versions.set(path, (versions.get(path) || 0) + 1);
                }
                return result;
            }
            throw new Error('Too much contention');
        },
    };
    class ClockDate extends Date {
        constructor(...args) { super(...(args.length ? args : [now])); }
    }
    const context = { Date: ClockDate, module: { exports: {} }, require: name => {
        assert.equal(name, 'firebase/firestore');
        return sdk;
    } };
    runInNewContext(outputFiles[0].text, context);
    return { api: context.module.exports, db: {}, records, reads, updates, storage, sdk };
}

const id = '2026-11-06';
const path = `fights/${id}`;
const matchup = { left: { charName: 'Luffy' }, right: { charName: 'Zoro' } };
const plain = value => JSON.parse(JSON.stringify(value));

test('200 votes use the stored totals without reading the votes collection', async () => {
    const f = fixture({ [path]: { ...matchup, leftVotes: 120, rightVotes: 80 } });
    const fight = await f.api.loadFight(f.db, id, () => assert.fail('must not recreate'));
    assert.deepEqual(plain(f.api.voteCounts(fight.leftVotes, fight.rightVotes)), {
        left: 120, right: 80, leftPct: 60, rightPct: 40,
    });
    assert.deepEqual(f.reads, [path]);
});

test('rollout-day matchup starts fresh without reading its old vote records', async () => {
    const initial = { [path]: matchup };
    for (let i = 0; i < 200; i++) initial[`${path}/votes/user-${i}`] = { side: 'left' };
    const f = fixture(initial);
    const fight = await f.api.loadFight(f.db, id);
    assert.deepEqual(plain(f.api.voteCounts(fight.leftVotes, fight.rightVotes)), {
        left: 0, right: 0, leftPct: 0, rightPct: 0,
    });
    assert.deepEqual(f.reads, [path]);
    await f.api.submitFightVote(f.db, id, 'right', f.storage);
    const updated = f.records.get(path);
    assert.equal(updated.rightVotes, 1);
    assert.equal(f.api.voteCounts(updated.leftVotes, updated.rightVotes).rightPct, 100);
    assert.equal(f.records.size, 201, 'must not create any new vote records');
    assert.deepEqual(updated.left, matchup.left, 'preserve the existing matchup');
});

test('dates before rollout are unavailable without any Firebase read or write', async () => {
    const oldId = '2026-11-05';
    const oldPath = `fights/${oldId}`;
    const f = fixture({ [oldPath]: matchup });
    assert.equal(await f.api.loadFight(f.db, oldId, () => assert.fail('must not create')), null);
    await assert.rejects(f.api.submitFightVote(f.db, oldId, 'left', f.storage), /no longer available/);
    assert.deepEqual(f.reads, []);
    assert.deepEqual(f.updates, []);
    assert.equal(f.api.readStoredVote(oldId, f.storage), null);
    assert.deepEqual(f.records.get(oldPath), matchup);
});

test('concurrent first visitors create one matchup without overwriting it', async () => {
    const f = fixture();
    const fights = await Promise.all([
        f.api.loadFight(f.db, id, () => matchup),
        f.api.loadFight(f.db, id, () => ({ left: { charName: 'Sanji' }, right: { charName: 'Nami' } })),
    ]);
    assert.deepEqual(plain(fights[0]), plain(fights[1]));
    assert.equal(f.records.get(path).leftVotes, 0);
    assert.equal(f.records.get(path).rightVotes, 0);
    assert.equal(f.records.size, 1);
});

test('a missing fight is not created without a matchup factory', async () => {
    const f = fixture();
    assert.equal(await f.api.loadFight(f.db, id), null);
    assert.equal(f.records.size, 0);
});

test('concurrent votes increment one fight document without creating vote records', async () => {
    const fight = { ...matchup, leftVotes: 0, rightVotes: 0 };
    const f = fixture({ [path]: fight });
    await Promise.all(Array.from({ length: 20 }, (_, i) =>
        f.api.submitFightVote(f.db, id, i % 2 ? 'left' : 'right', localStorageFixture())));
    assert.equal(f.records.get(path).leftVotes, 10);
    assert.equal(f.records.get(path).rightVotes, 10);
    assert.equal(f.records.size, 1);
    assert.equal(f.updates.length, 20);
    assert.equal(f.reads.length, 0, 'incrementing needs no transaction read');
});

test('a saved local choice blocks further votes and survives reading it again', async () => {
    const fight = { ...matchup, leftVotes: 3, rightVotes: 2 };
    const f = fixture({ [path]: fight });
    const sides = await Promise.all([
        f.api.submitFightVote(f.db, id, 'left', f.storage),
        f.api.submitFightVote(f.db, id, 'right', f.storage),
    ]);
    assert.deepEqual(sides, ['left', 'left']);
    assert.equal(f.records.get(path).leftVotes, 4);
    assert.equal(f.records.get(path).rightVotes, 2);
    assert.equal(f.api.readStoredVote(id, f.storage), 'left');
    assert.equal(f.api.readStoredVote('2026-11-05', f.storage), null);
    assert.equal(f.updates.length, 1);
});

test('local choices are restored and invalid values ignored', () => {
    const f = fixture();
    f.storage.setItem(f.api.voteStorageKey(id), 'right');
    assert.equal(f.api.readStoredVote(id, f.storage), 'right');
    f.storage.setItem(f.api.voteStorageKey(id), 'invalid');
    assert.equal(f.api.readStoredVote(id, f.storage), null);
});

test('failed Firebase writes clear the local reservation so voting can be retried', async () => {
    const fight = { ...matchup, leftVotes: 0, rightVotes: 0 };
    const f = fixture({ [path]: fight });
    const write = f.sdk.updateDoc;
    f.sdk.updateDoc = async () => { throw new Error('offline'); };
    await assert.rejects(f.api.submitFightVote(f.db, id, 'left', f.storage), /offline/);
    assert.equal(f.api.readStoredVote(id, f.storage), null);
    assert.equal(f.records.get(path).leftVotes, 0);
    f.sdk.updateDoc = write;
    await f.api.submitFightVote(f.db, id, 'right', f.storage);
    assert.equal(f.records.get(path).rightVotes, 1);
});

test('blocked browser storage fails before a vote is sent', async () => {
    const fight = { ...matchup, leftVotes: 0, rightVotes: 0 };
    const f = fixture({ [path]: fight });
    const storage = { getItem: () => null, setItem: () => { throw new Error('storage blocked'); } };
    await assert.rejects(f.api.submitFightVote(f.db, id, 'left', storage), /storage blocked/);
    assert.equal(f.updates.length, 0);
});

test('votes from the old implementation do not block the fresh tally', async () => {
    const f = fixture({ [path]: { ...matchup, leftVotes: 0, rightVotes: 0 } });
    f.storage.setItem(`voted-${id}`, 'left');
    assert.equal(f.api.readStoredVote(id, f.storage), null);
    await f.api.submitFightVote(f.db, id, 'right', f.storage);
    assert.equal(f.api.readStoredVote(id, f.storage), 'right');
    assert.equal(f.records.get(path).rightVotes, 1);
});

test('permission denied is surfaced without marking the browser as voted', async () => {
    const f = fixture({ [path]: { ...matchup, leftVotes: 0, rightVotes: 0 } });
    f.sdk.updateDoc = async () => { throw Object.assign(new Error('Denied'), { code: 'permission-denied' }); };
    await assert.rejects(f.api.submitFightVote(f.db, id, 'left', f.storage), { code: 'permission-denied' });
    assert.equal(f.api.readStoredVote(id, f.storage), null);
    assert.equal(f.records.get(path).leftVotes, 0);
});

test('invalid votes and missing fights never increment totals', async () => {
    const f = fixture();
    await assert.rejects(f.api.submitFightVote(f.db, id, 'up', f.storage), /Invalid vote/);
    await assert.rejects(f.api.submitFightVote(f.db, id, 'left', f.storage), /not available/);
    assert.equal(f.api.readStoredVote(id, f.storage), null);
    assert.equal(f.records.size, 0);
});

test('zero totals return zero percentages without a query', async () => {
    const f = fixture();
    assert.deepEqual(plain(f.api.voteCounts()), {
        left: 0, right: 0, leftPct: 0, rightPct: 0,
    });
});

test('whole percentages always sum to 100 when there are votes', () => {
    const f = fixture();
    for (const [left, right] of [[1, 7], [7, 1], [1, 2], [0, 5], [5, 0], [1, 1]]) {
        const counts = f.api.voteCounts(left, right);
        assert.equal(counts.leftPct, Math.round(left / (left + right) * 100));
        assert.equal(counts.leftPct + counts.rightPct, 100);
    }
});

test('past fights show results immediately and still accept one browser vote', async () => {
    const totals = { ...matchup, leftVotes: 120, rightVotes: 80 };
    const f = fixture({ [path]: totals }, '2026-11-07T00:00:00Z');
    assert.deepEqual(plain(f.api.fightVotingState(id)), { canVote: true, showResults: true });
    const fight = await f.api.loadFight(f.db, id);
    assert.deepEqual(plain(f.api.voteCounts(fight.leftVotes, fight.rightVotes)), {
        left: 120, right: 80, leftPct: 60, rightPct: 40,
    });
    await f.api.submitFightVote(f.db, id, 'left', f.storage);
    assert.equal(f.api.readStoredVote(id, f.storage), 'left');
    assert.equal(f.records.get(path).leftVotes, 121);
    assert.equal(f.records.get(path).rightVotes, 80);
    assert.deepEqual(plain(f.api.fightVotingState(id, true)), { canVote: false, showResults: true });
    await f.api.submitFightVote(f.db, id, 'right', f.storage);
    assert.equal(f.updates.length, 1);
    assert.deepEqual(f.reads, [path]);
});

test('today stays voteable with results hidden until the browser votes', () => {
    const f = fixture();
    assert.deepEqual(plain(f.api.fightVotingState(id)), { canVote: true, showResults: false });
    assert.deepEqual(plain(f.api.fightVotingState(id, true)), { canVote: false, showResults: true });
});

test('a fight stays voteable after midnight and reveals results as history', async () => {
    const totals = { ...matchup, leftVotes: 1, rightVotes: 0 };
    const before = fixture({ [path]: totals }, '2026-11-06T23:59:59.999Z');
    const after = fixture({ [path]: totals }, '2026-11-07T00:00:00.000Z');
    assert.equal(before.api.fightVotingState(id).canVote, true);
    assert.equal(after.api.fightVotingState(id).canVote, true);
    assert.equal(after.api.fightVotingState(id).showResults, true);
    await after.api.submitFightVote(after.db, id, 'right', after.storage);
    assert.equal(after.records.get(path).rightVotes, 1);
    assert.equal(after.updates.length, 1);
});

test('missing past matchups and future fights are never created', async () => {
    const f = fixture({}, '2026-11-07T12:00:00Z');
    assert.equal(await f.api.loadFight(f.db, id, () => assert.fail('must not create past fight')), null);
    const future = '2026-11-08';
    assert.equal(await f.api.loadFight(f.db, future, () => assert.fail('must not create future fight')), null);
    assert.deepEqual(plain(f.api.fightVotingState(future)), { canVote: false, showResults: false });
    await assert.rejects(f.api.submitFightVote(f.db, future, 'left', f.storage), { code: 'fight-unavailable' });
    assert.deepEqual(f.reads, [path]);
    assert.equal(f.records.size, 0);
});

test('a previous fight and today each get an independent browser vote', async () => {
    const today = '2026-11-07';
    const todayPath = `fights/${today}`;
    const f = fixture({
        [path]: { ...matchup, leftVotes: 0, rightVotes: 0 },
        [todayPath]: { ...matchup, leftVotes: 0, rightVotes: 0 },
    }, '2026-11-07T12:00:00Z');
    await f.api.submitFightVote(f.db, id, 'left', f.storage);
    await f.api.submitFightVote(f.db, today, 'right', f.storage);
    assert.equal(f.api.readStoredVote(id, f.storage), 'left');
    assert.equal(f.api.readStoredVote(today, f.storage), 'right');
    assert.equal(f.records.get(path).leftVotes, 1);
    assert.equal(f.records.get(todayPath).rightVotes, 1);
    assert.equal(f.records.size, 2);
});
