import test from 'node:test';
import assert from 'node:assert/strict';
import { createRankingRound, rankingReducer, restoreRankingRound, rankingShareText, RANKING_SCENARIOS } from '../src/lib/blindRanking.js';

const fruits = Array.from({ length: 20 }, (_, index) => ({ id: `fruit-${index}`, name: `Fruit ${index}` }));
const makeRound = () => createRankingRound(fruits, { random: () => 0 });
const place = (round, rank) => rankingReducer(round, { type: 'PLACE', rank, fruitId: round.deck[round.cursor] });
const reroll = round => rankingReducer(round, { type: 'REROLL', fruitId: round.deck[round.cursor] });

test('draws eleven distinct fruits without changing the catalog', () => {
    const original = structuredClone(fruits);
    const round = createRankingRound([...fruits, fruits[0]], { random: () => .4 });
    assert.equal(round.deck.length, 11);
    assert.equal(new Set(round.deck).size, 11);
    assert.equal(round.slots.filter(Boolean).length, 0);
    assert.equal(round.rerollsLeft, 1);
    assert.deepEqual(fruits, original);
    assert.throws(() => createRankingRound(fruits.slice(0, 10)));
});

test('each scenario can be drawn randomly and the next round gets a different scenario', () => {
    RANKING_SCENARIOS.forEach((scenario, index) => {
        const round = createRankingRound(fruits, { random: () => (index + .1) / RANKING_SCENARIOS.length });
        assert.equal(round.scenarioId, scenario.id);
        for (const value of [0, .999]) {
            const replay = createRankingRound(fruits, { random: () => value, previousScenarioId: round.scenarioId });
            assert.notEqual(replay.scenarioId, round.scenarioId);
            assert.ok(RANKING_SCENARIOS.some(item => item.id === replay.scenarioId));
        }
    });
});

test('a placement locks the chosen slot and reveals exactly one next fruit', () => {
    const initial = makeRound();
    const next = place(initial, 7);
    assert.equal(next.slots[6], initial.deck[0]);
    assert.equal(next.cursor, 1);
    assert.equal(next.phase, 'playing');
    assert.equal(initial.slots[6], null);
    assert.equal(place(next, 7), next);
    assert.equal(next.slots[6], initial.deck[0]);
});

test('duplicate pointer or keyboard events cannot place an old fruit twice', () => {
    const initial = makeRound();
    const next = place(initial, 10);
    assert.equal(rankingReducer(next, { type: 'PLACE', rank: 9, fruitId: initial.deck[0] }), next);
    for (const rank of [0, 11, 1.5, '2', NaN]) assert.equal(place(next, rank), next);
});

test('the single reroll skips a fruit permanently and cannot be repeated', () => {
    const initial = makeRound();
    const next = reroll(initial);
    assert.equal(next.cursor, 1);
    assert.equal(next.rerollsLeft, 0);
    assert.equal(next.slots.filter(Boolean).length, 0);
    assert.equal(reroll(next), next);
    let completed = next;
    for (let rank = 10; rank >= 1; rank--) completed = place(completed, rank);
    assert.equal(completed.phase, 'complete');
    assert.ok(!completed.slots.includes(initial.deck[0]));
    assert.equal(new Set(completed.slots).size, 10);
});

test('the reroll still works on the tenth fruit', () => {
    let round = makeRound();
    for (let rank = 10; rank >= 2; rank--) round = place(round, rank);
    const skipped = round.deck[round.cursor];
    round = reroll(round);
    round = place(round, 1);
    assert.equal(round.phase, 'complete');
    assert.equal(round.cursor, 11);
    assert.ok(!round.slots.includes(skipped));
    assert.equal(reroll(round), round);
    assert.equal(place(round, 1), round);
});

test('refresh restores the same draw, locked ranks, scenario, and reroll allowance', () => {
    let round = makeRound();
    round = place(round, 8);
    round = reroll(round);
    round = place(round, 3);
    assert.deepEqual(restoreRankingRound(JSON.parse(JSON.stringify(round)), fruits), round);
    let completed = makeRound();
    for (let rank = 10; rank >= 1; rank--) completed = place(completed, rank);
    assert.deepEqual(restoreRankingRound(completed, fruits), completed);
});

test('damaged saved rounds cannot duplicate fruits or restore extra rerolls', () => {
    const round = place(makeRound(), 10);
    assert.equal(restoreRankingRound(null, fruits), null);
    assert.equal(restoreRankingRound({ ...round, rerollsLeft: 2 }, fruits), null);
    assert.equal(restoreRankingRound({ ...round, cursor: 8 }, fruits), null);
    assert.equal(restoreRankingRound({ ...round, slots: Array(10).fill(round.deck[0]) }, fruits), null);
    assert.equal(restoreRankingRound({ ...round, deck: Array(11).fill(round.deck[0]) }, fruits), null);
    assert.equal(restoreRankingRound(round, fruits.filter(fruit => fruit.id !== round.deck[0])), null);
    const futureSlot = [...round.slots];
    futureSlot[9] = round.deck[8];
    assert.equal(restoreRankingRound({ ...round, slots: futureSlot }, fruits), null);
});

test('older saved rankings keep their best-to-worst order under the new scale', () => {
    const round = place(place(makeRound(), 10), 3);
    const legacy = structuredClone(round);
    delete legacy.version;
    const restored = restoreRankingRound(legacy, fruits);
    assert.equal(restored.slots[0], round.slots[9]);
    assert.equal(restored.slots[7], round.slots[2]);
    assert.equal(restored.cursor, round.cursor);
    assert.deepEqual(restoreRankingRound(restored, fruits), restored);
});

test('a completed share contains every rank and the scenario, without a hidden draw', () => {
    let round = makeRound();
    for (let rank = 10; rank >= 1; rank--) round = place(round, rank);
    const text = rankingShareText(round, fruits);
    assert.match(text, /Island rescue/);
    assert.match(text, /1 = best fit · 10 = worst fit/);
    const rankedLines = text.split('\n').filter(line => /^\d+\./.test(line));
    assert.deepEqual(rankedLines.map(line => Number(line.split('.')[0])), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    assert.equal(rankedLines[0], `1. ${fruits.find(fruit => fruit.id === round.slots[0]).name}`);
    assert.match(text, /https:\/\/onepiecedevilfruits.com\/blind-ranking/);
    const socialText = rankingShareText(round, fruits, { includeUrl: false });
    assert.ok(!socialText.includes('https://'));
    assert.deepEqual(socialText.split('\n').slice(0, -1), text.split('\n').slice(0, -1));
    assert.equal(new Set(RANKING_SCENARIOS.map(scenario => scenario.id)).size, RANKING_SCENARIOS.length);
});
