import './App.css';
import FruitCard from './Components/FruitCard.jsx'
import { useState, useEffect } from 'react'
import { listFruits } from "./lib/fruitsApi";

function App() {

    let [categoryDisplayed, setCategoryDisplayed] = useState('all')

    let [fruitsShown, setFruitsShown] = useState(6)
    let [loading, setLoading] = useState(false)
    let [fruitIndex, setFruitIndex] = useState(2)

    const [fruits, setFruits] = useState([]);

    let [randomFruit, setRandomFruit] = useState([])

    function genRandom(max) {
        return Math.floor(Math.random() * max);
    }

    function getRandFruit() {
        if (!fruits.length) return;

        setLoading(true);

        const pool = Array.from({ length: 20 }, () => fruits[genRandom(fruits.length)]);
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

    function resetEverything() {
        setFruitsShown(6)
        setRandomFruit([])
        setLoading(false)
    }



    useEffect(() => {
        listFruits().then(setFruits);
    }, []);


    const filtered = fruits.filter(fruit =>
        categoryDisplayed === "all" ||
        (categoryDisplayed === "Zoan"
            ? fruit.type.includes("Zoan")
            : fruit.type === categoryDisplayed)
    );


    const visible = filtered.slice(0, fruitsShown);

    const hasMore = visible.length < filtered.length;

    function loadMore() {
        setFruitsShown(v => Math.min(v + 6, filtered.length));
    }

    return (
        <>
            <header>
                <h1 className='title-page' id='hero-title'>List of Devil Fruits<br /> & it's Users</h1>
            </header>
            <div className='menuWrapper'>
                <button onClick={() => (setCategoryDisplayed('all'), resetEverything())} style={{ backgroundColor: categoryDisplayed === "all" ? "#041822ff" : "#205879" }}>all</button>
                <button onClick={() => (setCategoryDisplayed('Logia'), resetEverything())} style={{ backgroundColor: categoryDisplayed === "Logia" ? "#041822ff" : "#205879" }}>Logia</button>
                <button onClick={() => (setCategoryDisplayed('Zoan'), resetEverything())} style={{ backgroundColor: categoryDisplayed === "Zoan" ? "#041822ff" : "#205879" }}>Zoan</button>
                <button onClick={() => (setCategoryDisplayed('Paramecia'), resetEverything())} style={{ backgroundColor: categoryDisplayed === "Paramecia" ? "#041822ff" : "#205879" }} >Paramecia</button>
                <button onClick={() => (setCategoryDisplayed('Random'), resetEverything())} style={{ backgroundColor: categoryDisplayed === "Random" ? "#041822ff" : "#205879" }} >Random</button>
            </div>
            <main>
                {visible.map(fruit => <FruitCard {...fruit} key={fruit.id} />)}
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
                            {randomFruit.length > 0 && <h2>{`Congratulations!`}</h2>}
                            {randomFruit.length > 0 && <h3>{`You got the ${randomFruit[fruitIndex].name}`}</h3>}
                            {randomFruit.length === 0 && <span>Click 'Get fruit' to find out. Good Luck!</span>}
                            {randomFruit.length > 0 && <span>{`${randomFruit[fruitIndex].about}`}</span>}
                            <button onClick={() => getRandFruit()}>{randomFruit.length < 1 ? 'Get fruit' : 'Get new fruit'}</button>
                        </>}
                    </div>}
            </main>

            {hasMore && (
                <button onClick={loadMore} className='load-button'>load more</button>
            )}
            <footer>
                <img id='footer-logo-img' src="https://i.postimg.cc/y65WWj1g/FRUIT-1.png" alt="logo" />
                <a href="#hero-title">back to the top</a>
            </footer>
        </>
    )
}

export default App
