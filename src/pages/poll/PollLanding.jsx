import { Link } from 'react-router-dom';
import Seo from '../../Components/Seo.jsx';
import FruitImage from '../../Components/FruitImage.jsx';
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
const rankArt = [
    {
        fruit: 'https://cd-opf.pages.dev/fruits/677f28c4-858d-47c0-ba56-f835f785f2ab.webp',
        user: {
            id: '677f28c4-858d-47c0-ba56-f835f785f2ab',
            img: { user: 'https://i.postimg.cc/FHv6RTWt/Charlotte-Cracker-Anime-Infobox.webp' },
        },
        points: '3 PTS',
    },
    {
        fruit: 'https://cd-opf.pages.dev/fruits/5d3bff23-ad5b-49d0-bebf-7a7fd34ae17a.webp',
        user: {
            id: '5d3bff23-ad5b-49d0-bebf-7a7fd34ae17a',
            img: { user: 'https://i.postimg.cc/qv1P1vs3/Emporio-Ivankov.jpg' },
        },
        points: '2 PTS',
    },
    {
        fruit: 'https://cd-opf.pages.dev/fruits/b19d720c-6991-4445-872b-3580a019c394.webp',
        user: {
            id: 'b19d720c-6991-4445-872b-3580a019c394',
            img: { user: 'https://i.ibb.co/SwLmCk32/548202.webp' },
        },
        points: '1 PT',
    },
];

export default function PollLanding() {
    const pollState = getPollState();
    const session = usePollSession();
    const hasVoted = session.ballot || session.localVoted;

    return (
        <>
            <Seo
                title={`Community's Favorite Devil Fruits ${POLL_YEAR} | One Piece Devil Fruits`}
                description={`Rank your top three Devil Fruits in the ${POLL_YEAR} community poll. Your vote is final; results are hidden until the end-of-year reveal.`}
                canonical="https://onepiecedevilfruits.com/poll"
            />
            <PollLayout>
                <section className={styles.hero}>
                    <div className={styles.heroContent}>
                        <p className={styles.eyebrow}>The <span style={{ color: '#f8de3c' }}>{POLL_YEAR}</span> community poll</p>
                        <h1>Community's <span>Favorite</span><br />Devil Fruits</h1>
                        {pollState === 'open' && (
                            <div className={styles.heroActions}>
                                {session.status === 'error' ? (
                                    <button type="button" className={styles.primaryButton} onClick={session.retry}>
                                        Retry vote check
                                    </button>
                                ) : hasVoted ? (
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
                                We could not load your local poll state. {session.error?.message || 'Check whether browser storage is enabled, then retry.'}
                            </p>
                        )}
                    </div>
                    <div className={styles.heroArt} aria-hidden="true">
                        {rankArt.map(({ fruit, user, points }, index) => (
                            <div className={styles.heroRank} key={fruit}>
                                <FruitImage
                                    fruit={user}
                                    kind="character"
                                    className={styles.heroRankBackground}
                                    alt=""
                                    aria-hidden="true"
                                />
                                <img className={styles.heroRankFruit} src={fruit} alt="" />
                                <div className={styles.heroRankContent}>
                                    <strong>{`0${index + 1}`}</strong>
                                    <span>{points}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

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
