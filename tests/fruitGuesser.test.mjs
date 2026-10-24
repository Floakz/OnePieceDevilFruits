import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import details from '../src/lib/fruits/fruitsExpandedInfo.js';
import { MAX_GUESSES, GUESSER_CLUES, getGuesserCatalog, createGuesserRound, guesserReducer, compareGuesserFruits, searchGuesserFruits, clueDescription } from '../src/lib/fruitGuesser.js';

const fruits = getGuesserCatalog(JSON.parse(readFileSync(new URL('../public/data/fruits_v16.json', import.meta.url), 'utf8')), details);
const makeRound = () => createGuesserRound(fruits, { random: () => 0 });
const guess = (round, fruit) => guesserReducer(round, { type: 'GUESS', fruitId: fruit.id });

test('every catalog fruit has local silhouette artwork and all five numeric clues', () => {
    assert.equal(fruits.length, 148);
    assert.equal(new Set(fruits.map(fruit => fruit.id)).size, fruits.length);
    for (const fruit of fruits) {
        assert.ok(existsSync(new URL(`../public/images/fruits/${fruit.id}.webp`, import.meta.url)));
        const clues = compareGuesserFruits(fruit, fruit);
        assert.equal(Object.keys(clues).length, GUESSER_CLUES.length);
        for (const key of ['power', 'attack', 'defense', 'utility', 'rarity']) assert.equal(clues[key].status, 'correct', `${fruit.name}: ${key}`);
    }
});

test('random rounds cover the catalog and never immediately repeat a target', () => {
    fruits.forEach((fruit, index) => assert.equal(createGuesserRound(fruits, { random: () => (index + .1) / fruits.length }).targetId, fruit.id));
    for (const random of [() => 0, () => .999]) {
        const initial = createGuesserRound(fruits, { random });
        assert.notEqual(createGuesserRound(fruits, { random, previousId: initial.targetId }).targetId, initial.targetId);
    }
    assert.equal(createGuesserRound([]), null);
    assert.equal(createGuesserRound(fruits.slice(0, 1), { previousId: fruits[0].id }).targetId, fruits[0].id);
});

test('exactly seven different wrong guesses end a round, with no further guesses accepted', () => {
    assert.equal(MAX_GUESSES, 7);
    let round = makeRound();
    for (let index = 1; index <= MAX_GUESSES; index++) {
        round = guess(round, fruits[index]);
        assert.equal(round.phase, index === MAX_GUESSES ? 'lost' : 'playing');
    }
    assert.equal(round.guesses.length, 7);
    assert.equal(guess(round, fruits[0]), round);
    assert.equal(guess(round, fruits[6]), round);
});

test('the seventh guess can win and a completed round can start fresh', () => {
    let round = makeRound();
    for (let index = 1; index < MAX_GUESSES; index++) round = guess(round, fruits[index]);
    round = guess(round, fruits[0]);
    assert.equal(round.phase, 'won');
    assert.equal(round.guesses.length, 7);
    assert.equal(guess(round, fruits[5]), round);
    const next = createGuesserRound(fruits, { previousId: round.targetId });
    assert.deepEqual(guesserReducer(round, { type: 'START', round: next }), next);
    assert.equal(next.guesses.length, 0);
});

test('duplicates and invalid choices do not consume attempts or mutate the round', () => {
    const initial = makeRound();
    const next = guess(initial, fruits[1]);
    assert.deepEqual(initial.guesses, []);
    assert.equal(guess(next, fruits[1]), next);
    assert.equal(guesserReducer(next, { type: 'GUESS', fruitId: 'not-a-fruit' }), next);
});

test('score arrows point from the guess toward the hidden target, including close values and string ratings', () => {
    const clues = compareGuesserFruits({ power: 50, rarity: '5', ratings: { attack: 80, defense: 40, utility: 20 } }, { power: 60, rarity: 5, ratings: { attack: 30, defense: 40, utility: 25 } });
    assert.equal(clues.power.direction, 'higher');
    assert.equal(clues.power.status, 'partial');
    assert.equal(clues.attack.direction, 'lower');
    assert.equal(clues.attack.status, 'incorrect');
    assert.equal(clues.defense.status, 'correct');
    assert.equal(clues.rarity.status, 'correct');
    assert.match(clueDescription(clues.attack, 'Attack'), /mystery fruit is lower/);
});

test('unknown data never becomes a false match or a numeric zero', () => {
    const clues = compareGuesserFruits({ power: '', ratings: { attack: null }, isCanon: null }, {});
    for (const clue of Object.values(clues)) assert.equal(clue.status, 'unknown');
    assert.equal(clues.power.value, 'Unknown');
    assert.equal(clues.power.direction, null);
    assert.equal(compareGuesserFruits({ isAwakened: false }, { isAwakened: false }).awakening.status, 'correct');
});

test('Zoan subtypes and overlapping abilities are partial matches', () => {
    const clues = compareGuesserFruits({ name: 'Bird-Bird Fruit, Model: Phoenix', type: 'Mythical Zoan' }, { name: 'Bird-Bird Fruit, Model: Albatross', type: 'Zoan' });
    assert.equal(clues.type.status, 'partial');
    assert.equal(clues.abilities.status, 'partial');
    assert.equal(compareGuesserFruits({ name: 'Bomb-Bomb Fruit', type: 'Paramecia' }, { name: 'Pop-Pop Fruit', type: 'Paramecia' }).abilities.status, 'correct');
});

test('arc and episode arrows follow chronology, without treating movies as later arcs', () => {
    assert.equal(compareGuesserFruits({ debutArc: 'Romance Dawn', firstAppearance: 'Episode 1' }, { debutArc: 'Wano Country', firstAppearance: 'Episode 900' }).arc.direction, 'later');
    assert.equal(compareGuesserFruits({ debutArc: 'Wano Country', firstAppearance: 'Episode 900' }, { debutArc: 'Romance Dawn', firstAppearance: 'Episode 1' }).appearance.direction, 'earlier');
    assert.equal(compareGuesserFruits({ debutArc: 'One Piece Film: Gold (Movie)' }, { debutArc: 'Romance Dawn' }).arc.direction, undefined);
});

test('search supports translated names, original names and users, excluding past guesses', () => {
    const op = fruits.find(fruit => fruit.name === 'Op-Op Fruit');
    for (const query of ['op op', op.romanizedName, op.japaneseName, op.user]) assert.ok(searchGuesserFruits(fruits, query).some(fruit => fruit.id === op.id));
    assert.equal(searchGuesserFruits(fruits, 'op op', [op.id]).length, 0);
    assert.deepEqual(searchGuesserFruits(fruits, ' '), []);
});
