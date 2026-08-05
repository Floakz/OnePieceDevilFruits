// pages/games/CrewWars.jsx
import { useEffect, useState, useRef } from "react";
import Header from "../../Components/header/Header";
import Footer from "../../Components/footer/footer";
import Seo from "../../Components/Seo";
import styles from "./games.module.css";
import gameWarsData from "../../lib/gameWarsData";

// 1. Helper function to get a random item from an array
const getRandomItem = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};

export default function CrewWars() {

    const [gameState, setGameState] = useState(1);
    const [crewMembers, setCrewMembers] = useState({});
    const [currentOptions, setCurrentOptions] = useState({});

    // New state to track which categories are currently spinning
    const [rolling, setRolling] = useState({});

    // Use a ref to store timeouts so we can clean them up
    const timeoutRefs = useRef([]);

    const dataKeys = ['Backstory', 'Durability', 'Intelligence', 'Haki', 'DevilFruit', 'Weapon', 'Ship', 'Crew', 'Race'];

    // 2. Initialize the game
    useEffect(() => {
        const initialOptions = {};
        dataKeys.forEach(key => {
            const pool = gameWarsData[key];
            if (pool) {
                initialOptions[key] = getRandomItem(pool);
            }
        });
        setCurrentOptions(initialOptions);
    }, []);

    // 3. Handle picking a character and triggering the rotation
    const pickCharacter = (categoryKey, selectedCharacter) => {
        // Prevent clicking if this card is already rolling
        if (rolling[categoryKey]) return;

        // Add selected character to crew
        setCrewMembers(prev => ({
            ...prev,
            [categoryKey]: selectedCharacter
        }));

        // Trigger the rolling animation for ALL unselected categories
        const unselectedKeys = dataKeys.filter(key => !crewMembers[key] && key !== categoryKey);

        unselectedKeys.forEach(key => {
            startRolling(key);
        });

        // Check if all roles are filled after this pick
        const newCrew = { ...crewMembers, [categoryKey]: selectedCharacter };
        if (Object.keys(newCrew).length === dataKeys.length) {
            // Wait 5 seconds for the last rolling animation to finish, then move to state 3
            const finalTimeout = setTimeout(() => {
                setGameState(3);
            }, 800);
            timeoutRefs.current.push(finalTimeout);
        }
    };

    // 4. The Slot Machine Roll Logic
    const startRolling = (categoryKey) => {
        const pool = gameWarsData[categoryKey];
        if (!pool) return;

        setRolling(prev => ({ ...prev, [categoryKey]: true }));

        let rollCount = 0;
        const maxRolls = 4; // 4 quick changes, then stop on the 5th

        const rollInterval = setInterval(() => {
            // Show a random character
            setCurrentOptions(prev => ({
                ...prev,
                [categoryKey]: getRandomItem(pool)
            }));

            rollCount++;

            if (rollCount >= maxRolls) {
                clearInterval(rollInterval);
                // Stop on a final random character
                const finalChoice = getRandomItem(pool);
                setCurrentOptions(prev => ({
                    ...prev,
                    [categoryKey]: finalChoice
                }));
                setRolling(prev => ({ ...prev, [categoryKey]: false }));
            }
        }, 300); // Changes every 300ms
    };

    // Calculate total crew power
    const totalCrewPower = Object.values(crewMembers).reduce((sum, char) => sum + (char.power || 0), 0);

    const MAX_POSSIBLE_POWER = 900;
    let powerPercentage = (totalCrewPower / MAX_POSSIBLE_POWER) * 100;
    if (powerPercentage > 100) powerPercentage = 100;
    if (powerPercentage < 0) powerPercentage = 0;

    function getCrewRank(power) {
        if (power >= 840) return "RULERS OF THE WORLD";
        if (power >= 790) return "PIRATE KING";
        if (power >= 750) return "YONKO CREW";
        if (power >= 600) return "WARLORD AFFILIATED";
        if (power >= 450) return "SUPER NOVA'S";
        if (power >= 300) return "GRAND LINE";
        if (power >= 170) return "PIRATE CREW";
        return "GANG";
    }

    const POWER_CAP = 900;

    const ranks = [
        { label: "RULERS OF THE WORLD", power: 840 },
        { label: "PIRATE KING", power: 790 },
        { label: "YONKO CREW", power: 750 },
        { label: "WARLORD AFFILIATED", power: 600 },
        { label: "SUPER NOVA'S", power: 400 },
        { label: "GRAND LINE", power: 300 },
        { label: "PIRATE CREW", power: 170 },
        { label: "GANG", power: 0 },
    ];

    // Cleanup timeouts on unmount
    useEffect(() => {
        return () => {
            timeoutRefs.current.forEach(t => clearTimeout(t));
        };
    }, []);

    return (
        <>
            <Seo
                title="CrewWars – Build Your Crew & Fight!"
                description="Choose your crew and try to dominate the world."
                canonical="https://onepiecedevilfruits.com/fruit-battle"
                image="https://onepiecedevilfruits.com/assets/fruit-battle-preview.jpg"
            />

            <Header headerShown={false} />

            <div className="mainFull">
                <div className={`${styles.grandRunWrapper} ${gameState === 1 ? styles.withBackground : ''}`}>

                    {gameState === 1 && (
                        <div className={styles.crewWarsIntro}>
                            <h1 className={styles.crewWarsTitle}>Crew<br /><span style={{ color: 'rgb(255, 231, 48)' }}>Wars</span></h1>
                            <p>Try to rule this world.</p>
                            <button className="getFruitButton" onClick={() => setGameState(2)}>Get Crew</button>
                        </div>
                    )}

                    {gameState === 2 && (
                        <div className={styles.crewWarsGameWrapper}>

                            <div className={styles.verticalTitleText}>
                                <h2>PICK YOUR CREW</h2>
                            </div>

                            {/* The Grid */}
                            <div className={styles.cardGrid}>
                                {dataKeys.map((key) => {
                                    const finalChar = crewMembers[key];
                                    const tempChar = currentOptions[key];

                                    const itemData = finalChar || tempChar;
                                    const label = key;

                                    const isPicked = !!finalChar;
                                    const power = itemData?.power || 0;

                                    return (
                                        <div
                                            key={key}
                                            className={`${styles.cardItem} ${isPicked ? styles.pickedCard : ''}`}
                                            onClick={() => !isPicked && pickCharacter(key, itemData)}
                                        >
                                            <div
                                                style={{
                                                    border: `1px solid ${isPicked ? getColorByPower(power) : "#061b5c"}`,
                                                    boxShadow: isPicked ? `0 0 45px ${getColorByPower(power)}` : "none",
                                                }}
                                                className={`${styles.cardImageWrapper}`}
                                            >

                                                {!isPicked && <div className={styles.pickOverlay}></div>}
                                                <p className={styles.itemLabel}>
                                                    {itemData?.name}
                                                </p>
                                                <img src={itemData?.img} alt={itemData?.name || label} />

                                            </div>

                                            <p className={styles.cardLabel}>
                                                {label}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Score Bar / Total Power */}
                            <div className={styles.scoreBarContainer}>
                                {/* The Bar Itself */}
                                <div className={styles.powerBarTrack}>
                                    <div
                                        className={styles.powerBarFill}
                                        style={{ "--fill-percent": powerPercentage }}
                                    ></div>
                                </div>

                                {/* The Labels on the Right */}
                                <div className={styles.powerLabels}>
                                    {ranks.map(rank => (
                                        <span
                                            key={rank.label}
                                            style={{
                                                bottom: `${(rank.power / POWER_CAP) * 100}%`
                                            }}
                                        >
                                            {rank.label}
                                        </span>
                                    ))}
                                </div>



                            </div>




                        </div>
                    )}

                    {/* State 3 display (Triggered when crew is full) */}
                    {gameState === 3 && (
                        <div className={styles.crewWarsEndScreen}>
                            <h2 className={styles.crewWarsFinalTittleSmall}>Crew Complete!</h2>
                            <div>
                                <h1 className={styles.crewWarsFinalTittleBig}> {getCrewRank(totalCrewPower)}</h1>
                                <p className={styles.crewWarsFinalpowerLevel}>Your total power is {totalCrewPower}</p>
                            </div>
                            <button className="getFruitButton" onClick={() => window.location.reload()}>Restart</button>
                        </div>
                    )}

                </div>
            </div>

            <Footer />
        </>
    );
}

// 6. Helper function to map power (0-99) to your gradient colors
function getColorByPower(level) {
    if (level >= 92) return '#ffe600'; // Purple
    if (level >= 70) return '#ff4d00'; // Yellow
    if (level >= 40) return '#00bfff'; // Light Green
    if (level >= 20) return '#263d6f'; // Bright Cyan
    return '#e0eaea'; // Light Blue
}