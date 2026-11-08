import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getCharacterSeo, getCharactersSeo } from '../src/lib/characterSeo.js';
import { findFruitUserCharacter } from '../src/lib/characterLinks.js';
import { createCharacterAssets } from '../scripts/character-data.mjs';

const profiles = JSON.parse(readFileSync(new URL('../src/data/characterProfiles.json', import.meta.url), 'utf8'));
const fruits = JSON.parse(readFileSync(new URL('../public/data/fruits_v16.json', import.meta.url), 'utf8'));
const { index } = createCharacterAssets(profiles);

test('compact profiles and full biographies produce identical metadata before and after loading', () => {
    for (const [position, profile] of profiles.entries()) {
        const seo = getCharacterSeo(profile);
        assert.deepEqual(getCharacterSeo(index[position]), seo);
        assert.match(seo.image, /^https:\/\/onepiecedevilfruits\.com\//);
        assert.equal(seo.type, 'article');
        assert.ok(profile.seoDescription.length >= 100 && profile.seoDescription.length <= 160, profile.slug);
        assert.match(seo.description, /[.!?]$/);
        assert.doesNotMatch(seo.description, /…/);
        const page = seo.jsonLd['@graph'].find(item => item['@type'] === 'WebPage');
        assert.equal(page.url, seo.canonical);
        assert.equal(page.description, seo.description);
        assert.equal(page.image, seo.image);
        assert.ok(page.alternateName.includes(profile.alias));
    }
});

test('familiar agent names lead titles while regular names stay intact', () => {
    assert.equal(getCharacterSeo(profiles.find(p => p.slug === 'gem')).title, 'Mr. 5 (Gem) | One Piece Devil Fruits');
    assert.equal(getCharacterSeo(profiles.find(p => p.slug === 'bentham')).title, 'Mr. 2 Bon Clay (Bentham) | One Piece Devil Fruits');
    assert.equal(getCharacterSeo(profiles[0]).title, 'Monkey D. Luffy | One Piece Devil Fruits');
    assert.equal(getCharacterSeo().noindex, true);
    assert.equal(getCharacterSeo().jsonLd, undefined);
});

test('each listing page has matching canonical and structured data URLs', () => {
    const first = getCharactersSeo();
    const second = getCharactersSeo(2);
    assert.equal(first.canonical, 'https://onepiecedevilfruits.com/characters');
    assert.equal(second.canonical, 'https://onepiecedevilfruits.com/characters/page/2');
    assert.notEqual(first.title, second.title);
    assert.equal(second.jsonLd.url, second.canonical);
});

test('fruit links match the named current or previous user rather than assuming ownership', () => {
    for (const profile of profiles) {
        const fruit = fruits.find(fruit => fruit.id === profile.fruitId);
        const ownerName = fruit.user === profile.name ? fruit.user : fruit.previousUser;
        assert.equal(findFruitUserCharacter(index, fruit.id, ownerName)?.slug, profile.slug);
    }
    const ace = profiles.find(profile => profile.slug === 'portgas-d-ace');
    assert.equal(findFruitUserCharacter(index, ace.fruitId, 'Sabo'), undefined);
    assert.equal(findFruitUserCharacter(index, ace.fruitId, 'Portgas D. Ace')?.slug, ace.slug);
    const gem = profiles.find(profile => profile.slug === 'gem');
    assert.equal(findFruitUserCharacter(index, gem.fruitId, 'mr 5')?.slug, gem.slug);
    assert.equal(findFruitUserCharacter(index, ace.fruitId, 'Gem'), undefined);
    assert.equal(findFruitUserCharacter(index, gem.fruitId, 'Unknown'), undefined);
    assert.equal(findFruitUserCharacter(index, gem.fruitId, ''), undefined);
});
