import test from 'node:test';
import assert from 'node:assert/strict';
import { calculatePollResults, detectBallotBursts } from '../src/lib/pollResults.mjs';

const fruits = [
    { id: 'a', name: 'Alpha' },
    { id: 'b', name: 'Beta' },
    { id: 'c', name: 'Gamma' },
    { id: 'd', name: 'Delta' },
];

test('scores ballots and applies tie-breakers in order', () => {
    const results = calculatePollResults([
        { first: 'a', second: 'b', third: 'c' },
        { first: 'b', second: 'a', third: 'c' },
        { first: 'a', second: 'b', third: 'd' },
    ], fruits);

    assert.equal(results.totalVoters, 3);
    assert.deepEqual(results.ranking.slice(0, 3).map(fruit => [
        fruit.id, fruit.points, fruit.firstPlaceVotes, fruit.secondPlaceVotes,
    ]), [
        ['a', 8, 2, 1],
        ['b', 7, 1, 2],
        ['c', 2, 0, 0],
    ]);
});

test('breaks a points tie using first-place votes', () => {
    const results = calculatePollResults([
        { first: 'a', second: 'b', third: 'd' },
        { first: 'c', second: 'd', third: 'b' },
    ], fruits);

    const rank = id => results.ranking.findIndex(fruit => fruit.id === id);
    assert.ok(rank('a') < rank('b'));
    assert.equal(results.ranking[rank('a')].points, 3);
    assert.equal(results.ranking[rank('a')].firstPlaceVotes, 1);
    assert.equal(results.ranking[rank('b')].points, 3);
    assert.equal(results.ranking[rank('b')].firstPlaceVotes, 0);
});

test('breaks a points and first-place tie using second-place votes', () => {
    const results = calculatePollResults([
        { first: 'a', second: 'c', third: 'd' },
        { first: 'b', second: 'a', third: 'c' },
        { first: 'c', second: 'd', third: 'b' },
        { first: 'd', second: 'c', third: 'b' },
    ], fruits);

    const rank = id => results.ranking.findIndex(fruit => fruit.id === id);
    assert.ok(rank('a') < rank('b'));
    assert.deepEqual([
        results.ranking[rank('a')].points,
        results.ranking[rank('a')].firstPlaceVotes,
        results.ranking[rank('a')].secondPlaceVotes,
    ], [5, 1, 1]);
    assert.deepEqual([
        results.ranking[rank('b')].points,
        results.ranking[rank('b')].firstPlaceVotes,
        results.ranking[rank('b')].secondPlaceVotes,
    ], [5, 1, 0]);
});

test('uses alphabetical order when all score tie-breakers match', () => {
    const results = calculatePollResults([], fruits, { topN: 4 });
    assert.deepEqual(results.ranking.map(fruit => fruit.name), ['Alpha', 'Beta', 'Delta', 'Gamma']);
});

test('ignores ballots with unknown or repeated fruit ids', () => {
    const results = calculatePollResults([
        { first: 'a', second: 'missing', third: 'c' },
        { first: 'a', second: 'a', third: 'c' },
        { first: 'a', second: 'b', third: 'c' },
    ], fruits);

    assert.equal(results.totalVoters, 1);
    assert.equal(results.ignoredBallots, 2);
});

test('flags bursts of ballots created within the configured interval', () => {
    const bursts = detectBallotBursts([
        { createdAt: '2026-12-01T10:00:00.000Z' },
        { createdAt: '2026-12-01T10:00:01.000Z' },
        { createdAt: '2026-12-01T10:00:04.000Z' },
        { createdAt: '2026-12-01T10:00:20.000Z' },
    ]);

    assert.equal(bursts.length, 1);
    assert.equal(bursts[0].ballots, 3);
});
