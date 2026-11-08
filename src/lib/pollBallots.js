import {
    POLL_LOCAL_BALLOT_KEY,
    POLL_LOCAL_STORAGE_KEY,
    POLL_LOCAL_VOTER_ID_KEY,
} from './pollConfig.js';

function getLocalStorage() {
    if (typeof window === 'undefined' || !window.localStorage) {
        throw new Error('Browser local storage is unavailable.');
    }
    return window.localStorage;
}

function getLocalVoterId() {
    const storage = getLocalStorage();
    let uid = storage.getItem(POLL_LOCAL_VOTER_ID_KEY);
    if (!uid) {
        uid = globalThis.crypto?.randomUUID?.()
            || `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        storage.setItem(POLL_LOCAL_VOTER_ID_KEY, uid);
    }
    return uid;
}

export async function ensurePollUser() {
    return { uid: getLocalVoterId() };
}

export async function getOwnPollBallot(uid) {
    const storage = getLocalStorage();
    if (storage.getItem(POLL_LOCAL_VOTER_ID_KEY) !== uid) return null;
    const rawBallot = storage.getItem(POLL_LOCAL_BALLOT_KEY);
    if (!rawBallot) return null;
    const ballot = JSON.parse(rawBallot);
    if (!ballot || typeof ballot !== 'object') {
        throw new Error('The saved local poll ballot is invalid.');
    }
    return ballot;
}

export async function createPollBallot(uid, fruitIds) {
    if (!Array.isArray(fruitIds) || fruitIds.length !== 3) {
        throw new Error('A poll ballot must contain exactly three fruit IDs.');
    }
    if (new Set(fruitIds).size !== 3 || fruitIds.some(id => typeof id !== 'string')) {
        throw new Error('Choose three different fruits before submitting.');
    }

    const ballot = {
        first: fruitIds[0],
        second: fruitIds[1],
        third: fruitIds[2],
        createdAt: new Date().toISOString(),
    };

    const storage = getLocalStorage();
    if (storage.getItem(POLL_LOCAL_VOTER_ID_KEY) !== uid) {
        throw new Error('The local poll session changed. Reload the page and try again.');
    }
    if (storage.getItem(POLL_LOCAL_BALLOT_KEY)) {
        const error = new Error('A local ballot has already been submitted.');
        error.code = 'already-exists';
        throw error;
    }
    storage.setItem(POLL_LOCAL_BALLOT_KEY, JSON.stringify(ballot));
    storage.setItem(POLL_LOCAL_STORAGE_KEY, 'true');
}

export function resetLocalPollBallot() {
    const storage = getLocalStorage();
    storage.removeItem(POLL_LOCAL_BALLOT_KEY);
    storage.removeItem(POLL_LOCAL_STORAGE_KEY);
}
