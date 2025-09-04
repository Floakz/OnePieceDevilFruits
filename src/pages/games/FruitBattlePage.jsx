// pages/games/FruitBattlePage.jsx
import { useEffect, useState } from "react";
import Header from "../../Components/header/Header";
import FruitBattle from "../../Components/fruitBattle/FruitBattle"; // <-- the game component
import { fetchAllFruitsOnce } from "../../lib/fruitsApi";


// optional: small responsive gate
function useViewportWidth() {
    const [w, setW] = useState(() => window.innerWidth);
    useEffect(() => {
        const onResize = () => setW(window.innerWidth);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);
    return w;
}

export default function FruitBattlePage() {
    const [allFruits, setAllFruits] = useState([]);
    const width = useViewportWidth();

    useEffect(() => {
        (async () => setAllFruits(await fetchAllFruitsOnce()))();
    }, []);

    return (
        <>
            <Header />

            {width < 800 ? (
                <div style={{ padding: "2rem", textAlign: "center" }}>
                    <h2>Fruit Battle (desktop only for now)</h2>
                    <p>We’re working on a mobile version 👷‍♀️</p>
                    <p>Meanwhile, try the <b>Random Fruit</b> or browse fruits by category.</p>
                </div>
            ) : (
                <div className="mainFull">
                    {/* Pass the full pool to the game */}
                    <FruitBattle fruits={allFruits} />
                </div>
            )}
        </>
    );
}
