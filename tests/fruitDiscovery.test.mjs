import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ABILITY_TAGS, FILTER_DEFAULTS, filterAndSortFruits, getAbilityTags, getRelatedFruits, readDiscoveryFilters } from '../src/lib/fruitDiscovery.js';

const catalog = JSON.parse(readFileSync(new URL('../public/data/fruits_v15.json', import.meta.url), 'utf8'));
const find = name => catalog.find(fruit => fruit.name.startsWith(name));
const filter = changes => ({ ...FILTER_DEFAULTS, ...changes });

test('all filters combine without silently dropping the arc or status', () => {
    const fruits = [
        { id: '1', name: 'Bird-Bird Fruit, Model: Phoenix', type: 'Mythical Zoan', debutArc: 'Marineford', isCanon: true, isAwakened: true },
        { id: '2', name: 'Bird-Bird Fruit, Model: Albatross', type: 'Zoan', debutArc: 'Marineford', isCanon: true, isAwakened: true },
        { id: '3', name: 'Bird-Bird Fruit, Model: Phoenix', type: 'Mythical Zoan', debutArc: 'Wano Country', isCanon: true, isAwakened: true },
        { id: '4', name: 'Bird-Bird Fruit, Model: Phoenix', type: 'Mythical Zoan', debutArc: 'Marineford', isCanon: false, isAwakened: true },
        { id: '5', name: 'Bird-Bird Fruit, Model: Phoenix', type: 'Mythical Zoan', debutArc: 'Marineford', isCanon: true, isAwakened: false },
    ];
    assert.deepEqual(filterAndSortFruits(fruits, filter({ arc: 'Marineford', canon: 'canon', awakening: 'awakened', subtype: 'Mythical Zoan', ability: 'flight' })).map(fruit => fruit.id), ['1']);
    assert.equal(fruits.length, 5);
});

test('unknown statuses are distinct from explicitly false values', () => {
    const fruits = [
        { id: '1', name: 'A', isCanon: false, isAwakened: false },
        { id: '2', name: 'B' },
        { id: '3', name: 'C', isCanon: true, isAwakened: true },
    ];
    assert.deepEqual(filterAndSortFruits(fruits, filter({ canon: 'unknown', awakening: 'unknown' })).map(fruit => fruit.id), ['2']);
    assert.deepEqual(filterAndSortFruits(fruits, filter({ canon: 'non-canon', awakening: 'not-confirmed' })).map(fruit => fruit.id), ['1']);
});

test('unknown URL values fall back safely and valid combinations round-trip', () => {
    assert.deepEqual(readDiscoveryFilters(new URLSearchParams('canon=banana&ability=water&sort=invalid&page=-8')), FILTER_DEFAULTS);
    const selected = filter({ arc: 'Wano Country', canon: 'canon', awakening: 'awakened', subtype: 'Mythical Zoan', ability: 'flight', sort: 'debut-desc' });
    assert.deepEqual(readDiscoveryFilters(new URLSearchParams(selected)), selected);
});

test('debut sorting keeps unknown arcs last in both directions', () => {
    const fruits = [{ id: 'u', name: 'Unknown' }, { id: 'late', name: 'Late', debutArc: 'Wano Country' }, { id: 'early', name: 'Early', debutArc: 'Romance Dawn' }];
    assert.deepEqual(filterAndSortFruits(fruits, filter({ sort: 'debut-asc' })).map(fruit => fruit.id), ['early', 'late', 'u']);
    assert.deepEqual(filterAndSortFruits(fruits, filter({ sort: 'debut-desc' })).map(fruit => fruit.id), ['late', 'early', 'u']);
    assert.deepEqual(fruits.map(fruit => fruit.id), ['u', 'late', 'early']);
});

test('alphabetical sorting reverses correctly and same-arc debuts use A–Z', () => {
    const fruits = [{ id: 'b', name: 'Beta', debutArc: 'Wano Country' }, { id: 'a', name: 'Alpha', debutArc: 'Wano Country' }];
    assert.deepEqual(filterAndSortFruits(fruits, filter({ sort: 'name-desc' })).map(fruit => fruit.id), ['b', 'a']);
    assert.deepEqual(filterAndSortFruits(fruits, filter({ sort: 'debut-desc' })).map(fruit => fruit.id), ['a', 'b']);
});

test('ability tags describe powers, not words mentioned in weaknesses', () => {
    assert.deepEqual(getAbilityTags({ name: 'Unlisted Fruit', type: 'Paramecia', weaknesses: ['Poison, ice, and flight'] }), []);
    assert.ok(getAbilityTags(find('Bird-Bird Fruit, Model: Phoenix')).some(tag => tag.id === 'healing'));
    assert.ok(!getAbilityTags(find('Dog-Dog Fruit, Model: Jackal')).some(tag => tag.id === 'flight'));
    assert.ok(!getAbilityTags(find('Human-Human Fruit, Model: Buddha')).some(tag => tag.id === 'flight'));
});

test('curated comparisons outrank broad similarities and work in both directions', () => {
    assert.equal(getRelatedFruits(find('Flame-Flame'), catalog)[0].id, find('Mag-Mag').id);
    assert.equal(getRelatedFruits(find('Mag-Mag'), catalog)[0].id, find('Flame-Flame').id);
    assert.match(getRelatedFruits(find('Barrier-Barrier'), catalog)[0].reason, /diamond/);
});

test('recommendations are stable, exclude the current fruit, and do not mutate data', () => {
    const original = catalog.map(fruit => fruit.id);
    const current = find('Heal-Heal');
    const first = getRelatedFruits(current, catalog);
    assert.deepEqual(first, getRelatedFruits(current, catalog));
    assert.ok(first.length > 0 && first.length <= 5);
    assert.ok(first.every(fruit => fruit.id !== current.id && fruit.reason.length > 15));
    assert.ok(first.some(fruit => fruit.name.startsWith('Bird-Bird Fruit, Model: Phoenix')));
    assert.deepEqual(catalog.map(fruit => fruit.id), original);
});

test('a shared broad category alone does not create unrelated Paramecia suggestions', () => {
    assert.deepEqual(getRelatedFruits({ id: 'a', name: 'Unlisted A', type: 'Paramecia' }, [{ id: 'b', name: 'Unlisted B', type: 'Paramecia' }]), []);
});

test('catalog tags and recommendation targets are valid across the full dataset', () => {
    const validTags = new Set(ABILITY_TAGS.map(tag => tag.id));
    for (const fruit of catalog) {
        assert.ok(getAbilityTags(fruit).every(tag => validTags.has(tag.id)), fruit.name);
        const related = getRelatedFruits(fruit, catalog);
        assert.equal(new Set(related.map(other => other.id)).size, related.length, fruit.name);
        assert.ok(related.every(other => other.id !== fruit.id && catalog.some(entry => entry.id === other.id)), fruit.name);
    }
});
