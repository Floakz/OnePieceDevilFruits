import "./App.css";
import FruitCard from "./Components/FruitCard.jsx";
import { useEffect, useMemo, useState } from "react";
import { fetchAllFruitsOnce, filterByCategoryLocal, paginateLocal } from "./lib/fruitsApi";
import FruitBattle from "./Components/fruitBattle/FruitBattle.jsx";

const PAGE_SIZE = 12;

function App() {
    const [categoryDisplayed, setCategoryDisplayed] = useState("all");

    // holds the WHOLE DB (one-time fetch, cached in localStorage by fruitsApi)
    const [allFruits, setAllFruits] = useState([]);

    // local pagination cursor (index, not Firestore cursor)
    const [cursorIndex, setCursorIndex] = useState(0);
    const [hasMore, setHasMore] = useState(false);

    // Random tab state
    const [loading, setLoading] = useState(false);
    const [fruitIndex, setFruitIndex] = useState(0);
    const [randomFruit, setRandomFruit] = useState([]);

    // 1) Fetch EVERYTHING once (from cache if available)
    useEffect(() => {
        (async () => {
            const data = await fetchAllFruitsOnce();
            setAllFruits(data);
        })();
    }, []);

    // 2) Filter locally by category (Zoan includes subtypes via fruitsApi helper)
    const filtered = useMemo(
        () => filterByCategoryLocal(allFruits, categoryDisplayed),
        [allFruits, categoryDisplayed]
    );

    // 3) Local pagination (N+1 logic is internal to paginateLocal)
    const page = useMemo(
        () => paginateLocal(filtered, PAGE_SIZE, cursorIndex),
        [filtered, cursorIndex]
    );
    const visible = page.items;

    useEffect(() => setHasMore(page.hasMore), [page.hasMore]);

    // --- Tab switching ---
    function changeCategory(cat) {
        setCategoryDisplayed(cat);
        setCursorIndex(0);     // reset local pagination
        setRandomFruit([]);    // clear Random tab visuals if any
        setLoading(false);
    }

    function loadMore() {
        if (!page.hasMore) return;
        setCursorIndex(page.nextCursorIndex ?? 0);
    }

    // ---- Random tab (uses local full array) ----
    function genRandom(max) { return Math.floor(Math.random() * max); }

    async function loadRandom() {
        setLoading(true);
        const list = allFruits;
        if (!list.length) { setLoading(false); return; }

        const pool = Array.from({ length: 20 }, () => list[genRandom(list.length)]);
        setRandomFruit(pool);
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

    return (
        <>
            <header>
                <small className='headerDisclouser' id='hero-title'>
                    Fan-made page | Opinions ahead, handle with care.
                </small>
            </header>

            <nav>
                <h1> Devil Fruits <br /> <span className='colorYellow'>Uncovered</span></h1>
                <small className='pageSubTitle'>Discover the powers and the USERS who wield them</small>
                <div className='navSection'>
                    <img src='https://i.ibb.co/7xzkFDts/OPDV-COM-LOGO.png' alt='Onepiecedevilfruits.com logo' />
                    <div className='menuWrapper'>
                        <span
                            className={`menuOption ${categoryDisplayed === "all" ? "isActive" : ""}`}
                            onClick={() => changeCategory("all")}
                        >
                            All
                        </span>

                        <span
                            className={`menuOption ${categoryDisplayed === "Paramecia" ? "isActive" : ""}`}
                            onClick={() => changeCategory("Paramecia")}
                        >
                            PARAMECIA
                        </span>

                        <span
                            className={`menuOption ${categoryDisplayed === "Logia" ? "isActive" : ""}`}
                            onClick={() => changeCategory("Logia")}
                        >
                            LOGIA
                        </span>

                        <span
                            className={`menuOption ${categoryDisplayed === "Zoan" ? "isActive" : ""}`}
                            onClick={() => changeCategory("Zoan")}
                        >
                            ZOAN
                        </span>

                        <span>|</span>

                        <span
                            className={`menuOption ${categoryDisplayed === "Random" ? "isActive" : ""}`}
                            onClick={() => changeCategory("Random")}
                        >
                            RANDOM
                        </span>

                        <span
                            className={`fruitBattleMenuItem menuOption ${categoryDisplayed === "FruitBattle" ? "isActive" : ""}`}
                            onClick={() => changeCategory("FruitBattle")}
                        >
                            FRUIT BATTLE
                        </span>
                    </div>
                </div>
            </nav>

            {(categoryDisplayed === 'FruitBattle' || categoryDisplayed === 'Random') || (
                <main>
                    {visible.map(fruit => <FruitCard {...fruit} key={fruit.id} />)}
                </main>
            )}

            {(categoryDisplayed === 'FruitBattle' || categoryDisplayed === 'Random') && (
                <div className='mainFull'>

                    {categoryDisplayed === 'FruitBattle' && <FruitBattle />}

                    {categoryDisplayed === 'Random' && (
                        <div className='randomWrapper'>
                            <h2>What fruit would you get?</h2>
                            {randomFruit.length > 0 && randomFruit[fruitIndex] && (
                                <div className='imageWrapper'>
                                    <img src={randomFruit[fruitIndex].img.fruit} alt='Random Fruit' />
                                    <img src={randomFruit[fruitIndex].img.user} alt='Random User' />
                                </div>
                            )}
                            {!loading && (
                                <>
                                    <div>
                                        {randomFruit.length > 0 && <h2 className='randomCongrats'>Congratulations!</h2>}
                                        {randomFruit.length > 0 && (
                                            <h3 className='nameFruitRandom'>You got the {randomFruit[fruitIndex].name}</h3>
                                        )}
                                    </div>
                                    {randomFruit.length === 0 && <span>Click 'Get fruit' to find out. Good Luck!</span>}
                                    {randomFruit.length > 0 && (
                                        <span className='aboutFruitRandom'>{randomFruit[fruitIndex].about}</span>
                                    )}
                                    <button className='getFruitButton' onClick={loadRandom}>
                                        {randomFruit.length < 1 ? 'Get fruit' : 'Get new fruit'}
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}

            {categoryDisplayed !== 'FruitBattle' &&
                categoryDisplayed !== 'Random' &&
                hasMore && (
                    <button onClick={loadMore} className='loadButton'>load more</button>
                )}

            <footer>
                <h3>ONE PIECE DEVIL FRUITS . com</h3>
                <span className='emailFooter'>
                    Anything missing or wrong?<br /><span> info@onepiecedevilfruits.com</span>
                </span>
                <a href='#hero-title'>back to the top</a>
            </footer>
        </>
    );
}

export default App;
