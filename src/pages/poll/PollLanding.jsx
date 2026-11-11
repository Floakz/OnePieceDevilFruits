import { Link } from 'react-router-dom';
import Seo from '../../Components/Seo.jsx';
import usePollSession from '../../hooks/usePollSession.js';
import {
    POLL_CLOSE_AT,
    POLL_OPEN_AT,
    POLL_YEAR,
    getPollState,
} from '../../lib/pollConfig.js';
import PollLayout from './PollLayout.jsx';
import styles from './Poll.module.css';

const dateOptions = { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' };
const openDate = new Intl.DateTimeFormat('en-US', dateOptions).format(new Date(POLL_OPEN_AT));
const closeDate = new Intl.DateTimeFormat('en-US', dateOptions).format(new Date(Date.parse(POLL_CLOSE_AT) - 1));

export default function PollLanding() {
    const pollState = getPollState();
    const session = usePollSession();

    return (
        <>
            <Seo
                title={`Community's Favorite Devil Fruits ${POLL_YEAR} | One Piece Devil Fruits`}
                description={`Rank your top three Devil Fruits in the ${POLL_YEAR} community poll. Your vote is final; results are hidden until the end-of-year reveal.`}
                canonical="https://onepiecedevilfruits.com/poll"
            />
            <PollLayout>
                <section className={styles.hero}>
                    <div>
                        <p className={styles.eyebrow}>The {POLL_YEAR} community poll</p>
                        <h1>Community's <span>Favorite</span> Devil Fruits</h1>
                        <p className={styles.heroCopy}>
                            Choose the three Devil Fruits you love most. Rank them carefully:
                            your first choice earns the most points, and every vote is final.
                        </p>
                        {pollState === 'open' && (
                            <div className={styles.heroActions}>
                                {session.status === 'error' ? (
                                    <button type="button" className={styles.primaryButton} onClick={session.retry}>
                                        Retry vote check
                                    </button>
                                ) : session.ballot ? (
                                    <Link className={styles.primaryButton} to="/poll/thanks">View my vote</Link>
                                ) : session.status === 'loading' ? (
                                    <button type="button" className={styles.primaryButton} disabled>
                                        Checking vote status...
                                    </button>
                                ) : (
                                    <Link className={styles.primaryButton} to="/poll/vote">Vote now</Link>
                                )}
                            </div>
                        )}
                        {pollState === 'upcoming' && (
                            <p className={styles.stateMessage}>Voting opens {openDate} (UTC).</p>
                        )}
                        {pollState === 'closed' && (
                            <p className={styles.stateMessage}>
                                Voting closed {closeDate}. Results are still hidden and will be revealed separately.
                            </p>
                        )}
                        {session.status === 'error' && (
                            <p className={`${styles.stateMessage} ${styles.errorMessage}`} role="alert">
                                We could not check your vote. Check your connection and try again.
                            </p>
                        )}
                    </div>
                    <div className={styles.heroArt} aria-hidden="true">
                        <div className={styles.heroRank}>01<span>3 PTS</span></div>
                        <div className={styles.heroRank}>02<span>2 PTS</span></div>
                        <div className={styles.heroRank}>03<span>1 PT</span></div>
                    </div>
                </section>

                <p className={styles.previewNotice} role="status">
                    Your vote is saved anonymously. Use the same browser to view your ballot after submitting.
                </p>

                <section className={styles.infoGrid} aria-label="Poll details">
                    <article className={styles.infoCard}>
                        <h2>Pick your top 3</h2>
                        <p>Choose three different fruits and place them in your personal first, second, and third spots.</p>
                    </article>
                    <article className={styles.infoCard}>
                        <h2>How scoring works</h2>
                        <p>First place earns 3 points, second earns 2, and third earns 1. The highest point total wins.</p>
                    </article>
                    <article className={styles.infoCard}>
                        <h2>Final and hidden</h2>
                        <p>
                            Voting runs {openDate} through {closeDate} (UTC). Votes cannot be changed or deleted.
                            Results remain hidden until the end-of-year reveal.
                        </p>
                    </article>
                </section>
            </PollLayout>
        </>
    );
}
