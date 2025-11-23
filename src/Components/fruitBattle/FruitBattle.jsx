import { useEffect, useRef, useState } from 'react';
import styles from './FruitBattle.module.css';
import { getRandomFruits } from "../../lib/fruitsApi";

export default function FruitBattle() {
    const [gameMenu, setGameMenu] = useState(true);
    const [isGameOver, setIsGameOver] = useState(false);

    // store OBJECTS here, not indexes
    const [enemyCrew, setEnemyCrew] = useState([]);
    const [allyCrew, setAllyCrew] = useState([null, null, null, null, null, null, null]);
    const [allyPool, setAllyPool] = useState([]);

    const spinningRef = useRef(Array(7).fill(false));

    const fruitImgLocation = '/images/fruits';
    const characterImgLocation = '/images/characters';

    function getPower(team) {
        return team.reduce((sum, f) => (f ? sum + (f.power || 0) : sum), 0);
    }

    async function newGame() {
        setIsGameOver(false);
        setGameMenu(false);

        const pool = await getRandomFruits(40); // 40 random OBJECTS from DB
        setEnemyCrew(pool.slice(0, 7));         // 7 for enemy (OBJECTS)
        setAllyCrew([null, null, null, null, null, null, null]);
        setAllyPool(pool.slice(7));             // 13 available for player (OBJECTS)
    }

    function getAllyMember(slotIdx) {
        if (!allyPool.length || spinningRef.current[slotIdx]) return;
        spinningRef.current[slotIdx] = true;

        const previewIdxs = Array.from(
            { length: Math.min(7, allyPool.length) },
            () => Math.floor(Math.random() * allyPool.length)
        );

        let p = 0;
        const interval = setInterval(() => {
            p = (p + 1) % previewIdxs.length;
            const previewFruit = allyPool[previewIdxs[p]]; // OBJECT
            setAllyCrew(prev => prev.map((m, i) => (i === slotIdx ? previewFruit : m)));
        }, 200);

        setTimeout(() => {
            clearInterval(interval);
            const choiceIdx = previewIdxs[Math.floor(Math.random() * previewIdxs.length)];
            const chosen = allyPool[choiceIdx]; // OBJECT

            setAllyCrew(prev => prev.map((m, i) => (i === slotIdx ? chosen : m)));
            setAllyPool(prev => prev.filter((_, i) => i !== choiceIdx)); // remove chosen from pool
            spinningRef.current[slotIdx] = false;
        }, 2500);
    }

    useEffect(() => {
        const filled = allyCrew.filter(Boolean).length;
        if (filled === 7 && !isGameOver) {
            const t = setTimeout(() => setIsGameOver(true), 800);
            return () => clearTimeout(t);
        }
    }, [allyCrew, isGameOver]);

    return (
        <div className={styles.battleWrapper}>
            {isGameOver && (
                <div className={styles.gameOverMenuWrapper}>
                    <span className={styles.resultMessage}>
                        {getPower(allyCrew) > getPower(enemyCrew)
                            ? 'Victory! Your crew dominates the seas!'
                            : 'You got defeated! Try another crew combo.'}
                    </span>
                    <button onClick={newGame} className={styles.newFightButton}>New Challenge</button>
                </div>
            )}

            {gameMenu && (
                <div className={styles.titleMenu}>
                    <h2 className={styles.menuTitle}>Build Your Devil<br /> Fruit Crew</h2>
                    <span>Face random enemy crews and prove your team is the strongest on the seas!</span>
                    <button onClick={newGame} className={styles.newFightButton}>Start Battle</button>
                </div>
            )}

            {!gameMenu && (
                <>
                    {/* Enemy side */}
                    <div className={styles.sideWrapper}>
                        <div className={`${styles.headerInfo} ${styles.enemy}`}>
                            <h3>Enemy Crew</h3>
                            <span>Total Power: <b>{getPower(enemyCrew)}</b></span>
                        </div>
                        <div className={styles.fruitLineWrapper}>
                            {enemyCrew.map((f, idx) => (
                                <div key={idx} className={`${styles.fruitWrapper} ${styles.enemy}`}>
                                    <img loading="lazy" className={styles.userImg} src={`${characterImgLocation}/${f.id}.webp` ?? f.img?.user} alt={`image of ${f.user} fruit`} />
                                    <img loading="lazy" src={`${fruitImgLocation}/${f.id}.webp` ?? f.img?.fruit} alt={`image of ${f.name} fruit`} />
                                    <span className={styles.fruitNameCard}>{f.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Ally side */}
                    <div className={styles.sideWrapper}>
                        <div className={styles.fruitLineWrapper}>
                            {allyCrew.map((f, idx) =>
                                f ? (
                                    <div key={idx} className={`${styles.fruitWrapper} ${styles.ally}`}>
                                        <img loading="lazy" className={styles.userImg} src={`${characterImgLocation}/${f.id}.webp` ?? f.img?.user} alt={`image of ${f.user} fruit`} />
                                        <img loading="lazy" src={`${fruitImgLocation}/${f.id}.webp` ?? f.img?.fruit} alt={`image of ${f.name} fruit`} />
                                        <span className={styles.fruitNameCard}>{f.name}</span>
                                    </div>
                                ) : (
                                    <div key={idx} onClick={() => getAllyMember(idx)} className={`${styles.fruitWrapper} ${styles.empty}`}>
                                        Recruit<br /> Member
                                    </div>
                                )
                            )}
                        </div>

                        <div className={`${styles.headerInfo} ${styles.ally}`}>
                            <h3>Your crew</h3>
                            <span>Total Power: <b>{getPower(allyCrew) || 0}</b></span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
