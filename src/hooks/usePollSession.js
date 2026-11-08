import { useEffect, useState } from 'react';
import { ensurePollUser, getOwnPollBallot } from '../lib/pollBallots.js';
import { readLocalVotedFlag, setLocalVotedFlag } from '../lib/pollConfig.js';

export default function usePollSession() {
    const [attempt, setAttempt] = useState(0);
    const [session, setSession] = useState(() => ({
        status: 'loading',
        user: null,
        ballot: null,
        localVoted: readLocalVotedFlag(),
        error: null,
    }));

    useEffect(() => {
        let active = true;
        setSession(previous => ({
            ...previous,
            status: 'loading',
            error: null,
        }));

        async function loadSession() {
            const user = await ensurePollUser();
            const ballot = await getOwnPollBallot(user.uid);
            if (!active) return;

            setLocalVotedFlag(Boolean(ballot));
            setSession({
                status: 'ready',
                user,
                ballot,
                localVoted: Boolean(ballot),
                error: null,
            });
        }

        loadSession().catch(error => {
            if (!active) return;
            setSession(previous => ({
                ...previous,
                status: 'error',
                error,
            }));
        });

        return () => {
            active = false;
        };
    }, [attempt]);

    return {
        ...session,
        retry: () => setAttempt(value => value + 1),
    };
}
