import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { filterCharacters } from '../src/lib/characterCatalog.js';
import { FRUIT_ARC_ORDER } from '../src/lib/fruitArcs.js';

const fruits = JSON.parse(readFileSync(new URL('../public/data/fruits_v16.json', import.meta.url), 'utf8'));
const characterProfiles = JSON.parse(readFileSync(new URL('../src/data/characterProfiles.json', import.meta.url), 'utf8'));

test('the roster covers only existing canon fruits through Arabasta, once each', () => {
    const cutoff = FRUIT_ARC_ORDER.indexOf('Arabasta');
    // Chaka is canon; the existing fruit record leaves isCanon unset.
    const eligible = fruits.filter(fruit => (fruit.isCanon || fruit.user === 'Chaka') && FRUIT_ARC_ORDER.indexOf(fruit.debutArc) >= 0 && FRUIT_ARC_ORDER.indexOf(fruit.debutArc) <= cutoff);
    assert.equal(characterProfiles.length, 21);
    assert.equal(new Set(characterProfiles.map(profile => profile.slug)).size, 21);
    assert.deepEqual(characterProfiles.map(profile => profile.fruitId).sort(), eligible.map(fruit => fruit.id).sort());
    for (const profile of characterProfiles) {
        assert.ok(FRUIT_ARC_ORDER.indexOf(profile.debutArc) <= cutoff);
        assert.equal(profile.fruitName, fruits.find(fruit => fruit.id === profile.fruitId).name);
        assert.ok(existsSync(new URL(`../public${profile.portrait}`, import.meta.url)), profile.portrait);
    }
});

test('names, aliases, fruit names and groups can be searched together', () => {
    assert.deepEqual(filterCharacters(characterProfiles, 'MR. 2', 'Baroque Works').map(profile => profile.slug), ['bentham']);
    assert.deepEqual(filterCharacters(characterProfiles, 'gomu gomu').map(profile => profile.slug), ['monkey-d-luffy']);
    assert.deepEqual(filterCharacters(characterProfiles, 'モンキー').map(profile => profile.slug), ['monkey-d-luffy']);
    assert.deepEqual(filterCharacters(characterProfiles, 'Sumoka').map(profile => profile.slug), ['smoker']);
    assert.deepEqual(filterCharacters(characterProfiles, 'fire fist', 'Marines'), []);
    assert.deepEqual(filterCharacters(characterProfiles, 'not-a-character'), []);
    assert.equal(filterCharacters(characterProfiles, '   ').length, 21);
    assert.equal(filterCharacters(characterProfiles, '', 'Marines').length, 2);
});

test('profiles have full biographies, original names, and separate story outcomes', () => {
    for (const profile of characterProfiles) {
        const sections = [...profile.background, ...profile.personality, ...profile.combat, ...profile.story];
        const copy = [profile.about, ...sections, ...profile.details, ...profile.relationships.map(relationship => relationship.text)].join(' ');
        assert.ok(copy.split(/\s+/).length >= 350, `${profile.name} needs more detail`);
        assert.ok(copy.split(/\s+/).length <= 700, `${profile.name} is too long`);
        assert.ok(profile.details.length >= 3);
        assert.match(profile.japaneseName, /[\u3040-\u30ff]/u);
        assert.ok(profile.romanizedName.length > 0);
        assert.ok(profile.firstAppearance.startsWith('Chapter'));
        assert.ok(profile.background.length >= 2);
        assert.ok(profile.personality.length >= 2);
        assert.ok(profile.combat.length >= 2);
        assert.ok(profile.story.length >= 2);
        assert.ok(profile.relationships.length >= 2);
        assert.doesNotMatch(copy, /\b(Nika|Joy Boy|Haki|Sabo|Gear [2-5]|Cross Guild|Impel Down|Marineford|Dressrosa|Wano|Ohara)\b/i);
        assert.doesNotMatch([profile.role, profile.alias, profile.fruitType, profile.fruitRomanizedName].join(' '), /\b(Nika|Joy Boy|Sabo|Emperor|Mythical)\b/i);
    }
    const ace = characterProfiles.find(profile => profile.slug === 'portgas-d-ace');
    assert.match(ace.portrait, /Ace/);
    assert.equal(ace.fruitName, 'Flame-Flame Fruit');
    assert.equal(characterProfiles.find(profile => profile.slug === 'monkey-d-luffy').fruitType, 'Paramecia');
});
