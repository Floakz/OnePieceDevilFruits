import { useEffect, useRef } from 'react';
import { getGuesserStats, RECENT_RUN_LIMIT } from '../../lib/fruitGuesserHistory.js';
import styles from './FruitGuesser.module.css';

const outcomeLabels = { won: 'Won', lost: 'Lost' };
const formatDate = value => new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(value);

export default function FruitGuesserRecords({ progress, onBack, onNewGame }) {
    const heading = useRef(null);
    const stats = getGuesserStats(progress);
    useEffect(() => { heading.current?.focus({ preventScroll: true }); }, []);
    return <section className={styles.recordsPanel} aria-labelledby="records-title">
        <div className={styles.recordsHeader}>
            <div><p className={styles.eyebrow}>Fruit Guesser</p><h1 id="records-title" ref={heading} tabIndex={-1}>Your <span>games</span></h1></div>
            <button type="button" className={styles.secondaryButton} onClick={onBack}>← Back</button>
        </div>
        <dl className={styles.statsGrid} aria-label="Lifetime game statistics">
            <div><dt>Games played</dt><dd>{stats.played}</dd></div>
            <div><dt>Win rate</dt><dd>{stats.winRate}<small>%</small></dd></div>
            <div><dt>Avg. guesses to win</dt><dd>{stats.averageGuesses || '—'}</dd></div>
            <div><dt>Best win streak</dt><dd>{stats.bestStreak}</dd></div>
        </dl>
        <p className={styles.statsSummary}>{stats.wins} {stats.wins === 1 ? 'win' : 'wins'} <span>·</span> {stats.losses} {stats.losses === 1 ? 'loss' : 'losses'} <span>·</span> Current win streak: {stats.streak}</p>
        <div className={styles.recentHeading}><h2>Recent games</h2><span>{progress.recentRuns.length} saved</span></div>
        {progress.recentRuns.length ? <div className={styles.runList}>
            {progress.recentRuns.map(run => <details className={styles.runCard} key={run.id}>
                <summary>
                    <span className={`${styles.runOutcome} ${styles[run.outcome]}`}>{outcomeLabels[run.outcome]}</span>
                    <span className={styles.runIdentity}><strong>{run.target.name}</strong><time dateTime={new Date(run.finishedAt).toISOString()}>{formatDate(run.finishedAt)}</time></span>
                    <span className={styles.runCount}>{run.guesses.length}/{run.maxGuesses}<small>guesses</small></span>
                    <span className={styles.expandRun} aria-hidden="true">⌄</span>
                </summary>
                <div className={styles.runDetails}>
                    <h3>Your guesses, in order</h3>
                    <ol>{run.guesses.map(fruit => <li key={fruit.id}><span>{fruit.name}</span>{fruit.id === run.target.id && <b className={styles.winningGuess}>Correct ✓</b>}</li>)}</ol>
                </div>
            </details>)}
        </div> : <p className={styles.noSavedGames}>Finish your first game to see it here.</p>}
        <p className={styles.recordsNote}>Saved in this browser. Statistics count completed games only. The latest {RECENT_RUN_LIMIT} games are kept here; lifetime totals are retained.</p>
        <div className={styles.recordsFooter}>
            <button type="button" className={styles.primaryButton} onClick={onNewGame}>Start a new game <span aria-hidden="true">→</span></button>
        </div>
    </section>;
}
