import { doc, getDocFromServer, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db, ensureFirebaseUser } from './firebase.js';
import { POLL_YEAR } from './pollConfig.js';

export { ensureFirebaseUser as ensurePollUser };

function ballotRef(uid) {
    return doc(db, 'communityPolls', String(POLL_YEAR), 'ballots', uid);
}

export async function getOwnPollBallot(uid) {
    const snapshot = await getDocFromServer(ballotRef(uid));
    return snapshot.data() ?? null;
}

export async function createPollBallot(uid, fruitIds) {
    if (!Array.isArray(fruitIds)
        || fruitIds.length !== 3
        || new Set(fruitIds).size !== 3
        || fruitIds.some(id => typeof id !== 'string' || !id)) {
        throw new Error('Choose three different fruits before submitting.');
    }

    const [first, second, third] = fruitIds;
    const ref = ballotRef(uid);

    // Two tabs or a retry after a lost response must keep the first saved ballot.
    await runTransaction(db, async transaction => {
        if ((await transaction.get(ref)).exists()) return;
        transaction.set(ref, { first, second, third, createdAt: serverTimestamp() });
    });
}
