import { readFile } from 'node:fs/promises';
import { applicationDefault, deleteApp, initializeApp } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { calculatePollResults } from '../src/lib/pollResults.mjs';
import {
    getEligibleFruits, POLL_CLOSE_AT, POLL_OPEN_AT, POLL_TOP_N, POLL_YEAR,
} from '../src/lib/pollConfig.js';

const [command, projectId, year = String(POLL_YEAR)] = process.argv.slice(2);
if (!['setup', 'results'].includes(command) || !projectId || !/^\d{4}$/.test(year)
    || (command === 'setup' && year !== String(POLL_YEAR))) {
    console.error('Usage: node scripts/community-poll.mjs setup <firebase-project-id>');
    console.error('       node scripts/community-poll.mjs results <firebase-project-id> [year]');
    process.exit(1);
}

const app = initializeApp({ projectId, credential: applicationDefault() });
try {
    const pollRef = getFirestore(app).collection('communityPolls').doc(year);

    if (command === 'setup') {
        await pollRef.create({
            opensAt: Timestamp.fromDate(new Date(POLL_OPEN_AT)),
            closesAt: Timestamp.fromDate(new Date(POLL_CLOSE_AT)),
        });
        console.log(`Configured the ${year} poll voting dates in ${projectId}.`);
    } else {
        const poll = (await pollRef.get()).data();
        if (!poll) throw new Error(`The ${year} poll is not configured in ${projectId}.`);

        const catalog = JSON.parse(await readFile(new URL('../public/data/fruits_v16.json', import.meta.url), 'utf8'));
        const fruits = getEligibleFruits(catalog);
        const ballots = (await pollRef.collection('ballots').get()).docs.map(doc => doc.data());
        const { totalVoters, ignoredBallots, ranking } = calculatePollResults(ballots, fruits, { topN: POLL_TOP_N });
        console.log(JSON.stringify({ year: Number(year), totalVoters, ignoredBallots, ranking }, null, 2));
    }
} catch (error) {
    console.error(error.message);
    process.exitCode = 1;
} finally {
    await deleteApp(app);
}
