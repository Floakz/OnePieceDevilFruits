import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import Header from '../../Components/header/Header.jsx';
import Footer from '../../Components/footer/footer.jsx';
import Seo from '../../Components/Seo.jsx';
import FruitImage from '../../Components/FruitImage.jsx';
import CatalogState from '../../Components/CatalogState.jsx';
import SocialShare from '../../Components/socialShare/SocialShare.jsx';
import useFruits from '../../hooks/useFruits.js';
import { BLIND_RANKING_PAGE, createRankingRound, rankingReducer, restoreRankingRound, rankingShareText, RANKING_SCENARIOS, RANKS, ROUND_STORAGE_KEY } from '../../lib/blindRanking.js';
import styles from './BlindRanking.module.css';

function GameIcon({ name, ...props }) {
    const paths = {
        shuffle: <><path d="m17 3 4 4-4 4m0 2 4 4-4 4M3 7h3c5 0 7 10 12 10h3M3 17h3c2 0 3-2 4-4m4-4c1-2 2-2 4-2h3" /></>,
        lock: <><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2" /></>,
        check: <path d="m5 12 4 4L19 6" />,
        drag: <><path d="m12 3-3 3m3-3 3 3m-3-3v18m0 0-3-3m3 3 3-3M3 12h18m-18 0 3-3m-3 3 3 3m15-3-3-3m3 3-3 3" /></>,
    };
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name] || paths.check}</svg>;
}

function rankAtPoint(board, x, y) {
    const slot = document.elementFromPoint(x, y)?.closest('[data-rank-slot]');
    return slot && board?.contains(slot) ? Number(slot.dataset.rankSlot) : null;
}

export default function BlindRanking() {
    const { fruits, status, retry } = useFruits();
    const [round, dispatch] = useReducer(rankingReducer, null);
    const [hydrated, setHydrated] = useState(false);
    const initialized = useRef(false);
    const [drag, setDrag] = useState(null);
    const dragPoint = useRef(null);
    const [hoverRank, setHoverRank] = useState(null);
    const suppressClick = useRef(false);
    const boardRef = useRef(null);
    const drawButtonRef = useRef(null);
    const [announcement, setAnnouncement] = useState('');
    const [copyStatus, setCopyStatus] = useState('');
    const byId = useMemo(() => new Map(fruits.map(fruit => [String(fruit.id), fruit])), [fruits]);
    const scenario = RANKING_SCENARIOS.find(item => item.id === round?.scenarioId);
    const introFruits = useMemo(() => ['Flame-Flame', 'Gum-Gum', 'Op-Op'].map(name => fruits.find(fruit => fruit.name.startsWith(name))).filter(Boolean), [fruits]);
    const current = round?.phase === 'playing' ? byId.get(round.deck[round.cursor]) : null;
    const placedCount = round?.slots.filter(Boolean).length || 0;
    const complete = round?.phase === 'complete';
    const isDragging = Boolean(drag?.moved);

    useEffect(() => {
        if (current) drawButtonRef.current?.focus({ preventScroll: true });
    }, [current]);

    useEffect(() => {
        if (status !== 'ready' || initialized.current) return;
        initialized.current = true;
        try {
            const saved = restoreRankingRound(JSON.parse(localStorage.getItem(ROUND_STORAGE_KEY)), fruits);
            if (saved) dispatch({ type: 'SET_ROUND', round: saved });
        } catch { /* A browser without storage can still play. */ }
        setHydrated(true);
    }, [fruits, status]);

    useEffect(() => {
        if (!hydrated) return;
        try {
            if (round) localStorage.setItem(ROUND_STORAGE_KEY, JSON.stringify(round));
            else localStorage.removeItem(ROUND_STORAGE_KEY);
        } catch { /* Saving is optional. */ }
    }, [round, hydrated]);

    useEffect(() => {
        if (!isDragging) return;
        let frame;
        function scrollDuringDrag() {
            const point = dragPoint.current;
            if (point) {
                const speed = point.y < 70 ? -10 : point.y > window.innerHeight - 70 ? 10 : 0;
                if (speed) window.scrollBy(0, speed);
                setHoverRank(rankAtPoint(boardRef.current, point.x, point.y));
            }
            frame = requestAnimationFrame(scrollDuringDrag);
        }
        frame = requestAnimationFrame(scrollDuringDrag);
        return () => cancelAnimationFrame(frame);
    }, [isDragging]);

    useEffect(() => {
        if (!copyStatus) return;
        const timer = setTimeout(() => setCopyStatus(''), 3000);
        return () => clearTimeout(timer);
    }, [copyStatus]);

    function startRound() {
        dispatch({ type: 'SET_ROUND', round: createRankingRound(fruits, { previousScenarioId: round?.scenarioId }) });
        setAnnouncement('First fruit up. Choose a slot.');
        setCopyStatus('');
        window.scrollTo({ top: 0, behavior: 'instant' });
    }

    function placeFruit(rank, fruitId = current?.id) {
        if (!current || round.slots[rank - 1] || String(current.id) !== String(fruitId)) return;
        dispatch({ type: 'PLACE', rank, fruitId: String(fruitId) });
        setAnnouncement(`${current.name} locked into ${rank}. ${placedCount === 9 ? 'Your ranking is complete.' : 'Next fruit up.'}`);
    }

    function reroll() {
        if (!current || !round.rerollsLeft) return;
        dispatch({ type: 'REROLL', fruitId: String(current.id) });
        setAnnouncement(`${current.name} skipped. That was your one reroll.`);
    }

    function pointerDown(event) {
        if (!current || event.button !== 0 || !event.isPrimary) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        suppressClick.current = false;
        const point = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, startX: event.clientX, startY: event.clientY, fruitId: String(current.id), moved: false };
        dragPoint.current = point;
        setDrag(point);
    }

    function pointerMove(event) {
        const previous = dragPoint.current;
        if (!previous || previous.pointerId !== event.pointerId) return;
        const moved = previous.moved || Math.hypot(event.clientX - previous.startX, event.clientY - previous.startY) > 6;
        const point = { ...previous, x: event.clientX, y: event.clientY, moved };
        dragPoint.current = point;
        setDrag(point);
        if (moved) setHoverRank(rankAtPoint(boardRef.current, point.x, point.y));
    }

    function pointerUp(event) {
        const point = dragPoint.current;
        if (!point || point.pointerId !== event.pointerId) return;
        if (point.moved) {
            suppressClick.current = true;
            const rank = rankAtPoint(boardRef.current, event.clientX, event.clientY);
            if (rank && round.slots[rank - 1]) setAnnouncement(`Slot ${rank} is already locked. Pick an empty number.`);
            else if (rank) placeFruit(rank, point.fruitId);
            else setAnnouncement('Drop it on an empty numbered slot.');
        }
        dragPoint.current = null;
        setDrag(null);
        setHoverRank(null);
    }

    function cancelDrag() { dragPoint.current = null; setDrag(null); setHoverRank(null); }

    function focusSlots() {
        if (suppressClick.current) { suppressClick.current = false; return; }
        boardRef.current?.querySelector('button:not(:disabled)')?.focus();
    }

    async function copyRanking() {
        try {
            await navigator.clipboard.writeText(rankingShareText(round, fruits));
            setCopyStatus('Ranking copied.');
        } catch { setCopyStatus('Couldn’t copy that. Please try again.'); }
    }

    return <>
        <Seo title={BLIND_RANKING_PAGE.title} description={BLIND_RANKING_PAGE.description} canonical={BLIND_RANKING_PAGE.url} jsonLd={BLIND_RANKING_PAGE.jsonLd} />
        <Header headerShown={false} />
        <main className={styles.page}>
            {round && <div className={styles.pageHeading}><h1>Blind <span>Ranking</span></h1><p>{placedCount} / 10 placed</p></div>}
            {(status !== 'ready' || !hydrated) ? <CatalogState status={status === 'error' ? 'error' : 'loading'} retry={retry} />
                : byId.size < 11 ? <div className="catalogState" role="alert"><p>We need a few more fruits to start a round.</p><button type="button" onClick={retry}>Try loading again</button></div>
                    : !round ? <>
                        <div className={styles.intro}>
                            <div className={styles.introCopy}>
                                <h1>Blind <span>Ranking</span></h1>
                                <p>Rank ten Devil Fruits for a random situation. You only see one at a time, and your choices stay put.</p>
                                <button type="button" className={styles.primaryButton} onClick={startRound}>Play</button>
                                <span className={styles.introRules}>10 slots · One reroll · No moving fruits</span>
                            </div>
                            <div className={styles.introArt} aria-hidden="true">{introFruits.map(fruit => <FruitImage key={fruit.id} fruit={fruit} alt="" draggable={false} />)}</div>
                        </div>
                        <p className={styles.fairPlay}>1 is the best fit for the scenario. 10 is the worst. Each number gets one fruit.</p>
                    </> : <>
                        <section className={styles.scenarioStrip} aria-label="This round’s scenario">
                            <span className={styles.scenarioLabel}>Scenario</span><div><h2>{scenario.label}</h2><p>{scenario.story}</p></div>
                        </section>
                        <div className={styles.gameLayout}>
                            <aside className={styles.currentPanel}>
                                {current ? <>
                                    <div className={styles.currentCard}>
                                        <div className={styles.drawHeading}>Fruit {placedCount + 1} of 10</div>
                                        <button type="button" className={`${styles.fruitDragArea} ${isDragging ? styles.draggingSource : ''}`}
                                            ref={drawButtonRef}
                                            aria-label={`Drag ${current.name} to a rank, or choose an empty slot`}
                                            onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={cancelDrag} onLostPointerCapture={cancelDrag} onClick={focusSlots}
                                            onKeyDown={event => { if (event.key === 'Escape') cancelDrag(); }}>
                                            <FruitImage key={`character-${current.id}`} fruit={current} kind="character" className={styles.drawCharacter} alt="" aria-hidden="true" draggable={false} />
                                            <FruitImage key={current.id} fruit={current} className={styles.drawFruit} draggable={false} />
                                            <span className={styles.dragHint}><GameIcon name="drag" />Drag to a slot</span>
                                        </button>
                                        <div className={styles.fruitCopy} key={current.id}><span className={styles.typeTag}>{current.type}</span><h2>{current.name}</h2>
                                            <p className={styles.fruitDescription}>{(current.about || 'What would you do with this power?').split(/(?<=[.!?])\s+/)[0]}</p>
                                        </div>
                                    </div>
                                    <button type="button" className={styles.rerollButton} disabled={!round.rerollsLeft} onClick={reroll}><GameIcon name="shuffle" />{round.rerollsLeft ? 'Reroll · 1 left' : 'Reroll used'}</button>
                                    <p className={styles.controlHint}>Drag the fruit or tap a number to place it.</p>
                                    <p className={styles.smallRule}>Basic control. No awakening. No extra powers.</p>
                                </> : <section className={styles.finishedCard} aria-labelledby="finished-title">
                                    <h2 id="finished-title">Your final ranking</h2>
                                    <div className={styles.topPick}><span>Your best fit</span><FruitImage fruit={byId.get(round.slots[0])} /><strong>{byId.get(round.slots[0])?.name}</strong></div>
                                    <button type="button" className={styles.primaryButton} onClick={copyRanking}>Copy ranking</button>
                                    <button type="button" className={styles.secondaryButton} onClick={startRound}>Play again</button>
                                    <SocialShare
                                        className={styles.shareOptions}
                                        title={`My Devil Fruit blind ranking: ${scenario.label} — ${byId.get(round.slots[0])?.name} at #1`}
                                        text={rankingShareText(round, fruits, { includeUrl: false })}
                                        url={BLIND_RANKING_PAGE.url}
                                    />
                                    <p className={styles.copyStatus} role="status">{copyStatus}</p>
                                </section>}
                            </aside>
                            <section className={styles.rankingBoard} aria-labelledby="board-title" ref={boardRef}>
                                <div className={styles.boardHeading}><h2 id="board-title">Your ranking</h2><span>1 = best fit</span></div>
                                <div className={styles.slots}>{RANKS.map(rank => {
                                    const fruit = byId.get(round.slots[rank - 1]);
                                    const content = fruit ? <><FruitImage fruit={fruit} className={styles.slotFruit} /><span className={styles.slotName}>{fruit.name}</span><GameIcon name="lock" className={styles.lockIcon} /></>
                                        : <><span className={styles.emptySlotText}>{rank === 1 ? 'Best fit' : rank === 10 ? 'Worst fit' : '—'}</span><span className={styles.slotPlus} aria-hidden="true">+</span></>;
                                    return <div key={rank} data-rank-slot={rank} className={`${styles.slot} ${fruit ? styles.lockedSlot : ''} ${!fruit && hoverRank === rank ? styles.hoverSlot : ''} ${rank === 1 ? styles.bestSlot : ''}`}>
                                        <span className={styles.rankNumber}>{rank}</span>
                                        {fruit ? <div className={styles.slotContents}>{content}</div> : <button type="button" className={styles.slotContents} aria-label={`Rank ${rank}${rank === 1 ? ', best fit' : rank === 10 ? ', worst fit' : ''}: place ${current?.name || 'fruit'}`} onClick={() => placeFruit(rank)}>{content}</button>}
                                    </div>;
                                })}</div>
                                <div className={styles.boardFooter}><GameIcon name="lock" /><span>Placed fruits can’t be moved.</span></div>
                            </section>
                        </div>
                        {complete && <p className={styles.fairPlay}><Link to="/">Browse the fruits</Link></p>}
                    </>}
            <p className={styles.announcement} role="status" aria-live="polite" aria-atomic="true">{announcement}</p>
        </main>
        {isDragging && current && createPortal(<div className={styles.dragGhost} style={{ left: drag.x, top: drag.y }} aria-hidden="true"><FruitImage fruit={current} draggable={false} /><span>{current.name}</span></div>, document.body)}
        <Footer />
    </>;
}
