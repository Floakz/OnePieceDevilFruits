import { useEffect, useId, useMemo, useRef } from "react";
import { getFruitArcOptions } from "../../lib/fruitArcs.js";
import styles from "./FruitArcFilter.module.css";

export default function FruitArcFilter({ fruits, selectedArc, resultCount, onChange }) {
    const selectId = useId();
    const dropdownRef = useRef(null);
    const options = useMemo(() => getFruitArcOptions(fruits), [fruits]);
    const hasSelection = selectedArc && selectedArc !== "all";
    const selectedLabel = hasSelection
        ? `${selectedArc} (${options.find((arc) => arc.name === selectedArc)?.count || resultCount})`
        : `All debut arcs (${fruits.length})`;

    useEffect(() => {
        function closeDropdown(event) {
            if (!dropdownRef.current?.contains(event.target)) {
                dropdownRef.current.open = false;
            }
        }

        function closeOnEscape(event) {
            if (event.key === "Escape" && dropdownRef.current?.open) {
                dropdownRef.current.open = false;
                dropdownRef.current.querySelector("summary")?.focus();
            }
        }

        document.addEventListener("pointerdown", closeDropdown);
        document.addEventListener("keydown", closeOnEscape);

        return () => {
            document.removeEventListener("pointerdown", closeDropdown);
            document.removeEventListener("keydown", closeOnEscape);
        };
    }, []);

    function selectArc(arc) {
        dropdownRef.current.open = false;
        onChange(arc);
    }

    return (
        <section className={styles.filterPanel} aria-labelledby={`${selectId}-title`}>
            <div className={styles.filterCopy}>
                <span className={styles.eyebrow}>Explore the Grand Line</span>
                <h2 id={`${selectId}-title`}>Filter by debut arc</h2>
                <p>See the Devil Fruits that first appeared during a specific story arc.</p>
            </div>

            <div className={styles.filterControls}>
                <span id={`${selectId}-label`} className={styles.controlLabel}>Story arc</span>
                <div className={styles.selectRow}>
                    <details ref={dropdownRef} className={styles.selectWrapper}>
                        <summary
                            className={styles.selectTrigger}
                            aria-labelledby={`${selectId}-label ${selectId}-value`}
                        >
                            <svg className={styles.leadingIcon} aria-hidden="true" viewBox="0 0 24 24">
                                <path d="M5 4h14v16H5zM8 8h8M8 12h8M8 16h5" />
                            </svg>
                            <span id={`${selectId}-value`}>{selectedLabel}</span>
                            <svg className={styles.chevron} aria-hidden="true" viewBox="0 0 20 20">
                                <path d="m5 7.5 5 5 5-5" />
                            </svg>
                        </summary>

                        <div className={styles.optionsList} role="listbox" aria-labelledby={`${selectId}-label`}>
                            <button
                                type="button"
                                role="option"
                                aria-selected={!hasSelection}
                                className={!hasSelection ? styles.selectedOption : undefined}
                                onClick={() => selectArc("all")}
                            >
                                <span>All debut arcs</span>
                                <strong>{fruits.length}</strong>
                            </button>
                            {options.map((arc) => (
                                <button
                                    key={arc.name}
                                    type="button"
                                    role="option"
                                    aria-selected={selectedArc === arc.name}
                                    className={selectedArc === arc.name ? styles.selectedOption : undefined}
                                    onClick={() => selectArc(arc.name)}
                                >
                                    <span>{arc.name}</span>
                                    <strong>{arc.count}</strong>
                                </button>
                            ))}
                        </div>
                    </details>

                    {hasSelection && (
                        <button type="button" onClick={() => onChange("all")}>
                            Clear
                        </button>
                    )}
                </div>

                <p className={styles.resultCount} aria-live="polite">
                    <strong>{resultCount}</strong> {resultCount === 1 ? "fruit" : "fruits"}
                    {hasSelection ? ` debuted in ${selectedArc}` : " in this catalog"}
                </p>
            </div>
        </section>
    );
}
