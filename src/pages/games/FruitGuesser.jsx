import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../Components/header/Header.jsx';
import Seo from '../../Components/Seo.jsx';
import CatalogState from '../../Components/CatalogState.jsx';
import useFruits from '../../hooks/useFruits.js';
import fruitDetails from '../../lib/fruits/fruitsExpandedInfo.js';
import { slugify } from '../../lib/slugify.js';
import { GUESSER_PAGE, MAX_GUESSES, GUESSER_CLUES, CLUE_STATUS, CLUE_SYMBOL, getGuesserCatalog, searchGuesserFruits, normalizeGuesserQuery, compareGuesserFruits, clueDescription } from '../../lib/fruitGuesser.js';
import { loadGuesserProgress, saveGuesserProgress, discardGuesserRun, startGuesserRun, recordGuesserGuess, getGuesserStats } from '../../lib/fruitGuesserHistory.js';
import FruitGuesserRecords from './FruitGuesserRecords.jsx';
import styles from './FruitGuesser.module.css';

function MysteryFruit({ fruit, revealed, preview = false }) {
    const [imageStatus, setImageStatus] = useState('loading');
    return <div className={`${styles.mysteryPanel} ${revealed ? styles.revealedPanel : ''}`}>
        <span className={styles.mysteryLabel}>{preview ? 'Your first clue' : revealed ? 'Mystery solved' : 'The mystery fruit'}</span>
        <div className={styles.fruitStage}>
            <img className={`${styles.mysteryFruit} ${!revealed ? styles.silhouette : ''}`}
                src={`/images/fruits/${fruit.id}.webp`}
                alt={preview ? 'Example Devil Fruit silhouette' : revealed ? fruit.name : 'Black silhouette of the mystery Devil Fruit'}
                width="220" height="220"
                style={{ visibility: imageStatus === 'ready' ? 'visible' : 'hidden' }}
                onLoad={() => setImageStatus('ready')} onError={() => setImageStatus('error')} />
            {imageStatus !== 'ready' && <span className={styles.imageMessage} role="status">{imageStatus === 'error' ? 'Artwork unavailable. You can still use the comparison clues.' : 'Loading silhouette…'}</span>}
            <span className={styles.mysteryBadge} aria-hidden="true">{revealed ? '✓' : '?'}</span>
        </div>
        {revealed && <p className={styles.mysteryCaption}>{fruit.name}</p>}
    </div>;
}

function GuesserIntro({ fruit, onStart, onHistory, progress }) {
    const heading = useRef(null);
    const stats = getGuesserStats(progress);
    useEffect(() => { heading.current?.focus({ preventScroll: true }); }, []);
    return <section className={styles.hero} aria-labelledby="guesser-intro-title">
        <div className={styles.heroCopy}>
            <h1 id="guesser-intro-title" ref={heading} tabIndex={-1}>Fruit <span>Guesser</span></h1>
            <p className={styles.intro}>Guess the Devil Fruit from its silhouette in {MAX_GUESSES} attempts.</p>
            <p className={styles.introHelp}>Search by fruit name or user. Match the traits and follow the higher or lower clues.</p>
            <div className={styles.introActions}>
                <button type="button" className={styles.primaryButton} onClick={onStart}>Start guessing</button>
                {progress.recentRuns.length > 0 && <button type="button" className={styles.secondaryButton} onClick={onHistory}>See previous games</button>}
            </div>
            {stats.played > 0 && <p className={styles.introStats}>{stats.played} {stats.played === 1 ? 'game' : 'games'} completed <span>·</span> {stats.winRate}% win rate</p>}
        </div>
        <div className={styles.introPreview} aria-hidden="true">
            <MysteryFruit fruit={fruit} preview />
        </div>
    </section>;
}

function ClueCell({ clue, field, revealed = true, animate = false }) {
    const description = clueDescription(clue, field.label);
    return <td className={`${styles.clueCell} ${revealed ? styles[clue.status] : styles.pendingClue} ${revealed && animate ? styles.revealClue : ''}`}
        data-revealed={revealed} aria-label={revealed ? description : `${field.label}: waiting to reveal`} title={revealed ? description : 'Revealing clues…'}>
        <span className={styles.mobileClueLabel} aria-hidden="true">{field.label}{field.unit && ` ${field.unit}`}</span>
        {revealed ? <>
            <span className={styles.clueMark} aria-hidden="true">{CLUE_SYMBOL[clue.status]}</span>
            <span className={styles.clueValue}>{clue.value}</span>
            {clue.direction && <span className={styles.clueDirection} aria-hidden="true">
                {['higher', 'later'].includes(clue.direction) ? '↑' : '↓'}
                <small>{clue.direction}</small>
            </span>}
        </> : <span className={styles.waitingMark} aria-hidden="true">?</span>}
    </td>;
}

function GuesserGame({ fruits, run, onGuess, onPlayAgain, onMenu }) {
    const round = { targetId: run.target.id, guesses: run.guesses.map(fruit => fruit.id), phase: run.outcome };
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [message, setMessage] = useState('');
    const [reveal, setReveal] = useState(null);
    const [selectedGuessId, setSelectedGuessId] = useState(run.guesses.at(-1)?.id || null);
    const inputRef = useRef(null);
    const resultsRef = useRef(null);
    const resultHeading = useRef(null);
    const revealLocked = useRef(false);
    const promptHeading = useRef(null);
    const listId = useId();
    const helpId = useId();
    const byId = useMemo(() => new Map(fruits.map(fruit => [fruit.id, fruit])), [fruits]);
    const target = byId.get(round.targetId);
    const revealingId = reveal?.fruitId;
    const isRevealing = Boolean(revealingId);
    const complete = round.phase !== 'playing' && !isRevealing;
    const remaining = MAX_GUESSES - round.guesses.length;
    const guessesLeft = remaining + Number(isRevealing);
    const results = searchGuesserFruits(fruits, query, round.guesses);
    const expanded = open && Boolean(query.trim()) && !complete && !isRevealing;
    const selectedResult = results[activeIndex];
    const comparisons = round.guesses.map(id => {
        const fruit = byId.get(id);
        return { fruit, clues: compareGuesserFruits(fruit, target) };
    }).reverse();

    useEffect(() => { promptHeading.current?.focus({ preventScroll: true }); }, []);

    useEffect(() => {
        if (!revealingId) return;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const latestRow = resultsRef.current?.querySelector('tbody tr');
        function finishReveal() {
            revealLocked.current = false;
            setReveal(null);
            setMessage(round.phase === 'won' ? 'Correct!'
                : round.phase === 'lost' ? 'No guesses left.' : 'Try another fruit.');
        }
        if (reduceMotion) {
            finishReveal();
            return;
        }
        const timers = GUESSER_CLUES.map((_, index) => setTimeout(() => {
            setReveal({ fruitId: revealingId, count: index + 1 });
            const track = resultsRef.current;
            const cell = latestRow?.querySelectorAll('td')[index];
            if (track && cell && track.scrollWidth > track.clientWidth) {
                const overflow = cell.getBoundingClientRect().right - track.getBoundingClientRect().right;
                if (overflow > 0) track.scrollBy({ left: overflow + 8, behavior: 'smooth' });
            }
        }, 180 + index * 230));
        // Leave the final tile time to turn over before announcing the outcome.
        timers.push(setTimeout(finishReveal, 180 + (GUESSER_CLUES.length - 1) * 230 + 420));
        return () => timers.forEach(clearTimeout);
    }, [revealingId, round.phase]);

    useEffect(() => {
        if (expanded && activeIndex >= 0) document.getElementById(`${listId}-${activeIndex}`)?.scrollIntoView({ block: 'nearest' });
    }, [activeIndex, expanded, listId]);

    useEffect(() => {
        if (complete) resultHeading.current?.focus({ preventScroll: true });
    }, [complete, round.targetId]);

    function submitFruit(fruit) {
        if (complete || revealLocked.current || !fruit || round.guesses.includes(fruit.id)) return;
        revealLocked.current = true;
        setReveal({ fruitId: fruit.id, count: 0 });
        setSelectedGuessId(fruit.id);
        onGuess(fruit.id);
        setQuery('');
        setOpen(false);
        setActiveIndex(-1);
        setMessage('Revealing your clues…');
        // Keep the fruit identity visible if the desktop table was scrolled sideways.
        if (resultsRef.current) resultsRef.current.scrollLeft = 0;
    }

    function submit(event) {
        event.preventDefault();
        if (revealLocked.current || complete) return;
        const exact = results.find(fruit => [fruit.name, fruit.romanizedName, fruit.japaneseName].some(name => name && normalizeGuesserQuery(name) === normalizeGuesserQuery(query)));
        const chosen = selectedResult || exact || (results.length === 1 ? results[0] : null);
        if (chosen) submitFruit(chosen);
        else {
            setMessage(results.length ? 'Choose a fruit from the suggestions to make your guess.' : 'No unguessed fruits match. Try another fruit name or user.');
            setOpen(true);
            inputRef.current?.focus();
        }
    }

    function onKeyDown(event) {
        if (event.key === 'Escape') { setOpen(false); setActiveIndex(-1); return; }
        if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
            event.preventDefault();
            setOpen(true);
            if (!results.length) return;
            setActiveIndex(previous => event.key === 'ArrowDown' ? (previous + 1) % results.length : previous <= 0 ? results.length - 1 : previous - 1);
        }
    }

    function playAgain() {
        onPlayAgain();
        window.scrollTo({ top: 0, behavior: 'instant' });
    }

    return <>
        <section className={styles.playArea} aria-label="Mystery fruit and guess controls">
            <MysteryFruit key={target.id} fruit={target} revealed={complete} />
            <div className={styles.guessPanel}>
        {!complete && <section className={styles.searchSection} aria-label="Make a guess">
            <div className={styles.searchHeading}><h1 ref={promptHeading} tabIndex={-1}>{isRevealing ? 'Revealing clues…' : 'What’s your guess?'}</h1><span>{isRevealing ? `Clue ${reveal.count}/${GUESSER_CLUES.length}` : `Guess ${round.guesses.length + 1}/${MAX_GUESSES}`}</span></div>
            <form className={styles.guessForm} onSubmit={submit} onBlur={event => {
                if (!event.currentTarget.contains(event.relatedTarget)) { setOpen(false); setActiveIndex(-1); }
            }}>
                <div className={styles.inputWrapper}>
                    <svg aria-hidden="true" viewBox="0 0 24 24" className={styles.searchIcon}><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg>
                    <input ref={inputRef} role="combobox" type="search" autoComplete="off" spellCheck="false" disabled={isRevealing}
                        aria-label="Search for a fruit to guess" aria-autocomplete="list" aria-expanded={expanded}
                        aria-controls={expanded ? listId : undefined} aria-describedby={helpId}
                        aria-activedescendant={expanded && selectedResult ? `${listId}-${activeIndex}` : undefined}
                        value={query} placeholder="Fruit name…"
                        onChange={event => { setQuery(event.target.value); setOpen(true); setActiveIndex(-1); setMessage(''); }}
                        onFocus={() => setOpen(true)} onKeyDown={onKeyDown} />
                </div>
                <button className={styles.primaryButton} type="submit" disabled={isRevealing || !query.trim()}>Guess <span aria-hidden="true">→</span></button>
                {expanded && <div className={styles.suggestions}>
                    <div id={listId} role="listbox" aria-label="Fruits to guess">
                        {results.map((fruit, index) => <div key={fruit.id} id={`${listId}-${index}`} role="option"
                            aria-selected={index === activeIndex} className={`${styles.suggestion} ${index === activeIndex ? styles.activeSuggestion : ''}`}
                            onMouseDown={event => event.preventDefault()} onClick={() => submitFruit(fruit)}>
                            <span><strong>{fruit.name}</strong><small>{fruit.romanizedName || fruit.japaneseName}{fruit.user && ` · ${fruit.user}`}</small></span>
                            <span className={styles.suggestionArrow} aria-hidden="true">↵</span>
                        </div>)}
                    </div>
                    {!results.length && <p className={styles.noResults}>No unguessed fruits found. Try another name.</p>}
                </div>}
            </form>
            <p id={helpId} className={styles.searchHelp}>Search by English name, original name, or user.</p>
        </section>}

        {complete && <section className={`${styles.result} ${round.phase === 'won' ? styles.resultWon : ''}`} aria-labelledby="guesser-result-title">
            <div>
                <h1 id="guesser-result-title" ref={resultHeading} tabIndex={-1}>{round.phase === 'won' ? `Correct! ${round.guesses.length}/${MAX_GUESSES} guesses` : 'Out of guesses'}</h1>
                <Link className={styles.answerLink} to={`/fruit/${slugify(target.name)}`}>{target.name} <span aria-hidden="true">↗</span></Link>
                {target.romanizedName && <p className={styles.originalName}>{target.romanizedName}</p>}
            </div>
            <button className={`${styles.primaryButton} ${styles.desktopReplay}`} type="button" onClick={playAgain}>Play again <span aria-hidden="true">↻</span></button>
        </section>}
        <p className={styles.announcement} role="status" aria-atomic="true">{message}</p>
            </div>
            <div className={styles.guessCounter}>
                <span>Guesses left</span>
                <strong>{guessesLeft}<small>/{MAX_GUESSES}</small></strong>
                <div className={styles.attemptMeter} aria-hidden="true">
                    {Array.from({ length: MAX_GUESSES }, (_, index) => <i key={index} className={index < guessesLeft ? styles.attemptAvailable : undefined} />)}
                </div>
            </div>
        </section>

        <section className={styles.history} aria-labelledby="guesser-history-title">
            <div className={styles.historyHeader}><h2 id="guesser-history-title">Your guesses <span>{round.guesses.length}/{MAX_GUESSES}</span></h2>
            <div className={styles.historyActions}>
            <button type="button" className={styles.menuButton} disabled={isRevealing} onClick={onMenu}>Menu</button>
            <details className={styles.clueGuide}>
                <summary>Clue guide</summary>
                <div className={styles.guidePanel}>
                <ul className={styles.legend} aria-label="Clue color guide">
                {Object.entries(CLUE_STATUS).map(([key, label]) => <li key={key}><span className={styles[key]} aria-hidden="true">{CLUE_SYMBOL[key]}</span>{label}</li>)}
                <li><b aria-hidden="true">↑ ↓</b> Aim higher / lower</li>
            </ul>
                <p>Amber means a shared fruit family, overlapping abilities, or a score within 10 points. Arrows point toward the mystery fruit: higher/lower stats or earlier/later debuts.</p>
                <p>Scores use this site’s editorial ratings. “Not confirmed” refers to awakening; ? means data is unavailable or uncategorized.</p>
                </div>
            </details></div></div>
            {comparisons.length ? <>
                <div className={styles.guessTabs} role="group" aria-label="Review previous guesses">
                    {round.guesses.map((id, index) => <button type="button" key={id} aria-pressed={selectedGuessId === id} disabled={isRevealing}
                        aria-label={`Review guess ${index + 1}: ${byId.get(id).name}`}
                        onClick={() => setSelectedGuessId(id)} title={byId.get(id).name}>#{index + 1}<span>{byId.get(id).name}</span></button>)}
                </div>
                <div className={styles.tableScroller} ref={resultsRef} role="region" aria-label="Fruit guess comparisons" aria-busy={isRevealing} tabIndex={0}>
                    <table className={styles.comparisonTable} role="table">
                        <caption className="visually-hidden">Your guesses, newest first. Colors and symbols compare each guess with the mystery fruit. Arrows point toward the mystery fruit’s values.</caption>
                        <thead><tr>
                            <th scope="col">Guessed fruit</th>
                            {GUESSER_CLUES.map(field => <th key={field.key} scope="col">{field.label}{field.unit && <small>{field.unit}</small>}</th>)}
                        </tr></thead>
                        <tbody>{comparisons.map(({ fruit, clues }, index) => <tr key={fruit.id} className={fruit.id === selectedGuessId ? styles.selectedRow : undefined}>
                            <th scope="row" className={styles.guessedFruit}>
                                <span className={styles.guessNumber}>#{round.guesses.length - index}</span>
                                <span>{fruit.name}</span>
                            </th>
                            {GUESSER_CLUES.map((field, clueIndex) => <ClueCell key={field.key} field={field} clue={clues[field.key]}
                                revealed={fruit.id !== revealingId || clueIndex < reveal.count} animate={fruit.id === revealingId} />)}
                        </tr>)}</tbody>
                    </table>
                </div>
            </> : <div className={styles.emptyHistory}>
                <div className={styles.sampleClues} aria-hidden="true">
                    <span className={styles.correct}><b>✓</b><small>Match</small></span>
                    <span className={styles.partial}><b>≈</b><small>Partial</small></span>
                    <span className={styles.incorrect}><b>↑ ↓</b><small>Follow the arrows</small></span>
                </div>
                <div className={styles.emptyCopy}><h3>Make your first guess.</h3><p>Compare the traits. Follow the clues. Find the fruit.</p></div>
            </div>}
        </section>
        {complete && <button className={`${styles.primaryButton} ${styles.mobileReplay}`} type="button" onClick={playAgain}>Play again <span aria-hidden="true">↻</span></button>}
    </>;
}

export default function FruitGuesser() {
    const { fruits, status, retry } = useFruits();
    const catalog = useMemo(() => getGuesserCatalog(fruits, fruitDetails), [fruits]);
    const [progress, setProgress] = useState(loadGuesserProgress);
    const [storageAvailable, setStorageAvailable] = useState(true);
    const [view, setView] = useState('intro');
    const [runId, setRunId] = useState(null);
    const previewFruit = catalog.find(fruit => fruit.name === 'Flame-Flame Fruit') || catalog[0];
    const activeRun = progress.currentRun?.id === runId ? progress.currentRun : progress.recentRuns.find(run => run.id === runId);
    const started = view === 'game' && activeRun;

    const { version, recentRuns, totals } = progress;
    useEffect(() => { setStorageAvailable(saveGuesserProgress({ version, recentRuns, totals })); }, [version, recentRuns, totals]);

    function startGame() {
        const next = startGuesserRun(progress, catalog);
        setProgress(next);
        setRunId(next.currentRun.id);
        setView('game');
        window.scrollTo({ top: 0, behavior: 'instant' });
    }

    function returnToMenu() {
        setProgress(previous => discardGuesserRun(previous));
        setRunId(null);
        setView('intro');
    }
    return <>
        <Seo title={GUESSER_PAGE.title} description={GUESSER_PAGE.description} canonical={GUESSER_PAGE.url} />
        <Header headerShown={false} compact />
        <main className={`${styles.page} ${started ? styles.playingPage : view === 'records' ? styles.recordsPage : styles.introPage}`}>
            {!storageAvailable && <p className={styles.storageWarning} role="status">History can’t be saved in this browser. You can still play, but your game records may be lost when you leave.</p>}
            {status !== 'ready' ? <CatalogState status={status} retry={retry} /> : catalog.length ? started ? <GuesserGame key={activeRun.id} fruits={catalog} run={activeRun}
                onGuess={fruitId => setProgress(previous => recordGuesserGuess(previous, fruitId, catalog))}
                onPlayAgain={startGame} onMenu={returnToMenu} />
                : view === 'records' ? <FruitGuesserRecords progress={progress} onBack={() => setView('intro')} onNewGame={startGame} />
                    : <GuesserIntro fruit={previewFruit} progress={progress} onStart={startGame} onHistory={() => setView('records')} />
                : <div className="catalogState" role="alert"><p>No fruits are available for this game.</p><button onClick={retry}>Try again</button></div>}
        </main>
    </>;
}
