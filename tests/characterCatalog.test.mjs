import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { filterCharacters, getCharacterStory } from '../src/lib/characterCatalog.js';
import { FRUIT_ARC_ORDER } from '../src/lib/fruitArcs.js';

const fruits = JSON.parse(readFileSync(new URL('../public/data/fruits_v16.json', import.meta.url), 'utf8'));
const characterProfiles = JSON.parse(readFileSync(new URL('../src/data/characterProfiles.json', import.meta.url), 'utf8'));

test('the roster covers existing fruit users introduced through Arabasta, including anime-only debuts', () => {
    const cutoff = FRUIT_ARC_ORDER.indexOf('Arabasta');
    const eligible = fruits.filter(fruit => FRUIT_ARC_ORDER.indexOf(fruit.debutArc) >= 0 && FRUIT_ARC_ORDER.indexOf(fruit.debutArc) <= cutoff);
    assert.equal(new Set(characterProfiles.map(profile => profile.slug)).size, characterProfiles.length);
    assert.deepEqual(characterProfiles.filter(profile => profile.canon === false).map(profile => profile.slug).sort(), ['apis', 'eric']);
    assert.deepEqual(characterProfiles.map(profile => profile.fruitId).sort(), eligible.map(fruit => fruit.id).sort());
    for (const profile of characterProfiles) {
        const debut = FRUIT_ARC_ORDER.indexOf(profile.debutArc);
        const fruit = fruits.find(fruit => fruit.id === profile.fruitId);
        assert.ok(debut >= 0 && debut <= cutoff);
        assert.equal(profile.fruitName, fruit.name);
        assert.equal(profile.canon === false, fruit.isCanon === false);
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
    assert.equal(filterCharacters(characterProfiles, '   ').length, characterProfiles.length);
    assert.equal(filterCharacters(characterProfiles, 'warship', 'Non-canon').length, 2);
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
        assert.match(profile.firstAppearance, profile.canon === false ? /^Episode / : /^Chapter /);
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

test('later manga stories are separate from early profiles and anime-only stories', () => {
    for (const profile of characterProfiles) {
        const story = getCharacterStory(profile);
        assert.equal(story.sections[0].paragraphs, profile.story);
        if (profile.canon === false) {
            assert.equal(story.warning, 'Anime-only story');
            assert.equal(story.sections.length, 1);
        } else {
            assert.equal(story.warning, 'Includes later manga spoilers');
            assert.ok(story.sections.length > 1, profile.slug);
            for (const section of story.sections.slice(1)) {
                assert.ok(section.title.trim());
                assert.ok(section.paragraphs.length && section.paragraphs.every(text => text.trim()));
            }
        }
    }
    const luffy = characterProfiles.find(profile => profile.slug === 'monkey-d-luffy');
    assert.match(getCharacterStory(luffy).sections.at(-1).title, /Elbaph/);
});
