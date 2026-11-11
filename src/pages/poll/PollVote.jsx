import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FruitImage from '../../Components/FruitImage.jsx';
import Seo from '../../Components/Seo.jsx';
import useFruits from '../../hooks/useFruits.js';
import usePollSession from '../../hooks/usePollSession.js';
import { slugify } from '../../lib/slugify.js';
import { createPollBallot } from '../../lib/pollBallots.js';
import {
    getEligibleFruits,
    getPollState,
    getPollTypeCategory,
    POLL_CLOSE_AT,
    POLL_OPEN_AT,
    POLL_TYPES,
    POLL_YEAR,
} from '../../lib/pollConfig.js';
import PollLayout from './PollLayout.jsx';
import PollPodium from './PollPodium.jsx';
import styles from './Poll.module.css';

const filters = ['All', ...POLL_TYPES];
const dateOptions = { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' };

function errorText(error) {
    if (error?.code === 'permission-denied') {
        return 'Your vote was not accepted. Refresh to check whether voting is still open and try again.';
    }
    return 'We could not confirm your vote. Check your connection and try again.';
}

export default function PollVote() {
    const navigate = useNavigate();
    const pollState = getPollState();
    const session = usePollSession();
    const { fruits, status: fruitStatus, retry: retryFruits } = useFruits({ staticOnly: true });
    const [slots, setSlots] = useState([null, null, null]);
    const [activeSlot, setActiveSlot] = useState(null);
    const [dragOverSlot, setDragOverSlot] = useState(null);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [showVoteConfirmation, setShowVoteConfirmation] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const confirmationDialogRef = useRef(null);

    const eligibleFruits = useMemo(() => getEligibleFruits(fruits), [fruits]);
    const filteredFruits = useMemo(() => {
        const query = search.trim().toLocaleLowerCase();
        return eligibleFruits.filter(fruit => {
            const matchesType = filter === 'All' || getPollTypeCategory(fruit.type) === filter;
            const matchesSearch = !query || [fruit.name, fruit.romanizedName, fruit.user]
                .some(value => String(value || '').toLocaleLowerCase().includes(query));
            return matchesType && matchesSearch;
        });
    }, [eligibleFruits, filter, search]);
    const fruitById = useMemo(() => new Map(eligibleFruits.map(fruit => [String(fruit.id), fruit])), [eligibleFruits]);
    const selectedIds = slots.filter(Boolean);
    const isComplete = slots.every(id => fruitById.has(id));
    const canSubmit = isComplete
        && !submitting
        && pollState === 'open'
        && session.status === 'ready'
        && !session.ballot
        && fruitStatus === 'ready';

    useEffect(() => {
        if (session.status === 'ready' && session.ballot) {
            navigate('/poll/thanks', { replace: true });
        }
    }, [navigate, session.ballot, session.status]);

    useEffect(() => {
        const dialog = confirmationDialogRef.current;
        if (!showVoteConfirmation || !dialog) return undefined;
        dialog.showModal();
        return () => {
            if (dialog.open) dialog.close();
        };
    }, [showVoteConfirmation]);

    function chooseFruit(fruit, requestedSlot = null) {
        const fruitId = String(fruit.id);
        if (selectedIds.includes(fruitId)) return;
        const target = requestedSlot ?? (activeSlot === null ? slots.findIndex(slot => !slot) : activeSlot);
        if (target < 0) return;

        setSlots(previous => previous.map((slot, index) => index === target ? fruitId : slot));
        setActiveSlot(null);
        setShowVoteConfirmation(false);
        setSubmitError('');
    }

    function clearSlot(index) {
        setSlots(previous => previous.map((slot, slotIndex) => slotIndex === index ? null : slot));
        setActiveSlot(index);
        setShowVoteConfirmation(false);
        setSubmitError('');
    }

    function swapSlots(from, to) {
        setSlots(previous => {
            const next = [...previous];
            [next[from], next[to]] = [next[to], next[from]];
            return next;
        });
        setActiveSlot(null);
        setShowVoteConfirmation(false);
    }

    function handleFruitDrop(event, slotIndex) {
        event.preventDefault();
        const fruit = fruitById.get(event.dataTransfer.getData('text/plain'));
        if (fruit) chooseFruit(fruit, slotIndex);
        setDragOverSlot(null);
    }

    function requestVoteConfirmation(event) {
        event.preventDefault();
        if (canSubmit) setShowVoteConfirmation(true);
    }

    async function submitVote() {
        if (!session.user || !canSubmit || getPollState() !== 'open') return;

        setSubmitting(true);
        setShowVoteConfirmation(false);
        setSubmitError('');
        try {
            await createPollBallot(session.user.uid, slots);
            navigate('/poll/thanks', { replace: true });
        } catch (error) {
            console.error('Poll ballot submission failed:', error);
            setSubmitError(errorText(error));
        } finally {
            setSubmitting(false);
        }
    }

    const openingDate = new Intl.DateTimeFormat('en-US', dateOptions).format(new Date(POLL_OPEN_AT));
    const closingDate = new Intl.DateTimeFormat('en-US', dateOptions).format(new Date(Date.parse(POLL_CLOSE_AT) - 1));

    return (
        <>
            <Seo
                title={`Vote - Community's Favorite Devil Fruits ${POLL_YEAR}`}
                description={`Choose and rank your top three Devil Fruits in the ${POLL_YEAR} community poll.`}
                canonical="https://onepiecedevilfruits.com/poll/vote"
                noindex
            />
            <PollLayout>
                <section className={styles.panel}>
                    <div className={styles.panelHeading}>
                        <div>
                            <p className={styles.eyebrow}>The {POLL_YEAR} community poll</p>
                            <h1>Build your top 3</h1>
                            <p>Choose exactly three different fruits. Your ranking determines the points they receive.</p>
                        </div>
                        <button
                            type="submit"
                            form="poll-vote-form"
                            className={styles.primaryButton}
                            disabled={!canSubmit}
                        >
                            {submitting ? 'Submitting...' : 'Submit vote'}
                        </button>
                    </div>

                    {showVoteConfirmation && (
                        <dialog
                            ref={confirmationDialogRef}
                            className={styles.confirmationPanel}
                            onCancel={event => {
                                event.preventDefault();
                                setShowVoteConfirmation(false);
                            }}
                            onKeyDown={event => {
                                if (event.key === 'Escape') {
                                    event.preventDefault();
                                    setShowVoteConfirmation(false);
                                }
                            }}
                            aria-labelledby="poll-confirmation-title"
                            aria-describedby="poll-confirmation-message"
                        >
                            <h2 id="poll-confirmation-title">Submit your final vote?</h2>
                            <p id="poll-confirmation-message">
                                Votes are final and cannot be changed or deleted after submission.
                            </p>
                            <div className={styles.confirmationActions}>
                                <button
                                    type="button"
                                    className={styles.secondaryButton}
                                    autoFocus
                                    onClick={() => setShowVoteConfirmation(false)}
                                >
                                    Go back
                                </button>
                                <button
                                    type="button"
                                    className={styles.primaryButton}
                                    disabled={submitting}
                                    onClick={submitVote}
                                >
                                    {submitting ? 'Submitting...' : 'Proceed to submit'}
                                </button>
                            </div>
                        </dialog>
                    )}

                    {pollState !== 'open' ? (
                        <p className={styles.stateMessage} role="status">
                            {pollState === 'upcoming'
                                ? `Voting opens ${openingDate} (UTC).`
                                : `Voting closed ${closingDate} (UTC).`}
                        </p>
                    ) : session.status === 'loading' ? (
                        <p className={styles.stateMessage} role="status">Checking this browser for an existing vote...</p>
                    ) : session.status === 'error' ? (
                        <div>
                            <p className={`${styles.stateMessage} ${styles.errorMessage}`} role="alert">
                                We could not load the poll. Check your connection and try again.
                            </p>
                            <button type="button" className={styles.secondaryButton} onClick={session.retry}>Retry</button>
                        </div>
                    ) : session.ballot ? (
                        <p className={styles.stateMessage}>Your ballot is already recorded. Redirecting to your confirmation...</p>
                    ) : fruitStatus === 'loading' ? (
                        <p className={styles.stateMessage} role="status">Loading the Devil Fruit catalog...</p>
                    ) : fruitStatus === 'error' ? (
                        <div>
                            <p className={`${styles.stateMessage} ${styles.errorMessage}`} role="alert">
                                The fruit catalog could not be loaded.
                            </p>
                            <button type="button" className={styles.secondaryButton} onClick={retryFruits}>Retry catalog</button>
                        </div>
                    ) : (
                        <form id="poll-vote-form" onSubmit={requestVoteConfirmation}>
                            <PollPodium
                                slots={slots.map(id => id ? fruitById.get(id) : null)}
                                activeSlot={activeSlot}
                                onSelectSlot={setActiveSlot}
                                onClearSlot={clearSlot}
                                onSwapSlot={swapSlots}
                                dragOverSlot={dragOverSlot}
                                onDragOverSlot={setDragOverSlot}
                                onDropFruit={handleFruitDrop}
                            />

                            <div className={styles.pickerControls}>
                                <label>
                                    <span className={styles.srOnly}>Search fruits by name, romanized name, or user</span>
                                    <input
                                        className={styles.searchInput}
                                        type="search"
                                        value={search}
                                        onChange={event => setSearch(event.target.value)}
                                        placeholder="Search fruit, romanized name, or user..."
                                    />
                                </label>
                                <div className={styles.filterChips} aria-label="Filter by fruit type">
                                    {filters.map(type => (
                                        <button
                                            type="button"
                                            key={type}
                                            className={`${styles.filterChip} ${filter === type ? styles.selectedChip : ''}`}
                                            aria-pressed={filter === type}
                                            onClick={() => setFilter(type)}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <p className={styles.muted} aria-live="polite">
                                {filteredFruits.length} {filteredFruits.length === 1 ? 'fruit' : 'fruits'}
                                {activeSlot === null ? ' · Filling the next empty place' : ` · Selecting for ${activeSlot + 1}${activeSlot === 0 ? 'st' : activeSlot === 1 ? 'nd' : 'rd'} place`}
                            </p>
                            <div className={styles.fruitGrid}>
                                {filteredFruits.map(fruit => {
                                    const fruitId = String(fruit.id);
                                    const selectedIndex = slots.indexOf(fruitId);
                                    return (
                                        <article
                                            key={fruitId}
                                            className={`${styles.fruitChoice} ${selectedIndex >= 0 ? styles.chosenFruit : ''}`}
                                        >
                                            <button
                                                type="button"
                                                className={styles.fruitSelectButton}
                                                draggable={selectedIndex < 0}
                                                disabled={selectedIndex >= 0}
                                                onClick={() => chooseFruit(fruit)}
                                                onDragStart={event => {
                                                    event.dataTransfer.setData('text/plain', fruitId);
                                                    event.dataTransfer.effectAllowed = 'copy';
                                                }}
                                                aria-label={`${fruit.name}, ${fruit.type}${selectedIndex >= 0 ? `, selected for ${selectedIndex + 1}${selectedIndex === 0 ? 'st' : selectedIndex === 1 ? 'nd' : 'rd'} place` : ', choose fruit or drag to a ranking slot'}`}
                                            >
                                                <FruitImage fruit={fruit} loading="lazy" alt="" />
                                                <strong>{fruit.name}</strong>
                                                <span>{fruit.type}</span>
                                            </button>
                                            <a
                                                className={styles.fruitDetailsLink}
                                                href={`/fruit/${slugify(fruit.name)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={`View ${fruit.name} details in a new tab`}
                                                onDragStart={event => event.preventDefault()}
                                            >
                                                <span aria-hidden="true">↗</span>
                                            </a>
                                        </article>
                                    );
                                })}
                                {filteredFruits.length === 0 && (
                                    <p className={styles.emptyResults}>No fruits match your search and filter.</p>
                                )}
                            </div>

                            <p className={styles.privacyNote}>
                                Your ranked picks and submission time are saved anonymously. Only you can view your ballot on the site.
                            </p>

                            {submitError && <p className={`${styles.stateMessage} ${styles.errorMessage}`} role="alert">{submitError}</p>}
                            <div className={styles.submitRow}>
                                <span className={styles.muted}>{selectedIds.length} of 3 choices selected</span>
                            </div>
                        </form>
                    )}
                </section>
            </PollLayout>
        </>
    );
}
