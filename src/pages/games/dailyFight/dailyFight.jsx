import FruitImage from '../../../Components/FruitImage.jsx';
import styles from './dailyFight.module.css'
import Header from '../../../Components/header/Header'
import Footer from '../../../Components/footer/footer'
import { fetchAllFruitsOnce } from '../../../lib/fruitsApi'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import characters from '../../../lib/characters'
import { DAILY_FIGHT_START_DATE, fightVotingState, loadFight, readStoredVote, submitFightVote, todayIdUTC, voteCounts, voteStorageKey } from '../../../lib/dailyFightApi';
import { db, auth } from '../../../lib/firebase'
import { onAuthStateChanged } from "firebase/auth";
import Seo from '../../../Components/Seo'
import SocialShare from '../../../Components/socialShare/SocialShare'

function createFightData(fruits, characters, CDN_BASE) {
    // Pick left side
    const left = getRandomCombo(CDN_BASE, fruits, characters);
    if (!left) throw new Error("Could not pick left side (check pools/filters).");

    // Pick right side with exclusions
    let right = getRandomCombo(CDN_BASE,
        fruits,
        characters,
        {
            excludeFruitIds: new Set([left.fruitId]),
            excludeCharNames: new Set([left.user])
        }
    );

    // Safety: relax constraints if pool is too tight
    if (!right) {
        // try: different character (fruit may repeat)
        const tryB = getRandomCombo(CDN_BASE,
            fruits,
            characters,
            { excludeCharNames: new Set([left.user]) }
        );
        if (tryB) {
            right = tryB;
        } else {
            // last resort: different fruit (character may repeat)
            const tryC = getRandomCombo(CDN_BASE,
                fruits,
                characters,
                { excludeFruitIds: new Set([left.fruitId]) }
            );
            right = tryC || left; // should almost never happen
        }
    }

    // Final guard to ensure uniqueness
    let attempts = 0;
    while (attempts < 5 && (right.user === left.user || right.fruitId === left.fruitId)) {
        right = getRandomCombo(CDN_BASE,
            fruits,
            characters,
            {
                excludeFruitIds: new Set([left.fruitId]),
                excludeCharNames: new Set([left.user])
            }
        ) || right;
        attempts++;
    }

    const payload = {
        left: {
            charName: left.user,
            charImg: left.userImage,       // already local from characters.js
            fruitId: left.fruitId,
            fruitName: left.fruit,
            fruitImg: left.fruitImg,       // already local from getRandomCombo
            power: left.fruitPower,
        },
        right: {
            charName: right.user,
            charImg: right.userImage,      // already local
            fruitId: right.fruitId,
            fruitName: right.fruit,
            fruitImg: right.fruitImg,      // already local
            power: right.fruitPower,
        },
    };

    return payload;
}

function getRandomCharacter(chars, excludeNames = new Set()) {
    const pool = (chars || []).filter(c => c.power >= 74 && !excludeNames.has(c.name));
    if (pool.length === 0) return null;
    const randIndex = Math.floor(Math.random() * pool.length);
    return pool[randIndex];
}

function getRandomFruit(fruits, excludeIds = new Set()) {
    const pool = (fruits || []).filter(f => !excludeIds.has(f.id));
    if (pool.length === 0) return null;
    const randIndex = Math.floor(Math.random() * pool.length);
    return pool[randIndex];
}

function getRandomCombo(CDN_BASE, fruits, chars, { excludeFruitIds = new Set(), excludeCharNames = new Set() } = {}) {
    const randFruit = getRandomFruit(fruits, excludeFruitIds);
    const randUser = getRandomCharacter(chars, excludeCharNames);

    if (!randFruit || !randUser) return null;

    return {
        user: randUser.name,
        userImage: randUser.img,                             // already local
        fruit: randFruit.name,
        fruitPower: randFruit.power,
        fruitId: randFruit.id,
        fruitImg: `${CDN_BASE}/fruits/${randFruit.id}.webp`,// local by id
        voter: ''
    };
}


export default function DailyFight() {
    const navigate = useNavigate()
    const [today, setToday] = useState(todayIdUTC);
    const [currentDate, setCurrentDate] = useState(todayIdUTC());


    const CDN_BASE = import.meta.env.VITE_CDN_BASE;

    let [allFruits, setAllFruits] = useState()
    let [voteCount, setVoteCount] = useState({ left: 0, leftPct: 0, right: 0, rightPct: 0 });
    let [userVoted, setUserVoted] = useState(false);
    let [votedSide, setVotedSide] = useState(null);
    const { canVote, showResults } = fightVotingState(currentDate, userVoted, today);

    const [isVoting, setIsVoting] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [voteReady, setVoteReady] = useState(false);
    const [error, setError] = useState('');
    const activeDate = useRef(currentDate);
    activeDate.current = currentDate;
    const voteInFlight = useRef(false);

    async function handleVote(side) {
        // Recheck the supported date range and the browser's saved choice.
        if (!fightVotingState(currentDate, userVoted).canVote) {
            setToday(todayIdUTC());
            return;
        }
        if (!isLoaded || !voteReady || userVoted || voteInFlight.current) return;
        const fightId = currentDate;
        voteInFlight.current = true;
        setIsVoting(true);
        setError('');
        let voteSaved = false;
        try {
            const savedSide = await submitFightVote(db, fightId, side);
            voteSaved = true;
            if (activeDate.current !== fightId) return;
            setUserVoted(true);
            setVotedSide(savedSide);
            const updatedFight = await loadFight(db, fightId);
            if (!updatedFight) throw new Error("This fight is not available.");
            const counts = voteCounts(updatedFight.leftVotes, updatedFight.rightVotes);
            if (activeDate.current === fightId) setVoteCount(counts);
        } catch (err) {
            console.error(err);
            if (activeDate.current === fightId) {
                setError(voteSaved
                    ? 'Your vote was saved, but results could not be refreshed. Please reload.'
                    : err.code === 'permission-denied'
                        ? 'Firebase denied this vote. The current permissions do not allow fight totals to be updated.'
                        : 'Could not save your vote. Check your connection and browser storage, then try again.');
            }
        } finally {
            voteInFlight.current = false;
            setIsVoting(false);
        }
    }

    // ---- Helpers to guarantee local images (works for both old & new fights) ----
    const charImgByName = useMemo(() => {
        const map = new Map();
        for (const c of characters) map.set(c.name, c.img);
        return map;
    }, []);

    let [leftOption, setLeftOption] = useState({
        user: '',
        userImage: '',
        fruit: '',
        fruitId: '',
        fruitPower: '',
        fruitImg: '',
        votes: ''
    })

    let [rightOption, setRightOption] = useState({
        user: '',
        userImage: '',
        fruit: '',
        fruitId: '',
        fruitPower: '',
        fruitImg: '',
        votes: ''
    })

    function goToPreviousFight() {
        const prev = new Date(currentDate);
        prev.setUTCDate(prev.getUTCDate() - 1);
        const prevDate = prev.toISOString().slice(0, 10);

        if (prevDate < DAILY_FIGHT_START_DATE) return;

        setCurrentDate(prevDate);
        setUserVoted(false);
        setVotedSide(null);
    }

    useEffect(() => {
        const refreshToday = () => setToday(todayIdUTC());
        const timer = window.setInterval(refreshToday, 30_000);
        window.addEventListener('focus', refreshToday);
        return () => {
            window.clearInterval(timer);
            window.removeEventListener('focus', refreshToday);
        };
    }, []);

    useEffect(() => {
        async function loadFruits() {
            try {
                const fruits = await fetchAllFruitsOnce();
                setAllFruits(fruits);
            } catch (e) {
                console.error(e);
            }
        }
        loadFruits();
    }, []);

    useEffect(() => {
        let cancelled = false;
        let fightLoadStarted = false;
        setUserVoted(false);
        setVotedSide(null);
        setVoteReady(false);
        setIsLoaded(false);
        setVoteCount(voteCounts(0, 0));
        setError('');
        if (!allFruits) return;

        function restoreLocalVote() {
            try {
                const side = readStoredVote(currentDate);
                setUserVoted(!!side);
                setVotedSide(side);
                setVoteReady(true);
            } catch (err) {
                console.error(err);
                setVoteReady(false);
                setError('Browser storage is unavailable. Enable it to vote.');
            }
        }
        restoreLocalVote();
        const onStorage = (event) => {
            if (event.key === voteStorageKey(currentDate) || event.key === null) restoreLocalVote();
        };
        window.addEventListener('storage', onStorage);

        // Keep the site's existing anonymous authentication. Vote history is
        // entirely local: no user vote documents are read or written.
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (cancelled || !user || fightLoadStarted) return;
            fightLoadStarted = true;
            load();
        });

        async function load() {
            try {
                const data = await loadFight(db, currentDate, currentDate === todayIdUTC()
                    ? () => createFightData(allFruits, characters, CDN_BASE) : null);
                if (cancelled) return;
                if (!data) {
                    setError('No fight is available for this date.');
                    return;
                }
                const option = (side) => {
                    const entry = data[side];
                    let charImg = charImgByName.get(entry.charName) || entry.charImg;
                    if (!charImgByName.has(entry.charName)) {
                        try {
                            const file = new URL(charImg).pathname.split('/').pop();
                            charImg = `${CDN_BASE}/nonFruitCharacters/${file}`;
                        } catch { /* Already a local image path. */ }
                    }
                    return {
                        user: entry.charName, userImage: charImg,
                        fruit: entry.fruitName, fruitId: entry.fruitId,
                        fruitImg: `${CDN_BASE}/fruits/${entry.fruitId}.webp`,
                        fruitPower: entry.power,
                    };
                };
                setLeftOption(option('left'));
                setRightOption(option('right'));
                const counts = voteCounts(data.leftVotes, data.rightVotes);
                setVoteCount(counts);
                setIsLoaded(true);
            } catch (err) {
                console.error(err);
                if (!cancelled) setError('Could not load this fight. Please reload to try again.');
            }
        }
        return () => {
            cancelled = true;
            unsubscribeAuth();
            window.removeEventListener('storage', onStorage);
        };
    }, [allFruits, currentDate, today, CDN_BASE, charImgByName]);

    return (
        <>
            <Seo
                title="Daily One Piece Matchup – Vote Your Winner in Today's 1v1 Battle!"
                description="Who wins today's One Piece 1v1 fight? Vote between two random characters and their Devil Fruits. New battles every day — join the fight and see which side wins!"
                canonical="https://onepiecedevilfruits.com/daily-fight"
            />

            <Header headerShown={false} />

            <div className="mainFull">
                <div className={styles.dailyFightWrapper}>

                    <div className={styles.titleWrapper}>
                        <h1>Daily <span className={styles.OnePieceSpan}>One Piece</span>  Matchup</h1>
                        <h4>Who wins in a 1v1?</h4>
                    </div>

                    {error && <p role="alert">{error}</p>}
                    {currentDate < today && isLoaded && <p>{canVote ? 'Current results — you can still vote.' : 'Current results:'}</p>}
                    {isVoting && <p role="status">Saving your vote...</p>}
                    <div className={styles.fightWrapper} aria-busy={!isLoaded || isVoting}>

                        {showResults && isLoaded && <div className={styles.resulWrapperOverlay}>
                            <div className={styles.LeftresultsWrapper}>
                                <div className={`${styles.LeftresultsBar} ${votedSide === "left" ? styles.votedResultsBar : votedSide === "right" ? styles.unselectedResultsBar : ""}`}>
                                    {votedSide === "left" && <span className={styles.yourVote}>Your vote</span>}
                                    <div className={styles.resultValue}>
                                        <span>{voteCount.leftPct}%</span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.RightresultsWrapper}>
                                <div className={`${styles.RightresultsBar} ${votedSide === "right" ? styles.votedResultsBar : votedSide === "left" ? styles.unselectedResultsBar : ""}`}>
                                    {votedSide === "right" && <span className={styles.yourVote}>Your vote</span>}
                                    <div className={styles.resultValue}>
                                        <span>{voteCount.rightPct}%</span>
                                    </div>
                                </div>
                            </div>                         
                        </div>}

                        <div onClick={canVote ? () => handleVote("left") : undefined} aria-disabled={!canVote} style={{ backgroundImage: `url(${leftOption.userImage})`, cursor: canVote ? 'pointer' : 'default' }} className={styles.leftOptionWrapper}>
                            <h5 className={styles.cardCaption}>
                                {leftOption.user} with the{" "}
                                <span
                                    className={styles.fruitName}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/fruit/${leftOption.fruitId}`)
                                    }}
                                >
                                    {leftOption.fruit}
                                </span>
                            </h5>
                            <FruitImage className={styles.fruitImage} fruit={{ id: leftOption.fruitId, name: leftOption.fruit }} src={leftOption.fruitImg} alt={`Image of the ${leftOption.fruit}`} />
                        </div>

                        <div className={styles.vsWrapper}>vs</div>

                        <div onClick={canVote ? () => handleVote("right") : undefined} aria-disabled={!canVote} style={{ backgroundImage: `url(${rightOption.userImage})`, cursor: canVote ? 'pointer' : 'default' }} className={styles.rightOptionWrapper}>
                            <h5 className={styles.cardCaption}>
                                {rightOption.user} with the{" "}
                                <span
                                    className={styles.fruitName}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/fruit/${rightOption.fruitId}`)
                                    }}
                                >
                                    {rightOption.fruit}
                                </span>
                            </h5>
                            <FruitImage className={styles.fruitImage} fruit={{ id: rightOption.fruitId, name: rightOption.fruit }} src={rightOption.fruitImg} alt={`Image of the ${rightOption.fruit}`} />
                        </div>

                    </div>

                    <div className={styles.extraInfo}>
                        <span>Fight of the day: <b>{currentDate}</b></span>
                        <div className={styles.navButtonWrapper}>
                            {currentDate !== today && (
                                <button
                                    onClick={() => {
                                        setUserVoted(false);
                                        setCurrentDate(today);
                                    }}
                                    className={styles.previouButton}
                                >
                                    Back to today
                                </button>
                            )}
                            {currentDate > DAILY_FIGHT_START_DATE && <button onClick={goToPreviousFight} className={styles.previouButton}>View previous fight</button>}
                        </div>                     
                    </div>
                       <SocialShare
                            title="Daily Fight"
                            text={`I’m watching ${leftOption.user} vs ${rightOption.user} in Daily Fight — who wins today?`}
                        />
                </div>
            </div>
            <Footer />
        </>
    )
}
