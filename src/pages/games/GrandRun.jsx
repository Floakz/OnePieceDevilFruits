// pages/games/FruitBattlePage.jsx
import { useEffect, useState, useRef } from "react";
import Header from "../../Components/header/Header";
import { fetchAllFruitsOnce } from "../../lib/fruitsApi";
import Footer from "../../Components/footer/footer";
import Seo from "../../Components/Seo";
import styles from './games.module.css'
import characters from "../../lib/characters";

export default function GrandRun() {
    const [allFruits, setAllFruits] = useState([]);

    const [crew, setCrew] = useState([{ used: false }, { used: false }, { used: false }, { used: false }, { used: false }, { used: false },]);
    const [fruitDrafted, setFruitDrafted] = useState();
    const [gameStep, setGameStep] = useState(1);
    const [resultMessage, setResultMessage] = useState();
    const [discardedFruits, setDiscardedFruits] = useState(0);
    const intervalRef = useRef(null);

    const bountyTiers = [
        { min: 0, max: 300, ranking: 10, label: "Sailor", bounty: "5,000", message: 'Barely covers Garp’s coffee' },
        { min: 301, max: 420, ranking: 9, label: "Bounty Hunter", bounty: "50,000", message: 'Grandma is impressed, Marines not so much' },
        { min: 421, max: 500, ranking: 8, label: "Pirate", bounty: "250,000", message: 'Famous for breaking bar stools' },
        { min: 501, max: 545, ranking: 7, label: "Rising Star", bounty: "1,000,000", message: 'Tiny headline in the morning paper' },
        { min: 546, max: 618, ranking: 6, label: "New Generation", bounty: "20,000,000", message: 'Marines start to sweat' },
        { min: 619, max: 711, ranking: 5, label: "Supernova", bounty: "100,000,000", message: 'Cipher Pol puts you on the “keep an eye” list' },
        { min: 712, max: 804, ranking: 4, label: "Warlord", bounty: "250,000,000", message: 'They tried to recruit you but you’re too chaotic' },
        { min: 805, max: 897, ranking: 3, label: "Local Emperor", bounty: "500,000,000", message: 'Half an ocean bends the knee' },
        { min: 898, max: 930, ranking: 2, label: "Yonkou", bounty: "1,500,000,000", message: 'World Government pretends not to panic' },
        { min: 931, max: 1284, ranking: 1, label: "Pirate King", bounty: "5,000,000,000", message: 'Wanted dead or alive, preferably alive for the photo' }
    ];

    useEffect(() => {
        (async () => setAllFruits(await fetchAllFruitsOnce()))();
        getRandomCrew()
        setGameStep(1)
        setDiscardedFruits(0)
    }, []);

    useEffect(() => {
        return () => clearInterval(intervalRef.current);
    }, []);

    useEffect(() => {
        if (crew.every(member => member.used)) {
            if (crew.every(member => member.fruit)) { getPowerLevel(); return setGameStep(3) }
            getRandomFruit()
            setGameStep(2);
        }
    }, [crew]);

    function rollFruit(times = 3, delay = 100) {
        let count = 0;
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            getRandomFruit();
            count++;
            if (count >= times) clearInterval(intervalRef.current);
        }, delay);
    }


    function getRandomFruit() {
        const randNum = Math.floor(Math.random() * allFruits.length)
        setFruitDrafted(allFruits[randNum])
    }

    function newGame() {
        setCrew([{ used: false }, { used: false }, { used: false }, { used: false }, { used: false }, { used: false },])
        getRandomCrew()
        setResultMessage('')
        setGameStep(1);
        setDiscardedFruits(0)
    }

    function getPowerLevel() {
        const totalPower = crew.reduce((sum, user) => {
            const memberPower = user?.power || 0;
            const fruitPower = user?.fruit?.power || 0;
            return sum + memberPower + fruitPower;
        }, 0);

        const finalMessage = bountyTiers.find(
            t => totalPower >= t.min && totalPower <= t.max
        );

        setResultMessage(finalMessage)
    }

    function getRandomCrew() {

        setCrew(prevCrew => {

            const drawOne = () => {
                if (!characters.length) return null;
                const i = Math.floor(Math.random() * characters.length);
                return characters[i];
            };


            const nextCrew = prevCrew.map(slot => {
                if (slot.used) return slot
                const pick = drawOne();
                return pick ? { ...pick, used: false, fruit: null } : slot;
            });

            return nextCrew;
        });
    }

    function discardFruit() {
        setDiscardedFruits(1)
        rollFruit()
    }

    function addFruit(crewmate, idx) {
        setCrew(prevCrew => {
            const nextCrew = prevCrew.map((member, oidx) => {
                if (oidx === idx) { return { ...crewmate, used: true, fruit: fruitDrafted } }
                return member
            });
            return nextCrew;
        })
        rollFruit()
    }


    function rollCrew(times = 3, delay = 150) {
        let count = 0;
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            getRandomCrew();
            count++;
            if (count >= times) clearInterval(intervalRef.current);
        }, delay);
    }

    function addMemberToCrew(crewmate, idx) {
        setCrew(prevCrew => {
            const nextCrew = prevCrew.map((member, oidx) => {
                if (oidx === idx) { return { ...crewmate, used: true, fruit: null } }
                return member
            });
            return nextCrew;
        })
        rollCrew()
    }

    return (
        <>

            <Seo
                title="Grand Run – Build Your Crew and Race to become Pirate King!"
                description="Assemble your dream crew, collect Devil Fruits and sail the Grand Line in Grand Run. See how far you can go on the quest to become Pirate King!"
                canonical="https://onepiecedevilfruits.com/grand-run"
            />



            <Header headerShown={false} />
            <div className="mainFull">

                <div className={styles.grandRunWrapper}>

                    <div className={styles.crewWrapper}>
                        {crew.map((crewmate, idx) =>
                            <div key={idx} onClick={gameStep === 1 && !crewmate.used ? () => addMemberToCrew(crewmate, idx) : undefined} className={`${crewmate.used ? styles.activeMember : styles.emptyCard} ${styles.crewCard}`} style={{ backgroundImage: `url('${crewmate.img}') ` }}>
                                {gameStep === 1 && <span>{crewmate.name}</span>}
                                {gameStep !== 1 ? crewmate.fruit ? <div className={styles.fruitBoxWrapper} style={{ backgroundImage: `url('${crewmate.fruit.img.fruit}')` }}></div> : <div onClick={!crewmate.fruit ? () => addFruit(crewmate, idx) : undefined} className={`${styles.fruitBoxWrapper} ${styles.fruitBoxHover}`}></div> : null}
                            </div>
                        )}
                    </div>

                    {gameStep === 2 &&
                        <div className={styles.fruitSelectorWrapper}>
                            <div>
                                <span>NEW FRUIT</span>
                                <h3 className={styles.fruitTitleName}>{fruitDrafted.name}</h3>
                                <p className={styles.runAboutFruit}>{fruitDrafted.about}</p>
                            </div>
                            <div className={styles.optionFruitWrapper}>
                                {fruitDrafted?.img?.fruit && (
                                    <img src={fruitDrafted.img.fruit} alt="image of a devil fruit" />
                                )}
                                <div>
                                    {fruitDrafted?.img?.user && (
                                        <img src={fruitDrafted.img.user} alt="image of a devil fruit user" />
                                    )}

                                    <p>previous user</p>
                                </div>
                            </div>
                            <span className={styles.mediumNote}>(click on the crewmate you want to assign this fruit to)</span>

                            <span
                                onClick={() => {
                                    if (discardedFruits < 1 && fruitDrafted) discardFruit();
                                }}
                                className={discardedFruits >= 1 ? styles.discardButtonDisabled : styles.discardButton}
                            >
                                {`Discard fruit ${discardedFruits}/1`}
                            </span>                        </div>}


                    {gameStep === 1 &&
                        <div className={styles.tutorialWerapper}>

                            <span>Step  1:</span>
                            <h2>GET A CREW</h2>
                            <span>click on the members you want for your crew</span>
                        </div>}


                    {gameStep === 3 &&


                        <div className={styles.resultHeader}>
                            <span>CREW RANKING:</span>
                            <h3>#{resultMessage.ranking}</h3>
                            <h3>{resultMessage.label}</h3>
                            <span>{`Bounty ${resultMessage.bounty} berries`}</span>
                            <span>{resultMessage.message}</span>

                            <button onClick={() => newGame()} className={styles.runTryAgainButton}>try again</button>
                        </div>



                    }

                </div>
            </div >
            <Footer />
        </>
    );
}
