import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { deleteApp, initializeApp } from 'firebase/app';
import {
    collection, connectFirestoreEmulator, deleteDoc, doc, getDocFromServer, getDocsFromServer,
    getFirestore, serverTimestamp, setDoc, Timestamp, updateDoc,
} from 'firebase/firestore';
import { deleteApp as deleteAdminApp, initializeApp as initializeAdminApp } from 'firebase-admin/app';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';

const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST;
const projectId = 'demo-community-poll';
const [host, port] = emulatorHost?.split(':') ?? [];

test('Firestore accepts only complete, private and final ballots during the voting window', {
    skip: !emulatorHost && 'Set FIRESTORE_EMULATOR_HOST to run this test against the rules emulator.',
}, async t => {
    const adminApp = initializeAdminApp({ projectId });
    t.after(() => deleteAdminApp(adminApp));
    const admin = getAdminFirestore(adminApp);
    const now = Date.now();
    const day = 86_400_000;
    const years = { open: '2096', future: '2097', closed: '2098', missing: '2099' };
    const uid = `voter-${now}`;
    const catalog = JSON.parse(await readFile(new URL('../public/data/fruits_v16.json', import.meta.url), 'utf8'));
    const [first, second, third, fourth] = catalog.map(fruit => fruit.id);
    const ballot = { first, second, third, createdAt: serverTimestamp() };

    function poll(year) {
        return `communityPolls/${year}`;
    }

    await Promise.all([
        [years.open, now - day, now + day],
        [years.future, now + day, now + 2 * day],
        [years.closed, now - 2 * day, now - day],
    ].map(([year, open, close]) => admin.doc(poll(year)).set({
        opensAt: Timestamp.fromMillis(open).toDate(),
        closesAt: Timestamp.fromMillis(close).toDate(),
    })));

    function client(name, uid) {
        const app = initializeApp({ projectId }, name);
        t.after(() => deleteApp(app));
        const db = getFirestore(app);
        connectFirestoreEmulator(db, host, Number(port), uid ? { mockUserToken: { sub: uid } } : {});
        return db;
    }

    const owner = client('owner', uid);
    const other = client('other', `${uid}-other`);
    const guest = client('guest');
    const ownerPath = `${poll(years.open)}/ballots/${uid}`;
    const ownBallot = doc(owner, ownerPath);
    const denied = { code: 'permission-denied' };

    assert.equal((await getDocFromServer(doc(guest, poll(years.open)))).exists(), true);
    assert.equal((await getDocFromServer(ownBallot)).exists(), false);
    await assert.rejects(setDoc(doc(guest, ownerPath), ballot), denied);
    await assert.rejects(setDoc(doc(other, ownerPath), ballot), denied);
    await assert.rejects(setDoc(ownBallot, { ...ballot, third: second }), denied);
    await assert.rejects(setDoc(ownBallot, { ...ballot, third: '' }), denied);
    await assert.rejects(setDoc(ownBallot, { ...ballot, third: 'x'.repeat(129) }), denied);
    await assert.rejects(setDoc(ownBallot, { ...ballot, createdAt: Timestamp.fromMillis(now) }), denied);
    await assert.rejects(setDoc(ownBallot, { ...ballot, points: 100 }), denied);
    await assert.rejects(setDoc(ownBallot, { first, second, createdAt: serverTimestamp() }), denied);
    for (const year of [years.future, years.closed, years.missing]) {
        await assert.rejects(setDoc(doc(owner, `${poll(year)}/ballots/${uid}`), ballot), denied);
    }

    await setDoc(ownBallot, ballot);
    // Catalog membership is checked during tallying, so Firestore can store this ballot.
    await setDoc(doc(other, poll(years.open), 'ballots', `${uid}-other`), { ...ballot, third: 'unknown' });
    await assert.rejects(setDoc(ownBallot, { ...ballot, first: fourth }), denied);
    await assert.rejects(updateDoc(ownBallot, { first: fourth }), denied);
    await assert.rejects(deleteDoc(ownBallot), denied);
    await assert.rejects(getDocFromServer(doc(other, ownerPath)), denied);
    await assert.rejects(getDocsFromServer(collection(owner, poll(years.open), 'ballots')), denied);
    const saved = (await getDocFromServer(ownBallot)).data();
    assert.deepEqual([saved.first, saved.second, saved.third], [first, second, third]);
    assert.ok(saved.createdAt instanceof Timestamp);
});
