import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { getFruitArcOptions } from "../../lib/fruitArcs.js";
import styles from "./FruitArcFilter.module.css";

export default function FruitArcFilter({ fruits, selectedArc, resultCount, onChange }) {
    const titleId = useId();
    const trackRef = useRef(null);
    const [scrollState, setScrollState] = useState({ canGoBack: false, canGoForward: false });
    const options = useMemo(() => getFruitArcOptions(fruits), [fruits]);
    const hasSelection = selectedArc && selectedArc !== "all";

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
        <section className={styles.filterPanel} aria-labelledby={titleId}>
            <div className={styles.panelHeader}>
                <div className={styles.titleGroup}>
                    <span className={styles.routeIcon} aria-hidden="true">
                        <svg viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="8" />
                            <path d="m14.8 9.2-1.6 4-4 1.6 1.6-4 4-1.6Z" />
                        </svg>
                    </span>
                    <div className={styles.titleCopy}>
                        <h2 id={titleId}>Explore by debut arc</h2>
                        <p>Follow the Grand Line and choose where a fruit first appeared.</p>
                    </div>
                </div>

                <div className={styles.resultSummary} aria-live="polite">
                    <p>
                        <strong>{resultCount}</strong> {resultCount === 1 ? "fruit" : "fruits"}
                    </p>
                    {hasSelection && (
                        <button type="button" onClick={() => onChange("all")}>
                            Clear
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
                        className={`${styles.arcChip} ${!hasSelection ? styles.activeChip : ""}`}
                        aria-pressed={!hasSelection}
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
        </section>
    );
}
