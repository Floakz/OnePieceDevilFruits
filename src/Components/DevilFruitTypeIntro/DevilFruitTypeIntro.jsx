import styles from './devilFruitTypeIntro.module.css';

export default function DevilFruitTypeIntro({ title, image, imageAlt = '', facts = [] }) {

    const iconSrc = '/images/bulletPointIcon.webp'

    return (
        <div className={styles.wrapper}>
            <div className={styles.titleColumn}>
                <h2 className={styles.title}>{title}</h2>
                {image && (
                    <div className={styles.imageWrapper}>
                        <img className={styles.typeImage} src={image} alt={imageAlt} loading="lazy" />
                    </div>
                )}
            </div>

            <div className={styles.factsGrid}>
                {facts.map((fact, idx) => {
                    const isObject = typeof fact === 'object' && fact !== null;
                    const highlight = isObject ? fact.highlight : null;
                    const text = isObject ? fact.text : fact;

                    return (
                        <div className={styles.factRow} key={idx}>
                            {iconSrc && (
                                <img className={styles.factIcon} src={iconSrc} alt="" loading="lazy" />
                            )}
                            <p className={styles.factText}>
                                {highlight && <span className={styles.factHighlight}>{highlight}</span>}
                                {text}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
