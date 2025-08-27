import './App.css';
import FruitCard from './Components/FruitCard.jsx'
import { useState, useEffect } from 'react'
import { listFruits } from "./lib/fruitsApi";

function App() {

    let [categoryDisplayed, setCategoryDisplayed] = useState('all')

    let [fruitsShown, setFruitsShown] = useState(6)

    const [fruits, setFruits] = useState([]);

    let [randomFruit, setRandomFruit] = useState([])

    function getRandFruit() {
        for (let i = 0; i < 10; i++) {
            setRandomFruit(prev => [...prev, fruits[genRandom()]])
        }
    }

    function genRandom() {
        const ranNum = Math.floor(Math.random() * fruits.length)
        return ranNum
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
                <button onClick={() => (setCategoryDisplayed('all'), setFruitsShown(6), setRandomFruit([]))} style={{ backgroundColor: categoryDisplayed === "all" ? "#041822ff" : "#205879" }}>all</button>
                <button onClick={() => (setCategoryDisplayed('Logia'), setFruitsShown(6), setRandomFruit([]))} style={{ backgroundColor: categoryDisplayed === "Logia" ? "#041822ff" : "#205879" }}>Logia</button>
                <button onClick={() => (setCategoryDisplayed('Zoan'), setFruitsShown(6), setRandomFruit([]))} style={{ backgroundColor: categoryDisplayed === "Zoan" ? "#041822ff" : "#205879" }}>Zoan</button>
                <button onClick={() => (setCategoryDisplayed('Paramecia'), setFruitsShown(6), setRandomFruit([]))} style={{ backgroundColor: categoryDisplayed === "Paramecia" ? "#041822ff" : "#205879" }} >Paramecia</button>
                <button onClick={() => (setCategoryDisplayed('Random'), setFruitsShown(6))} style={{ backgroundColor: categoryDisplayed === "Random" ? "#041822ff" : "#205879" }} >Random</button>
            </div>
            <main>
                {visible.map(fruit => <FruitCard {...fruit} key={fruit.id} />)}
                {categoryDisplayed === 'Random' &&
                    <div className='randomWrapper'>
                        <h2>What fruit would you get?</h2>
                        {randomFruit.length > 0 && <div className='imageWrapper'>
                            <img src={randomFruit[randomFruit.length - 1].img.fruit} alt="Random Fruit Image" />
                            <img src={randomFruit[randomFruit.length - 1].img.user} alt="Random Fruit Image" />
                        </div>}
                        {randomFruit.length > 0 && <h2>{`Congratulations!`}</h2>}
                        {randomFruit.length > 0 && <h3>{`You got the ${randomFruit[randomFruit.length - 1].name}`}</h3>}
                        {randomFruit.length === 0 && <span>Click 'Get fruit' to find out. Good Luck!</span>}
                        {randomFruit.length > 0 && <span>{`${randomFruit[randomFruit.length - 1].about}`}</span>}
                        <button onClick={() => getRandFruit()}>{randomFruit.length < 1 ? 'Get fruit' : 'Get new fruit'}</button>
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
