import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { getFruitArcOptions } from "../../lib/fruitArcs.js";
import styles from "./FruitArcFilter.module.css";
import { ABILITY_TAGS, FILTER_DEFAULTS, SORT_OPTIONS } from '../../lib/fruitDiscovery.js';

export default function FruitArcFilter({ fruits, selectedArc, resultCount, onChange, filters, onFilterChange, clearFilters }) {
    const titleId = useId();
    const { hash } = useLocation();
    const panelRef = useRef(null);
    const trackRef = useRef(null);
    const [scrollState, setScrollState] = useState({ canGoBack: false, canGoForward: false });
    const options = useMemo(() => getFruitArcOptions(fruits), [fruits]);
    const hasSelection = filters ? Object.entries(filters).some(([key, value]) => value !== FILTER_DEFAULTS[key]) : selectedArc && selectedArc !== "all";

    useEffect(() => {
        if (hash !== '#fruit-filters') return;
        const frame = requestAnimationFrame(() => panelRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' }));
        return () => cancelAnimationFrame(frame);
    }, [hash, fruits.length]);

    const updateScrollState = useCallback(() => {
        const track = trackRef.current;
        if (!track) return;

        const maxScroll = track.scrollWidth - track.clientWidth;
        setScrollState({
            canGoBack: track.scrollLeft > 4,
            canGoForward: track.scrollLeft < maxScroll - 4,
        });
    }, []);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return undefined;

        updateScrollState();
        track.addEventListener("scroll", updateScrollState, { passive: true });
        window.addEventListener("resize", updateScrollState);

        return () => {
            track.removeEventListener("scroll", updateScrollState);
            window.removeEventListener("resize", updateScrollState);
        };
    }, [options.length, updateScrollState]);

    useEffect(() => {
        const track = trackRef.current;
        const activeChip = track?.querySelector('[aria-pressed="true"]');
        if (!track || !activeChip) return;

        const trackBounds = track.getBoundingClientRect();
        const chipBounds = activeChip.getBoundingClientRect();
        const centeredPosition = track.scrollLeft
            + chipBounds.left
            - trackBounds.left
            - (track.clientWidth - chipBounds.width) / 2;
        track.scrollTo({ left: Math.max(0, centeredPosition), behavior: "smooth" });
    }, [options.length, selectedArc]);

    function scrollArcs(direction) {
        const track = trackRef.current;
        if (!track) return;

        track.scrollBy({
            left: direction * Math.max(260, track.clientWidth * 0.72),
            behavior: "smooth",
        });
    }

    return (
        <section id="fruit-filters" ref={panelRef} className={styles.filterPanel} aria-labelledby={titleId}>
            <div className={styles.panelHeader}>
                <div className={styles.titleGroup}>
                    <span className={styles.routeIcon} aria-hidden="true">
                        <svg viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="8" />
                            <path d="m14.8 9.2-1.6 4-4 1.6 1.6-4 4-1.6Z" />
                        </svg>
                    </span>
                    <div className={styles.titleCopy}>
                        <h2 id={titleId}>Find your fruit</h2>
                        <p>Pick a debut arc, then narrow things down.</p>
                    </div>
                </div>

                <div className={styles.resultSummary} aria-live="polite">
                    <p>
                        <strong>{resultCount}</strong> {resultCount === 1 ? "fruit" : "fruits"}
                    </p>
                    {hasSelection && (
                        <button type="button" onClick={clearFilters || (() => onChange("all"))}>
                            Reset
                        </button>
                    )}
                </div>
            </div>

            <div className={styles.timelineShell}>
                <button
                    type="button"
                    className={styles.scrollButton}
                    onClick={() => scrollArcs(-1)}
                    disabled={!scrollState.canGoBack}
                    aria-label="See earlier arcs"
                >
                    <svg aria-hidden="true" viewBox="0 0 20 20">
                        <path d="m12.5 5-5 5 5 5" />
                    </svg>
                </button>

                <div
                    ref={trackRef}
                    className={styles.arcTrack}
                    role="group"
                    aria-label="Filter fruits by debut arc"
                >
                    <button
                        type="button"
                        className={`${styles.arcChip} ${selectedArc === 'all' ? styles.activeChip : ""}`}
                        aria-pressed={selectedArc === 'all'}
                        onClick={() => onChange("all")}
                    >
                        <span>All arcs</span>
                        <strong>{fruits.length}</strong>
                    </button>

                    {options.map((arc) => {
                        const isActive = selectedArc === arc.name;

                        return (
                            <button
                                key={arc.name}
                                type="button"
                                className={`${styles.arcChip} ${isActive ? styles.activeChip : ""}`}
                                aria-pressed={isActive}
                                onClick={() => onChange(arc.name)}
                            >
                                <span>{arc.name}</span>
                                <strong>{arc.count}</strong>
                            </button>
                        );
                    })}
                </div>

                <button
                    type="button"
                    className={styles.scrollButton}
                    onClick={() => scrollArcs(1)}
                    disabled={!scrollState.canGoForward}
                    aria-label="See later arcs"
                >
                    <svg aria-hidden="true" viewBox="0 0 20 20">
                        <path d="m7.5 5 5 5-5 5" />
                    </svg>
                </button>
            </div>
            {filters && <div className={styles.extraFilters}>
                <label>Canon status
                    <select className={filters.canon !== FILTER_DEFAULTS.canon ? styles.selectedFilter : undefined} value={filters.canon} onChange={event => onFilterChange('canon', event.target.value)}>
                        <option value="all">All fruits</option><option value="canon">Canon</option><option value="non-canon">Non-canon</option><option value="unknown">Unknown</option>
                    </select>
                </label>
                <label>Awakening
                    <select className={filters.awakening !== FILTER_DEFAULTS.awakening ? styles.selectedFilter : undefined} value={filters.awakening} onChange={event => onFilterChange('awakening', event.target.value)}>
                        <option value="all">Any status</option><option value="awakened">Awakened</option><option value="not-confirmed">Not confirmed</option><option value="unknown">Unknown</option>
                    </select>
                </label>
                <label>Ability
                    <select className={filters.ability !== FILTER_DEFAULTS.ability ? styles.selectedFilter : undefined} value={filters.ability} onChange={event => onFilterChange('ability', event.target.value)}>
                        <option value="all">Any ability</option>
                        {ABILITY_TAGS.map(tag => <option key={tag.id} value={tag.id}>{tag.label}</option>)}
                    </select>
                </label>
                <label>Sort by
                    <select className={filters.sort !== FILTER_DEFAULTS.sort ? styles.selectedFilter : undefined} value={filters.sort} onChange={event => onFilterChange('sort', event.target.value)}>
                        {SORT_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                </label>
            </div>}
            {filters?.sort.startsWith('debut') && <p className={styles.filterNote}>Debut order follows the arc timeline. Fruits in the same arc are listed A–Z.</p>}
        </section>
    );
}
