import styles from './dailyFight.module.css'
import Header from '../../../Components/header/Header'
import Footer from '../../../Components/footer/footer'
import { fetchAllFruitsOnce } from '../../../lib/fruitsApi'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import characters from '../../../lib/characters'
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp, collection } from "firebase/firestore";
import { db, auth } from '../../../lib/firebase'
import { onAuthStateChanged } from "firebase/auth";
import Seo from '../../../Components/Seo'

export default function DailyFight() {
    const navigate = useNavigate()
    const START_DATE = "2025-10-11";
    const today = todayIdUTC()
    const [currentDate, setCurrentDate] = useState(todayIdUTC());

    let [allFruits, setAllFruits] = useState()
    let [voteCount, setVoteCount] = useState({ left: 0, leftPct: 0, right: 0, rightPct: 0 });
    let [userVoted, setUserVoted] = useState(false);

    function todayIdUTC() {
        return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
    }

    const fruitImgLocation = '/images/fruits';
    const characterImgLocation = '/images/nonFruitCharacters'; // NOTE: matches your characters.js imgLocation

    // ---- Helpers to guarantee local images (works for both old & new fights) ----
    const charImgByName = useMemo(() => {
        const map = new Map();
        for (const c of characters) map.set(c.name, c.img);
        return map;
    }, []);

    const fileFromUrl = (url) => {
        try { return new URL(url).pathname.split('/').pop(); } catch { return null; }
    };

    const forceLocalCharImg = (charName, fallbackMaybeExternal) => {
        // 1) Prefer the source of truth from your characters list (already local)
        const localFromList = charImgByName.get(charName);
        if (localFromList) return localFromList;

        // 2) If we only have an external URL (older docs), rebuild as local using the filename
        const f = fileFromUrl(fallbackMaybeExternal);
        return f ? `${characterImgLocation}/${f}` : fallbackMaybeExternal;
    };

    const forceLocalFruitImg = (fruitId) => `${fruitImgLocation}/${fruitId}.webp`;
    // ---------------------------------------------------------------------------

    async function createTodayFightIfMissing(fruits, characters) {
        const id = todayIdUTC();
        const ref = doc(db, "fights", id);

        const snap = await getDoc(ref);
        if (snap.exists()) {
            // already created earlier today
            return snap.data();
        }

        // Pick left side
        const left = getRandomCombo(fruits, characters);
        if (!left) throw new Error("Could not pick left side (check pools/filters).");

        // Pick right side with exclusions
        let right = getRandomCombo(
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
            const tryB = getRandomCombo(
                fruits,
                characters,
                { excludeCharNames: new Set([left.user]) }
            );
            if (tryB) {
                right = tryB;
            } else {
                // last resort: different fruit (character may repeat)
                const tryC = getRandomCombo(
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
            right = getRandomCombo(
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
            date: id,
            createdAt: serverTimestamp(),
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

        await setDoc(ref, payload); // creates the doc
        return payload;
    }

    function listenVoteCounts(fightId, setCounts) {
        const votesCol = collection(db, "fights", fightId, "votes");
        return onSnapshot(votesCol, (snap) => {
            let left = 0, right = 0;
            snap.forEach(d => {
                const side = d.data().side;
                if (side === "left") left++;
                if (side === "right") right++;
            });

            const total = left + right;
            const leftPct = total > 0 ? Math.round((left / total) * 100) : 0;
            const rightPct = total > 0 ? Math.round((right / total) * 100) : 0;

            setCounts({
                left,
                right,
                leftPct,
                rightPct
            });
        });
    }

    async function handleVote(side) {
        const fightId = currentDate;
        const userId = auth.currentUser?.uid;
        if (!userId) return console.warn("User not signed in yet.");

        const voteRef = doc(db, "fights", fightId, "votes", userId);
        const existing = await getDoc(voteRef);
        if (existing.exists()) {
            console.log("You already voted today!");
            return;
        }

        await setDoc(voteRef, {
            side,
            createdAt: serverTimestamp(),
        });

        setUserVoted(true)
        localStorage.setItem(`voted-${fightId}`, side);
    }

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

        if (prevDate < START_DATE) return;

        if (prevDate < START_DATE) {
            console.log("No older fights available.");
            return;
        }

        setCurrentDate(prevDate);
        setUserVoted(false);
    }

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
        if (!allFruits) return;

        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            if (!user) { setUserVoted(false); return; }

            const voteRef = doc(db, "fights", currentDate, "votes", user.uid);
            const existing = await getDoc(voteRef);

            setUserVoted(!!existing.exists());
        });

        const ref = doc(db, "fights", currentDate);
        const unsubFight = onSnapshot(ref, (snap) => {
            if (!snap.exists()) return;
            const data = snap.data();

            // Force local images regardless of what old docs contain
            const leftCharImg = forceLocalCharImg(data.left.charName, data.left.charImg);
            const rightCharImg = forceLocalCharImg(data.right.charName, data.right.charImg);

            const leftFruitImg = forceLocalFruitImg(data.left.fruitId);   // <-- use fruitId
            const rightFruitImg = forceLocalFruitImg(data.right.fruitId); // <-- use fruitId

            setLeftOption({
                user: data.left.charName,
                userImage: leftCharImg,
                fruit: data.left.fruitName,
                fruitId: data.left.fruitId,
                fruitImg: leftFruitImg,
                fruitPower: data.left.power,
            });

            setRightOption({
                user: data.right.charName,
                userImage: rightCharImg,
                fruit: data.right.fruitName,
                fruitId: data.right.fruitId,
                fruitImg: rightFruitImg,
                fruitPower: data.right.power,
            });
        });

        // Only create if currentDate === today
        if (currentDate === todayIdUTC()) {
            createTodayFightIfMissing(allFruits, characters).catch(console.error);
        }

        const stopVotes = listenVoteCounts(currentDate, setVoteCount);

        return () => {
            unsubFight();
            unsubscribeAuth();
            stopVotes && stopVotes();
        };
    }, [allFruits, currentDate]);

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

    function getRandomCombo(fruits, chars, { excludeFruitIds = new Set(), excludeCharNames = new Set() } = {}) {
        const randFruit = getRandomFruit(fruits, excludeFruitIds);
        const randUser = getRandomCharacter(chars, excludeCharNames);

        if (!randFruit || !randUser) return null;

        return {
            user: randUser.name,
            userImage: randUser.img,                             // already local
            fruit: randFruit.name,
            fruitPower: randFruit.power,
            fruitId: randFruit.id,
            fruitImg: `${fruitImgLocation}/${randFruit.id}.webp`,// local by id
            voter: ''
        };
    }

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

                    <div className={styles.fightWrapper}>

                        {userVoted && <div className={styles.resulWrapperOverlay}>
                            <div className={styles.LeftresultsWrapper}>
                                <div className={styles.LeftresultsBar}>
                                    {voteCount.leftPct}%
                                </div>
                            </div>
                            <div className={styles.RightresultsWrapper}>
                                <div className={styles.RightresultsBar}>
                                    {voteCount.rightPct}%
                                </div>
                            </div>
                        </div>}

                        <div onClick={() => handleVote("left")} style={{ backgroundImage: `url(${leftOption.userImage})` }} className={styles.leftOptionWrapper}>
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
                            <img className={styles.fruitImage} src={leftOption.fruitImg || '/images/fruits/unkown-fruit.webp'} alt={`Image of the ${leftOption.fruit}`} />
                        </div>

                        <div className={styles.vsWrapper}>vs</div>

                        <div onClick={() => handleVote("right")} style={{ backgroundImage: `url(${rightOption.userImage})` }} className={styles.rightOptionWrapper}>
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
                            <img className={styles.fruitImage} src={rightOption.fruitImg || '/images/fruits/unkown-fruit.webp'} alt={`Image of the ${rightOption.fruit}`} />
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
                                    Vote on today
                                </button>
                            )}
                            {currentDate !== "2025-10-11" && <button onClick={goToPreviousFight} className={styles.previouButton}>Vote on previous fight</button>}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
