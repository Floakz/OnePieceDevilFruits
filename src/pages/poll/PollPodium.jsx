import FruitImage from '../../Components/FruitImage.jsx';
import styles from './Poll.module.css';

const RANKS = ['1st place', '2nd place', '3rd place'];

export default function PollPodium({
    slots,
    activeSlot = null,
    onSelectSlot,
    onClearSlot,
    onSwapSlot,
    dragOverSlot = null,
    onDragOverSlot,
    onDropFruit,
}) {
    const interactive = Boolean(onSelectSlot);

    return (
        <div className={styles.podium} aria-label="Your top three fruit choices">
            {slots.map((fruit, index) => (
                <article
                    className={`${styles.podiumSlot} ${index === 0 ? styles.firstPlace : ''} ${activeSlot === index ? styles.activeSlot : ''} ${dragOverSlot === index ? styles.dropTarget : ''}`}
                    key={RANKS[index]}
                    onDragOver={interactive ? event => {
                        event.preventDefault();
                        event.dataTransfer.dropEffect = 'copy';
                        onDragOverSlot?.(index);
                    } : undefined}
                    onDragLeave={interactive ? () => onDragOverSlot?.(null) : undefined}
                    onDrop={interactive ? event => onDropFruit?.(event, index) : undefined}
                >
                    <div className={styles.rankHeader}>
                        <span className={styles.rankNumber}>{index + 1}</span>
                        <div>
                            <h3>{RANKS[index]}</h3>
                            <p>{3 - index} {3 - index === 1 ? 'point' : 'points'}</p>
                        </div>
                    </div>
                    {fruit ? (
                        <div className={styles.podiumFruit}>
                            <FruitImage
                                fruit={fruit}
                                loading="lazy"
                                alt={`${fruit.name} fruit`}
                                className={styles.podiumImage}
                            />
                            <div className={styles.podiumFruitDetails}>
                                <strong>{fruit.name}</strong>
                                <span>{fruit.user || 'Unknown user'}</span>
                                <span>{fruit.type}</span>
                            </div>
                        </div>
                    ) : (
                        <p className={styles.emptySlot}>Choose a fruit for this place</p>
                    )}
                    {interactive && (
                        <div className={styles.slotActions}>
                            <button
                                type="button"
                                className={styles.textButton}
                                aria-pressed={activeSlot === index}
                                onClick={() => onSelectSlot(index)}
                            >
                                {activeSlot === index ? 'Selected slot' : 'Select slot'}
                            </button>
                            {fruit && (
                                <button
                                    type="button"
                                    className={styles.textButton}
                                    onClick={() => onClearSlot(index)}
                                >
                                    Clear
                                </button>
                            )}
                            {fruit && activeSlot !== null && activeSlot !== index && slots[activeSlot] && (
                                <button
                                    type="button"
                                    className={styles.textButton}
                                    onClick={() => onSwapSlot(activeSlot, index)}
                                >
                                    Swap with selected
                                </button>
                            )}
                        </div>
                    )}
                </article>
            ))}
        </div>
    );
}
