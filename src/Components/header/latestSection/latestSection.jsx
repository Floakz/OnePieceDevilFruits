import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./latestSection.module.css";
import { fetchAllFruitsOnce } from "../../../lib/fruitsApi.js";

export default function LatestSection() {
    const navigate = useNavigate();

    const [allFruits, setAllFruits] = useState([]);
    const [displayedFruits, setDisplayedFruits] = useState([]);

    const [displayedNr, setDisplayedNr] = useState(1);

    const CARD_WIDTH = 170; // card width + gap
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new ResizeObserver(([entry]) => {
            const width = entry.contentRect.width;


            const availableWidth = width - 70;

            const visibleCards = Math.max(
                1,
                Math.floor(availableWidth / CARD_WIDTH)
            );

            setDisplayedNr(visibleCards);
        });

        observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        (async () => {
            const list = await fetchAllFruitsOnce();
            setAllFruits(Array.isArray(list) ? list : []);
        })();
    }, []);

    useEffect(() => {
        setDisplayedFruits([...allFruits.slice(-displayedNr)].reverse());
    }, [allFruits, displayedNr]);


    return (
        <div ref={containerRef} className={styles.latestSection}>
            <h3 className={styles.latestLabel}>LATEST ADDED</h3>

            {displayedFruits.map(fruit => {
                return (
                    <div key={fruit.id} onClick={() => navigate(`/fruit/${fruit.id}`)} className={styles.newFruitItem}>
                        <img src={`https://cd-opf.pages.dev/fruits/${fruit.id}.webp`} alt={fruit.name} />
                        <p>{fruit.name}</p>
                    </div>
                )
            })}







        </div>
    );
}
