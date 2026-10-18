import { useEffect, useMemo, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './latestSection.module.css';
import useFruits from '../../../hooks/useFruits.js';
import FruitImage from '../../FruitImage.jsx';
import { slugify } from '../../../lib/slugify.js';

export default function LatestSection() {
    const { fruits, status } = useFruits();
    const [displayedNr, setDisplayedNr] = useState(1);
    const containerRef = useRef(null);
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const observer = new ResizeObserver(([entry]) => {
            const isMobile = window.matchMedia('(max-width: 850px)').matches;
            setDisplayedNr(isMobile ? 7 : Math.max(1, Math.floor((entry.contentRect.width - 70) / 170)));
        });
        observer.observe(container);
        return () => observer.disconnect();
    }, [status]);
    const displayedFruits = useMemo(() => fruits.slice(-displayedNr).reverse(), [fruits, displayedNr]);
    if (status !== 'ready' || !fruits.length) return null;
    return <div ref={containerRef} className={styles.latestSection}>
        <h3 className={styles.latestLabel}>LATEST ADDED</h3>
        <div className={styles.fruitList}>
            {displayedFruits.map(fruit => <Link key={fruit.id} to={`/fruit/${slugify(fruit.name)}/`} className={styles.newFruitItem}>
                <FruitImage fruit={fruit} alt={fruit.name} /><p>{fruit.name}</p>
            </Link>)}
        </div>
    </div>;
}
