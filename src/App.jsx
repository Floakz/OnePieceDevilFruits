import './App.css';
import FruitCard from './Components/FruitCard.jsx'
import { useState, useEffect } from 'react'
import { listFruits } from "./lib/fruitsApi";

function App() {

    let [categoryDisplayed, setCategoryDisplayed] = useState('all')

    let [fruitsShown, setFruitsShown] = useState(6)

    const [fruits, setFruits] = useState([]);

    useEffect(() => {
        listFruits().then(setFruits);
    }, []);


    function changeCategory() {

    }


    const fruitsDisplayed = fruits
        .filter(fruit => categoryDisplayed === "all" || fruit.type === categoryDisplayed || (categoryDisplayed === 'Zoan' ? fruit.type.includes("Zoan") : null))
        .slice(0, fruitsShown)
        .map(fruit => <FruitCard {...fruit} key={fruit.id} />);

    function loadMore() {
        setFruitsShown(currentValue => currentValue + 6)
    }

    return (
        <>
            <header>
                <h1 className='title-page' id='hero-title'>List of Devil Fruits<br /> & it's Users</h1>
            </header>
            <div className='menuWrapper'>
                <button onClick={() => (setCategoryDisplayed('all'), setFruitsShown(6))} style={{ backgroundColor: categoryDisplayed === "all" ? "#041822ff" : "#205879" }}>all</button>
                <button onClick={() => (setCategoryDisplayed('Logia'), setFruitsShown(6))} style={{ backgroundColor: categoryDisplayed === "Logia" ? "#041822ff" : "#205879" }}>Logia</button>
                <button onClick={() => (setCategoryDisplayed('Zoan'), setFruitsShown(6))} style={{ backgroundColor: categoryDisplayed === "Zoan" ? "#041822ff" : "#205879" }}>Zoan</button>
                <button onClick={() => (setCategoryDisplayed('Paramecia'), setFruitsShown(6))} style={{ backgroundColor: categoryDisplayed === "Paramecia" ? "#041822ff" : "#205879" }} >Paremecia</button>
            </div>
            <main>
                {fruitsDisplayed}
            </main>
            {fruitsShown > fruitsDisplayed.length ? null : <button onClick={loadMore} className='load-button'>load more</button>}
            <footer>
                <img id='footer-logo-img' src="https://i.postimg.cc/y65WWj1g/FRUIT-1.png" alt="logo" />
                <a href="#hero-title">back to the top</a>
            </footer>
        </>
    )
}

export default App
