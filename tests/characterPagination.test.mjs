import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { paginateCharacters, characterPageUrl, CHARACTER_PAGE_SIZE } from '../src/lib/characterCatalog.js';
import { createCharacterAssets } from '../scripts/character-data.mjs';
import { loadCharacterProfile } from '../src/lib/characterProfilesApi.js';

const profiles = JSON.parse(readFileSync(new URL('../src/data/characterProfiles.json', import.meta.url), 'utf8'));

test('pages contain at most 12 characters with complete, non-overlapping coverage', () => {
    const first = paginateCharacters(profiles);
    const last = paginateCharacters(profiles, { page: 2 });
    assert.equal(first.visible.length, CHARACTER_PAGE_SIZE);
    assert.equal(last.visible.length, 9);
    assert.deepEqual([first.rangeStart, first.rangeEnd, last.rangeStart, last.rangeEnd], [1, 12, 13, 21]);
    assert.equal(first.totalPages, 2);
    assert.deepEqual([...first.visible, ...last.visible], profiles);
    const larger = [...profiles, ...profiles];
    assert.equal(paginateCharacters(larger, { page: 4 }).visible.length, 6);
    assert.equal(larger.length, 42);
});

test('search and group filters run across the roster before pagination', () => {
    const found = paginateCharacters(profiles, { query: 'crocodile' });
    assert.equal(found.visible[0].slug, 'crocodile');
    assert.equal(found.totalPages, 1);
    const marines = paginateCharacters(profiles, { group: 'Marines', page: 2 });
    assert.equal(marines.currentPage, 1);
    assert.equal(marines.total, 2);
    assert.deepEqual(marines.visible.map(profile => profile.slug), ['smoker', 'hina']);
    const empty = paginateCharacters(profiles, { query: 'crocodile', group: 'Marines' });
    assert.deepEqual([empty.total, empty.totalPages, empty.rangeStart, empty.rangeEnd], [0, 1, 0, 0]);
    assert.deepEqual(empty.visible, []);
});

test('invalid or excessive page numbers resolve to an existing page', () => {
    for (const page of [undefined, '', 'invalid', '-3', '1.5', 'Infinity', '999999999999999999999999']) {
        assert.equal(paginateCharacters(profiles, { page }).currentPage, 1);
    }
    assert.equal(paginateCharacters(profiles, { page: '999' }).currentPage, 2);
    assert.equal(paginateCharacters([], { page: 999 }).currentPage, 1);
});

test('page links retain search and group filters and use the canonical first page', () => {
    const params = new URLSearchParams({ q: 'Mr. 2', group: 'Baroque Works', page: '99' });
    assert.equal(characterPageUrl(1), '/characters');
    const next = new URL(characterPageUrl(2, params), 'https://example.com');
    assert.equal(next.pathname, '/characters/page/2');
    assert.equal(next.searchParams.get('q'), 'Mr. 2');
    assert.equal(next.searchParams.get('group'), 'Baroque Works');
    assert.equal(next.searchParams.has('page'), false);
    assert.equal(params.get('page'), '99');
});

test('the list index excludes biographies while each detail file contains just one profile', () => {
    const { index, assets } = createCharacterAssets(profiles);
    assert.equal(index.length, profiles.length);
    assert.equal(assets.size, profiles.length);
    for (const [position, entry] of index.entries()) {
        assert.equal(entry.name, profiles[position].name);
        assert.equal(entry.about, profiles[position].about);
        for (const field of ['background', 'personality', 'combat', 'relationships', 'story', 'details']) {
            assert.equal(Object.hasOwn(entry, field), false);
        }
        assert.deepEqual(JSON.parse(assets.get(entry.profilePath)), profiles[position]);
    }
    const edited = { ...profiles[0], background: ['Updated biography'] };
    assert.notEqual(createCharacterAssets([edited]).index[0].profilePath, index[0].profilePath);
    assert.throws(() => createCharacterAssets([profiles[0], profiles[0]]), /duplicate/);
    assert.throws(() => createCharacterAssets([{ ...profiles[0], slug: '../invalid' }]), /Invalid/);
});

test('detail requests fetch only the selected biography, share requests, and allow retry', async t => {
    const { index, assets } = createCharacterAssets(profiles);
    const calls = [];
    let fail = true;
    t.mock.method(globalThis, 'fetch', async path => {
        calls.push(path);
        if (path === index[1].profilePath && fail) return { ok: false };
        return { ok: true, json: async () => JSON.parse(assets.get(path)) };
    });
    const [first, repeat] = await Promise.all([loadCharacterProfile(index[0]), loadCharacterProfile(index[0])]);
    assert.equal(first.slug, profiles[0].slug);
    assert.equal(first, repeat);
    assert.deepEqual(calls, [index[0].profilePath]);
    await assert.rejects(loadCharacterProfile(index[1]), /could not load/);
    fail = false;
    assert.equal((await loadCharacterProfile(index[1])).slug, profiles[1].slug);
    assert.equal(calls.length, 3);
});
