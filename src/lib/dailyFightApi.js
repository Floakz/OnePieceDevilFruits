import {
    doc, getDoc, increment, runTransaction, serverTimestamp, updateDoc,
} from 'firebase/firestore';

export const DAILY_FIGHT_START_DATE = '2026-11-06';

export function todayIdUTC() {
    return new Date().toISOString().slice(0, 10);
}

export function fightVotingState(fightId, hasVoted = false, today = todayIdUTC()) {
    const available = fightId >= DAILY_FIGHT_START_DATE && fightId <= today;
    return {
        canVote: available && !hasVoted,
        showResults: available && (fightId < today || hasVoted),
    };
}

export function voteCounts(left = 0, right = 0) {
    const total = left + right;
    const leftPct = total ? Math.round(left / total * 100) : 0;
    return {
        left, right,
        leftPct,
        rightPct: total ? 100 - leftPct : 0,
    };
}

export async function loadFight(db, fightId, createFight) {
    if (fightId < DAILY_FIGHT_START_DATE || fightId > todayIdUTC()) return null;
    const ref = doc(db, 'fights', fightId);
    const snapshot = await getDoc(ref);
    if (snapshot.exists()) return snapshot.data();
    if (!createFight || fightId !== todayIdUTC()) return null;

    // Only the first visitor creates a fight. A concurrent visitor must never
    // replace its characters or reset totals after voting has started.
    const payload = {
        ...createFight(), date: fightId, createdAt: serverTimestamp(),
        leftVotes: 0, rightVotes: 0,
    };
    return runTransaction(db, async transaction => {
        const existing = await transaction.get(ref);
        if (existing.exists()) return existing.data();
        transaction.set(ref, payload);
        return payload;
    });
}

export function voteStorageKey(fightId) {
    // The new tally is independent of votes cast under the old implementation.
    return `daily-fight-v2-voted-${fightId}`;
}

export function readStoredVote(fightId, storage = globalThis.localStorage) {
    const side = storage.getItem(voteStorageKey(fightId));
    return side === 'left' || side === 'right' ? side : null;
}

export async function submitFightVote(db, fightId, side, storage = globalThis.localStorage) {
    if (side !== 'left' && side !== 'right') throw new Error('Invalid vote side.');
    if (fightId < DAILY_FIGHT_START_DATE) throw new Error('This fight is no longer available.');
    if (!fightVotingState(fightId).canVote) {
        throw Object.assign(new Error('This fight is not available yet.'), { code: 'fight-unavailable' });
    }
    const savedSide = readStoredVote(fightId, storage);
    if (savedSide) return savedSide;

    // Reserve locally before the request so another click/tab sees the choice.
    // If storage is blocked, fail before sending any vote to Firebase.
    const key = voteStorageKey(fightId);
    storage.setItem(key, side);
    try {
        // increment also initializes a missing counter to one. An existing
        // matchup from rollout day can start fresh without a migration.
        await updateDoc(doc(db, 'fights', fightId), { [`${side}Votes`]: increment(1) });
    } catch (error) {
        try { storage.removeItem(key); } catch { /* Keep the original write error. */ }
        throw error;
    }
    return side;
}
