// pages/games/RandomFruitPage.jsx
import { useEffect, useState } from "react";
import Header from "../../Components/header/Header";
import { fetchAllFruitsOnce } from "../../lib/fruitsApi";
import Footer from "../../Components/footer/footer";
import Seo from '../../Components/Seo'


function genRandom(max) { return Math.floor(Math.random() * max); }

export default function RandomFruitPage() {
    const [allFruits, setAllFruits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fruitIndex, setFruitIndex] = useState(0);
    const [pool, setPool] = useState([]);

    useEffect(() => {
        (async () => setAllFruits(await fetchAllFruitsOnce()))();
    }, []);

    async function loadRandom() {
        setLoading(true);
        if (!allFruits.length) { setLoading(false); return; }

        const p = Array.from({ length: 20 }, () => allFruits[genRandom(allFruits.length)]);
        setPool(p);
        setFruitIndex(0);

        let i = 0;
        const interval = setInterval(() => {
            i = (i + 1) % p.length;
            setFruitIndex(i);
        }, 200);

        setTimeout(() => {
            clearInterval(interval);
            setFruitIndex(genRandom(p.length));
            setLoading(false);
        }, 2500);
    }

    const current = pool[fruitIndex];

    return (
        <>
            <Seo
                title="Random Devil Fruit Generator – Which Fruit Will You Get?"
                description="Click to discover your random Devil Fruit! Instantly reveal one of the mysterious One Piece Devil Fruits with user, ability and image."
                canonical="https://onepiecedevilfruits.com/random-fruit"
                image="https://onepiecedevilfruits.com/assets/random-fruit-preview.jpg"
            />

            <Header />
            <div className="mainFull randomWrapper">
                <h2>What fruit would you get?</h2>

                {current && (
                    <div className="imageWrapper">
                        <img src={current.img.fruit} alt="Random Fruit" />
                        <img src={current.img.user} alt="Random User" />
                    </div>
                )}

                {!loading && (
                    <>
                        <div>
                            {current && <h2 className="randomCongrats">Congratulations!</h2>}
                            {current && <h3 className="nameFruitRandom">You got the {current.name}</h3>}
                        </div>
                        {!current && <span>Click 'Get fruit' to find out. Good Luck!</span>}
                        {current && <span className="aboutFruitRandom">{current.about}</span>}

                        <button className="getFruitButton" onClick={loadRandom}>
                            {!current ? "Get fruit" : "Get new fruit"}
                        </button>
                    </>
                )}
            </div>
            <Footer />
        </>
    );
}
