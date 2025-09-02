import './App.css';
import FruitCard from './Components/FruitCard.jsx'
import { useState, useEffect } from 'react'
import { listFruitsPage, getRandomFruits } from "./lib/fruitsApi";
import FruitBattle from './Components/fruitBattle/FruitBattle.jsx';

function App() {


    let [categoryDisplayed, setCategoryDisplayed] = useState('all')


    const [fruits, setFruits] = useState([]);
    const [cursor, setCursor] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    const [loading, setLoading] = useState(false);
    const [fruitIndex, setFruitIndex] = useState(2);
    const [randomFruit, setRandomFruit] = useState([]);



    useEffect(() => {
        (async () => {
            const { items, nextCursor, hasMore } = await listFruitsPage({ pageSize: 12, category: 'all' });
            setFruits(items);
            setCursor(nextCursor);
            setHasMore(hasMore);
        })();
    }, []);



    function genRandom(max) {
        return Math.floor(Math.random() * max);
    }

    async function loadRandom() {
        setLoading(true);
        const randoms = await getRandomFruits(10);
        spinRoulette(randoms);  // <-- use the list you just fetched
    }

    function spinRoulette(list) {
        if (!list?.length) { setLoading(false); return; }

        // build a “spinning” pool from that list
        const pool = Array.from({ length: 20 }, () => list[genRandom(list.length)]);
        setRandomFruit(pool);        // UI reads from randomFruit[fruitIndex]
        setFruitIndex(0);

        let i = 0;
        const interval = setInterval(() => {
            i = (i + 1) % pool.length;
            setFruitIndex(i);
        }, 200);

        setTimeout(() => {
            clearInterval(interval);
            setFruitIndex(genRandom(pool.length));
            setLoading(false);
        }, 2500);
    }


    async function resetEverything() {
        setRandomFruit([]);
        setLoading(false);
        const { items, nextCursor, hasMore } = await listFruitsPage({ pageSize: 12, category: 'all' });
        setFruits(items);
        setCursor(nextCursor);
        setHasMore(hasMore);
    }


    async function loadCategory(cat) {
        const { items, nextCursor, hasMore } = await listFruitsPage({ pageSize: 12, category: cat });
        setFruits(items);
        setCursor(nextCursor);
        setHasMore(hasMore);
    }


    useEffect(() => {
        (async () => {
            const { items, nextCursor } = await listFruitsPage({ pageSize: 12 });
            setFruits(items);
            setCursor(nextCursor);
            setHasMore(!!nextCursor);
        })();
    }, []);



    const visible = fruits;


    async function loadMore() {
        if (!cursor) return;
        const { items, nextCursor, hasMore } = await listFruitsPage({
            pageSize: 12,
            cursor,
            category: categoryDisplayed
        });
        setFruits(prev => [...prev, ...items]);
        setCursor(nextCursor);
        setHasMore(hasMore);
    }


    return (
        <>
            <header>
                <small className='headerDisclouser' id='hero-title'>Fan-made page | Opinions ahead, handle with care.</small>
            </header>

            <nav>
                <h1> Devil Fruits <br /> <span className='colorYellow'>Uncovered</span></h1>
                <small className='pageSubTitle' >Discover the powers and the USERS who wield them</small>
                <div className='navSection'>
                    <img src="https://i.ibb.co/7xzkFDts/OPDV-COM-LOGO.png" alt="Onepiecedevilfruits.com logo" />
                    <div className='menuWrapper'>
                        <span
                            className={`menuOption ${categoryDisplayed === "all" ? "isActive" : ""}`}
                            onClick={() => (setCategoryDisplayed("all"), resetEverything())}
                        >
                            All
                        </span>

                        <span
                            className={`menuOption ${categoryDisplayed === "Paramecia" ? "isActive" : ""}`}
                            onClick={() => { setCategoryDisplayed("Paramecia"); loadCategory("Paramecia"); }}
                        >
                            PARAMECIA
                        </span>

                        <span
                            className={`menuOption ${categoryDisplayed === "Logia" ? "isActive" : ""}`}
                            onClick={() => { setCategoryDisplayed("Logia"); loadCategory("Logia"); }}
                        >
                            LOGIA
                        </span>

                        <span
                            className={`menuOption ${categoryDisplayed === "Zoan" ? "isActive" : ""}`}
                            onClick={() => { setCategoryDisplayed("Zoan"); loadCategory("Zoan"); }}
                        >
                            ZOAN
                        </span>

                        <span>|</span>

                        <span
                            className={`menuOption ${categoryDisplayed === "Random" ? "isActive" : ""}`}
                            onClick={() => (setCategoryDisplayed("Random"), resetEverything())}
                        >
                            RANDOM
                        </span>

                        <span
                            className={`fruitBattleMenuItem menuOption ${categoryDisplayed === "FruitBattle" ? "isActive" : ""}`}
                            onClick={() => (setCategoryDisplayed("FruitBattle"), resetEverything())}
                        >
                            FRUIT BATTLE
                        </span>
                    </div>

                </div>
            </nav>

            {(categoryDisplayed === 'FruitBattle' || categoryDisplayed === 'Random') ||
                <main>

                    {visible.map(fruit => <FruitCard {...fruit} key={fruit.id} />)}

                </main>}

            {(categoryDisplayed === 'FruitBattle' || categoryDisplayed === 'Random') && <div className='mainFull'>

                {categoryDisplayed === 'FruitBattle' && <FruitBattle />}


                {categoryDisplayed === 'Random' &&
                    <div className='randomWrapper'>
                        <h2>What fruit would you get?</h2>
                        {randomFruit.length > 0 && randomFruit[fruitIndex] && (
                            <div className='imageWrapper'>
                                <img src={randomFruit[fruitIndex].img.fruit} alt="Random Fruit" />
                                <img src={randomFruit[fruitIndex].img.user} alt="Random User" />
                            </div>
                        )}
                        {!loading && <>
                            <div>
                                {randomFruit.length > 0 && <h2 className='randomCongrats'>{`Congratulations!`}</h2>}
                                {randomFruit.length > 0 && <h3 className='nameFruitRandom'>{`You got the ${randomFruit[fruitIndex].name}`}</h3>}
                            </div>
                            {randomFruit.length === 0 && <span>Click 'Get fruit' to find out. Good Luck!</span>}
                            {randomFruit.length > 0 && <span className='aboutFruitRandom'>{`${randomFruit[fruitIndex].about}`}</span>}
                            <button className='getFruitButton' onClick={() => loadRandom()}>{randomFruit.length < 1 ? 'Get fruit' : 'Get new fruit'}</button>
                        </>}
                    </div>}

            </div>}

            {categoryDisplayed !== 'FruitBattle' &&
                categoryDisplayed !== 'Random' &&
                hasMore && (
                    <button onClick={loadMore} className='loadButton'>load more</button>
                )}

            <footer>
                <h3>ONE PIECE DEVIL FRUITS . com</h3>
                <a href="#hero-title">back to the top</a>
            </footer>
        </>
    )
}

export default App








