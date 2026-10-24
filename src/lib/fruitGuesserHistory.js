import { MAX_GUESSES, createGuesserRound, guesserReducer } from './fruitGuesser.js';

export const GUESSER_STORAGE_KEY = 'onepiece:fruit-guesser:v1';
export const RECENT_RUN_LIMIT = 50;

export function emptyGuesserProgress() {
    return { version: 1, currentRun: null, recentRuns: [], totals: { played: 0, wins: 0, winningGuesses: 0, streak: 0, bestStreak: 0 } };
}

const fruitSnapshot = fruit => ({ id: String(fruit.id), name: fruit.name });
const validFruit = fruit => fruit && typeof fruit.id === 'string' && fruit.id.length > 0 && fruit.id.length <= 200
    && typeof fruit.name === 'string' && fruit.name.length > 0 && fruit.name.length <= 300;
const validTime = value => Number.isSafeInteger(value) && value > 0 && value < 8640000000000000;
const isCompletedRun = run => run?.outcome === 'won' || run?.outcome === 'lost';

function validateRun(run) {
    if (!run || typeof run.id !== 'string' || !run.id || run.id.length > 200 || !validFruit(run.target)
        || !Array.isArray(run.guesses) || !run.guesses.every(validFruit)
        || !Number.isInteger(run.maxGuesses) || run.maxGuesses < 1 || run.maxGuesses > 20
        || run.guesses.length > run.maxGuesses || new Set(run.guesses.map(fruit => fruit.id)).size !== run.guesses.length
        || !validTime(run.startedAt) || !validTime(run.updatedAt) || run.updatedAt < run.startedAt
        || !['playing', 'won', 'lost'].includes(run.outcome)) return null;
    const hit = run.guesses.findIndex(fruit => fruit.id === run.target.id);
    if (run.outcome === 'won' ? hit !== run.guesses.length - 1 || hit < 0
        : hit >= 0 || (run.outcome === 'lost' ? run.guesses.length !== run.maxGuesses : run.guesses.length >= run.maxGuesses)) return null;
    if (run.outcome !== 'playing' && (!validTime(run.finishedAt) || run.finishedAt < run.startedAt)) return null;
    return {
        id: run.id, target: fruitSnapshot(run.target), guesses: run.guesses.map(fruitSnapshot), maxGuesses: run.maxGuesses,
        startedAt: run.startedAt, updatedAt: run.updatedAt, finishedAt: run.outcome === 'playing' ? null : run.finishedAt, outcome: run.outcome,
    };
}

function completedTotals(totals, run) {
    if (!['won', 'lost'].includes(run.outcome)) return totals;
    const won = run.outcome === 'won';
    const streak = won ? totals.streak + 1 : 0;
    return {
        played: totals.played + 1, wins: totals.wins + Number(won),
        winningGuesses: totals.winningGuesses + (won ? run.guesses.length : 0),
        streak, bestStreak: Math.max(totals.bestStreak, streak),
    };
}

export function parseGuesserProgress(raw) {
    const empty = emptyGuesserProgress();
    try {
        const parsed = JSON.parse(raw);
        if (parsed?.version !== 1 || !Array.isArray(parsed.recentRuns)) return empty;
        const seen = new Set();
        const recentRuns = parsed.recentRuns.map(validateRun).filter(run => {
            if (!isCompletedRun(run) || seen.has(run.id)) return false;
            seen.add(run.id);
            return true;
        }).sort((a, b) => b.finishedAt - a.finishedAt).slice(0, RECENT_RUN_LIMIT);
        const totals = parsed.totals;
        const validTotals = totals && Object.keys(empty.totals).every(key => Number.isSafeInteger(totals[key]) && totals[key] >= 0)
            && totals.wins <= totals.played && totals.streak <= totals.wins && totals.bestStreak >= totals.streak
            && totals.bestStreak <= totals.wins && totals.winningGuesses >= totals.wins;
        return {
            version: 1, currentRun: null, recentRuns,
            totals: validTotals ? Object.fromEntries(Object.keys(empty.totals).map(key => [key, totals[key]]))
                : [...recentRuns].reverse().reduce(completedTotals, empty.totals),
        };
    } catch { return empty; }
}

export function loadGuesserProgress(storage) {
    try { return parseGuesserProgress((storage || globalThis.localStorage)?.getItem(GUESSER_STORAGE_KEY)); }
    catch { return emptyGuesserProgress(); }
}

export function saveGuesserProgress(progress, storage) {
    try {
        const destination = storage || globalThis.localStorage;
        if (!destination) return false;
        const { version, recentRuns, totals } = progress;
        destination.setItem(GUESSER_STORAGE_KEY, JSON.stringify({ version, recentRuns: recentRuns.filter(isCompletedRun), totals }));
        return true;
    } catch { return false; }
}

export function canPlayGuesserRun(run, fruits) {
    if (!run || run.outcome !== 'playing' || run.maxGuesses !== MAX_GUESSES) return false;
    const ids = new Set(fruits.map(fruit => fruit.id));
    return ids.has(run.target.id) && run.guesses.every(fruit => ids.has(fruit.id));
}

export function discardGuesserRun(progress) {
    return progress.currentRun ? { ...progress, currentRun: null } : progress;
}

function createGuesserRunId() {
    const cryptoApi = globalThis.crypto;
    if (cryptoApi && typeof cryptoApi.randomUUID === 'function') return cryptoApi.randomUUID();
    return `${Date.now()}-${Math.random()}`;
}

export function startGuesserRun(progress, fruits, { now = Date.now(), id = createGuesserRunId(), random } = {}) {
    const previous = progress.currentRun || progress.recentRuns[0];
    const round = createGuesserRound(fruits, { previousId: previous?.target.id, random });
    if (!round) return progress;
    return {
        ...progress,
        currentRun: { id, target: fruitSnapshot(fruits.find(fruit => fruit.id === round.targetId)), guesses: [], maxGuesses: MAX_GUESSES,
            startedAt: now, updatedAt: now, finishedAt: null, outcome: 'playing' },
    };
}

export function recordGuesserGuess(progress, fruitId, fruits, { now = Date.now() } = {}) {
    const run = progress.currentRun;
    if (!canPlayGuesserRun(run, fruits)) return progress;
    const round = { targetId: run.target.id, fruitIds: fruits.map(fruit => fruit.id), guesses: run.guesses.map(fruit => fruit.id), phase: 'playing' };
    const next = guesserReducer(round, { type: 'GUESS', fruitId });
    if (next === round) return progress;
    const updated = { ...run, guesses: [...run.guesses, fruitSnapshot(fruits.find(fruit => fruit.id === String(fruitId)))],
        updatedAt: now, outcome: next.phase, finishedAt: next.phase === 'playing' ? null : now };
    if (next.phase === 'playing') return { ...progress, currentRun: updated };
    return { ...progress, currentRun: null, recentRuns: [updated, ...progress.recentRuns].slice(0, RECENT_RUN_LIMIT), totals: completedTotals(progress.totals, updated) };
}

export function getGuesserStats(progress) {
    const { played, wins, winningGuesses, streak, bestStreak } = progress.totals;
    return { played, wins, losses: played - wins, winRate: played ? Math.round(wins / played * 100) : 0,
        averageGuesses: wins ? (winningGuesses / wins).toFixed(1) : null, streak, bestStreak };
}
