import { useEffect, useState } from 'react'
import styles from './FruitBattle.module.css'
import { useRef } from 'react'

export default function FruitBattle({ fruits }) {



    let [gameMenu, setGameMenu] = useState(true)
    let [isGameOver, setIsGameOver] = useState(false)

    const finishTimeoutRef = useRef(null);
    const animRefs = useRef(Array.from({ length: 7 }, () => ({ interval: null, timeout: null })));

    function clearFinishTimeout() {
        if (finishTimeoutRef.current) {
            clearTimeout(finishTimeoutRef.current);
            finishTimeoutRef.current = null;
        }
    }
    function clearAllAnimations() {
        animRefs.current.forEach((t, i) => {
            if (t.interval) clearInterval(t.interval);
            if (t.timeout) clearTimeout(t.timeout);
            animRefs.current[i] = { interval: null, timeout: null };
        });
    }


    // DEVIL FRUIT TEAMS

    let [enemyCrew, setEnemyCrew] = useState([])

    let [allyCrew, setAllyCrew] = useState([null, null, null, null, null, null, null])

    function getRandomEnemyCrew() {
        const crew = []
        for (let i = 0; i < 7; i++) {
            let crewMember = Math.floor(Math.random() * fruits.length)
            crew.push(crewMember)
        }
        setEnemyCrew(crew)
        return
    }

    function getAllyMember(slotIdx) {
        if (!fruits?.length) return;

        const pool = Array.from({ length: 7 }, () => Math.floor(Math.random() * fruits.length));
        let p = 0;

        const interval = setInterval(() => {
            p = (p + 1) % pool.length;
            const previewFruitIndex = pool[p];
            setAllyCrew(prev =>
                prev.map((m, i) => (i === slotIdx ? previewFruitIndex : m))
            );
        }, 200);


        setTimeout(() => {
            clearInterval(interval);
            const finalFruitIndex = pool[Math.floor(Math.random() * pool.length)];
            setAllyCrew(prev =>
                prev.map((m, i) => (i === slotIdx ? finalFruitIndex : m))
            );
        }, 2500);
    }


    function newGame() {
        clearFinishTimeout();
        clearAllAnimations();
        getRandomEnemyCrew();
        setAllyCrew([null, null, null, null, null, null, null]);
        setIsGameOver(false);
        setGameMenu(false);
    }


    function getEnemyPower() {
        return enemyCrew.reduce((sum, i) => {
            const f = fruits?.[i];
            return f ? sum + (f.power || 0) : sum;
        }, 0);
    }



    function getAllyPower() {
        return allyCrew.reduce((sum, i) => {
            const f = fruits?.[i];
            return f ? sum + (f.power || 0) : sum;
        }, 0);
    }

    useEffect(() => {
        const filled = allyCrew.filter(i => i != null).length;
        clearFinishTimeout();
        if (filled === 7) {
            finishTimeoutRef.current = setTimeout(() => {
                setIsGameOver(true);
                finishTimeoutRef.current = null;
            }, 1000);
        }
        return clearFinishTimeout;
    }, [allyCrew]);

    return (
        <div className={styles.battleWrapper}>

            {isGameOver && <div className={styles.gameOverMenuWrapper}>
                <span className={styles.resultMessage}> {getAllyPower() > getEnemyPower() ? 'Victory! Your crew dominates the seas!' : 'You got defeated! Try another crew combo.'}</span>
                <button onClick={() => newGame()} className={styles.newFightButton}>New Challenge</button>
            </div>}

            {gameMenu &&
                <div className={styles.titleMenu}>
                    <h2 className={styles.menuTitle}>Build Your Devil<br /> Fruit Crew</h2>
                    <span>Face random enemy crews and prove your team is the strongest on the seas!</span>
                </div>
            }

            {!gameMenu && <>
                <div className={styles.sideWrapper} >
                    <div className={`${styles.headerInfo} ${styles.enemy}`}>
                        <h3>Enemy Crew</h3>
                        <span>Total Power: <b>{getEnemyPower()}</b></span>
                    </div>
                    <div className={styles.fruitLineWrapper}>

                        {enemyCrew.map((member, idx) => {
                            return (<div key={idx} className={`${styles.fruitWrapper} ${styles.enemy}`}>
                                <img className={styles.userImg} src={fruits[member].img.user} alt={`image of ${fruits[member].user} fruit`} />
                                <img src={fruits[member].img.fruit} alt={`image of ${fruits[member].name} fruit`} />
                                <span className={styles.fruitNameCard}>{fruits[member].name}</span>
                            </div>)

                        })}

                    </div>

                </div>

                <div className={styles.sideWrapper}>



                    <div className={styles.fruitLineWrapper}>

                        {allyCrew.map((member, idx) => {
                            return member !== null ?
                                (<div key={idx} className={`${styles.fruitWrapper} ${styles.ally}`}>
                                    <img className={styles.userImg} src={fruits[member].img.user} alt={`image of ${fruits[member].user} fruit`} />
                                    <img src={fruits[member].img.fruit} alt={`image of ${fruits[member].name} fruit`} />
                                    <span className={styles.fruitNameCard}>{fruits[member].name}</span>
                                </div>)
                                : (<div onClick={() => getAllyMember(idx)} className={`${styles.fruitWrapper} ${styles.empty}`}>Recruit<br /> Member</div>)
                        })}
                    </div>

                    <div className={`${styles.headerInfo} ${styles.ally}`}>
                        <h3>Your crew</h3>
                        <span>Total Power: <b>{getAllyPower() || 0}</b></span>
                    </div>
                </div>
            </>}




            {gameMenu && <button onClick={() => newGame()} className={styles.newFightButton}>Start Battle</button>}
        </div>
    )
}