import { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Seo from '../../Components/Seo.jsx';
import useFruits from '../../hooks/useFruits.js';
import usePollSession from '../../hooks/usePollSession.js';
import { POLL_YEAR } from '../../lib/pollConfig.js';
import { resetLocalPollBallot } from '../../lib/pollBallots.js';
import PollLayout from './PollLayout.jsx';
import PollPodium from './PollPodium.jsx';
import styles from './Poll.module.css';

export default function PollThanks() {
    const navigate = useNavigate();
    const session = usePollSession();
    const { fruits, status: fruitStatus, retry } = useFruits({ staticOnly: true });
    const fruitById = useMemo(() => new Map(fruits.map(fruit => [String(fruit.id), fruit])), [fruits]);

    useEffect(() => {
        if (session.status === 'ready' && !session.ballot) {
            navigate('/poll', { replace: true });
        }
    }, [navigate, session.ballot, session.status]);

    const picks = session.ballot
        ? [session.ballot.first, session.ballot.second, session.ballot.third]
            .map(id => fruitById.get(String(id)) || {
                id: String(id),
                name: fruitStatus === 'error' ? 'Fruit details unavailable' : 'Loading fruit details...',
                type: '',
                user: String(id),
            })
        : [];

    return (
        <>
            <Seo
                title={`Thanks for Voting - Community Poll ${POLL_YEAR}`}
                description="Your Devil Fruit poll ballot has been saved in this browser."
                canonical="https://onepiecedevilfruits.com/poll/thanks"
                noindex
            />
            <PollLayout>
                <section className={`${styles.panel} ${styles.thankYou}`}>
                    {session.status === 'loading' ? (
                        <p className={styles.stateMessage} role="status">Checking for your ballot...</p>
                    ) : session.status === 'error' ? (
                        <>
                            <h1>We could not load your vote</h1>
                            <p role="alert">Your ballot could not be checked. Please retry.</p>
                            <button type="button" className={styles.secondaryButton} onClick={session.retry}>Retry</button>
                        </>
                    ) : session.ballot ? (
                        <>
                            <p className={styles.eyebrow}>{POLL_YEAR} community poll</p>
                            <h1>Thanks for voting!</h1>
                            <p>Your vote is final and saved in this browser. Results remain hidden until the end-of-year reveal.</p>
                            {fruitStatus === 'error' && (
                                <p className={styles.stateMessage} role="alert">
                                    Some fruit details could not be loaded. <button type="button" className={styles.textButton} onClick={retry}>Retry</button>
                                </p>
                            )}
                            <PollPodium slots={picks} />
                            <div className={styles.heroActions}>
                                <Link className={styles.primaryButton} to="/">Back to the main site</Link>
                            </div>
                            <button
                                type="button"
                                className={styles.textButton}
                                onClick={() => {
                                    resetLocalPollBallot();
                                    navigate('/poll', { replace: true });
                                }}
                            >
                                Reset local preview vote
                            </button>
                        </>
                    ) : (
                        <p className={styles.stateMessage} role="status">No ballot found. Returning to the poll...</p>
                    )}
                </section>
            </PollLayout>
        </>
    );
}
