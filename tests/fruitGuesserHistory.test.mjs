import test from 'node:test';
import assert from 'node:assert/strict';
import { MAX_GUESSES } from '../src/lib/fruitGuesser.js';
import { GUESSER_STORAGE_KEY, RECENT_RUN_LIMIT, emptyGuesserProgress, parseGuesserProgress, loadGuesserProgress, saveGuesserProgress,
    canPlayGuesserRun, discardGuesserRun, startGuesserRun, recordGuesserGuess, getGuesserStats } from '../src/lib/fruitGuesserHistory.js';

const fruits = Array.from({ length: 12 }, (_, index) => ({ id: String(index), name: `Fruit ${index}` }));
const start = (progress = emptyGuesserProgress(), id = 'run-1', now = 1000) => startGuesserRun(progress, fruits, { id, now, random: () => 0 });
const guess = (progress, fruitId, now = 2000) => recordGuesserGuess(progress, fruitId, fruits, { now });
const won = progress => guess(progress, progress.currentRun.target.id);
function lost(progress) {
    const wrong = fruits.filter(fruit => fruit.id !== progress.currentRun.target.id).slice(0, MAX_GUESSES);
    return wrong.reduce((current, fruit) => guess(current, fruit.id), progress);
}

test('leaving and reloading discards an unfinished game without adding history', () => {
    const initial = start();
    const progress = guess(initial, '1');
    const restored = parseGuesserProgress(JSON.stringify(discardGuesserRun(progress)));
    assert.equal(restored.currentRun, null);
    assert.deepEqual(restored.recentRuns, []);
    const fresh = start(restored, 'fresh-run', 4000);
    assert.equal(fresh.currentRun.maxGuesses, 7);
    assert.deepEqual(fresh.currentRun.guesses, []);
    assert.notEqual(fresh.currentRun.id, progress.currentRun.id);
    assert.equal(getGuesserStats(restored).played, 0);
    assert.deepEqual(initial.currentRun.guesses, []);
});

test('storage contains completed games only, with no active game state', () => {
    const values = new Map();
    const storage = { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) };
    const baseline = won(start());
    const playing = guess(start(baseline, 'run-2'), '2');
    assert.equal(saveGuesserProgress(playing, storage), true);
    const saved = JSON.parse(values.get(GUESSER_STORAGE_KEY));
    assert.equal(Object.hasOwn(saved, 'currentRun'), false);
    assert.deepEqual(saved.recentRuns, baseline.recentRuns);
    const loaded = loadGuesserProgress(storage);
    assert.equal(loaded.currentRun, null);
    assert.equal(loaded.recentRuns.length, 1);
    assert.equal(getGuesserStats(loaded).played, 1);
    const completed = won(playing);
    saveGuesserProgress(completed, storage);
    assert.equal(loadGuesserProgress(storage).recentRuns.length, 2);
    assert.ok(loadGuesserProgress(storage).recentRuns.every(run => run.outcome === 'won'));
});

test('legacy active and unfinished saves are removed while completed results and statistics survive', () => {
    const baseline = won(start());
    const active = guess(start(baseline, 'legacy'), '2').currentRun;
    const unfinished = { ...active, id: 'old-unfinished', outcome: 'unfinished', finishedAt: active.updatedAt };
    const legacy = { ...baseline, currentRun: active, recentRuns: [unfinished, active, ...baseline.recentRuns] };
    const restored = parseGuesserProgress(JSON.stringify(legacy));
    assert.equal(restored.currentRun, null);
    assert.deepEqual(restored.recentRuns, baseline.recentRuns);
    assert.deepEqual(getGuesserStats(restored), getGuesserStats(baseline));
    let saved;
    saveGuesserProgress(legacy, { setItem: (key, value) => { saved = JSON.parse(value); } });
    assert.deepEqual(saved.recentRuns, baseline.recentRuns);
    assert.equal(Object.hasOwn(saved, 'currentRun'), false);
    assert.equal(parseGuesserProgress(JSON.stringify(start())).recentRuns.length, 0);
});

test('wins and losses update lifetime statistics once and winning averages exclude losses', () => {
    let progress = won(guess(start(), '1'));
    assert.equal(progress.currentRun, null);
    assert.equal(progress.recentRuns[0].outcome, 'won');
    assert.equal(guess(progress, '2'), progress);
    progress = won(start(progress, 'run-2'));
    assert.deepEqual(getGuesserStats(progress), { played: 2, wins: 2, losses: 0, winRate: 100, averageGuesses: '1.5', streak: 2, bestStreak: 2 });
    progress = lost(start(progress, 'run-3'));
    assert.equal(progress.recentRuns[0].guesses.length, 7);
    assert.equal(progress.recentRuns[0].outcome, 'lost');
    assert.deepEqual(getGuesserStats(progress), { played: 3, wins: 2, losses: 1, winRate: 67, averageGuesses: '1.5', streak: 0, bestStreak: 2 });
    assert.deepEqual(parseGuesserProgress(JSON.stringify(progress)), progress);
});

test('a seventh-guess win is recorded as a win', () => {
    let progress = start();
    for (let index = 1; index < MAX_GUESSES; index++) progress = guess(progress, String(index));
    assert.equal(progress.currentRun.outcome, 'playing');
    progress = won(progress);
    assert.equal(progress.recentRuns[0].outcome, 'won');
    assert.equal(getGuesserStats(progress).averageGuesses, '7.0');
});

test('duplicate and invalid guesses are never added to history', () => {
    const progress = guess(start(), '1');
    assert.equal(guess(progress, '1'), progress);
    assert.equal(guess(progress, 'missing'), progress);
    assert.equal(progress.currentRun.guesses.length, 1);
});

test('starting afresh discards attempted games without changing statistics', () => {
    const progress = guess(start(), '1');
    const next = start(progress, 'run-2', 3000);
    assert.deepEqual(next.recentRuns, []);
    assert.deepEqual(next.currentRun.guesses, []);
    assert.notEqual(next.currentRun.target.id, progress.currentRun.target.id);
    assert.equal(getGuesserStats(next).played, 0);
    assert.deepEqual(parseGuesserProgress(JSON.stringify(next)), { ...next, currentRun: null });
    assert.equal(start(start(), 'run-2').recentRuns.length, 0);
});

test('only fifty recent runs are retained while lifetime totals survive trimming and reload', () => {
    let progress = emptyGuesserProgress();
    for (let index = 0; index < 60; index++) progress = won(start(progress, `run-${index}`));
    assert.equal(progress.recentRuns.length, RECENT_RUN_LIMIT);
    assert.equal(progress.recentRuns[0].id, 'run-59');
    assert.equal(progress.recentRuns.at(-1).id, 'run-10');
    assert.equal(getGuesserStats(progress).played, 60);
    assert.equal(getGuesserStats(progress).bestStreak, 60);
    assert.deepEqual(parseGuesserProgress(JSON.stringify(progress)), progress);
});

test('storage persists the complete run and remains safe when storage is blocked or full', () => {
    const values = new Map();
    const storage = { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) };
    const progress = won(start());
    assert.equal(saveGuesserProgress(progress, storage), true);
    assert.ok(values.has(GUESSER_STORAGE_KEY));
    assert.deepEqual(loadGuesserProgress(storage), progress);
    const blocked = { getItem() { throw Error('blocked'); }, setItem() { throw Error('quota'); } };
    assert.deepEqual(loadGuesserProgress(blocked), emptyGuesserProgress());
    assert.equal(saveGuesserProgress(progress, blocked), false);
});

test('malformed storage is ignored without breaking the game or accepting false wins', () => {
    for (const raw of [undefined, null, '{', '[]', '{"version":2}', 'null']) assert.deepEqual(parseGuesserProgress(raw), emptyGuesserProgress());
    const progress = won(start());
    const invalid = { ...progress.recentRuns[0], id: 'bad-win', guesses: [{ id: '2', name: 'Wrong fruit' }] };
    const restored = parseGuesserProgress(JSON.stringify({ ...progress, recentRuns: [invalid, ...progress.recentRuns, ...progress.recentRuns] }));
    assert.equal(restored.recentRuns.length, 1);
    const withoutTotals = parseGuesserProgress(JSON.stringify({ ...progress, totals: null }));
    assert.equal(getGuesserStats(withoutTotals).winRate, 100);
});

test('a live run cannot accept guesses against a changed catalog or attempt limit', () => {
    const run = guess(start(), '1').currentRun;
    assert.equal(canPlayGuesserRun(run, fruits.slice(1)), false);
    assert.equal(canPlayGuesserRun(run, fruits.filter(fruit => fruit.id !== '1')), false);
    assert.equal(canPlayGuesserRun({ ...run, maxGuesses: 5 }, fruits), false);
});
