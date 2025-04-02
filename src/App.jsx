
import './App.css';
import allFruits from './devilfruits.js';
import FruitCard from './Components/FruitCard.jsx'
import { useState } from 'react'


function App() {


    let [fruitsShown, setFruitsShown] = useState(6)


    const fruitsDisplayed = allFruits
        .filter((_, index) => index < fruitsShown)
        .map((fruit) => {
            return (<FruitCard {...fruit} key={fruit.id} />)
        })

    function loadMore() {
        setFruitsShown(currentValue => currentValue + 3)
    }

    return (
        <>
            <header>
                <h1 className='title-page' id='hero-title'>List of Devil Fruits<br /> & it's Users</h1>
                <p>This is a temporary repository containing a list of <strong>One Piece fruits and their users</strong>. Updates will be made soon.</p>
                <small>Information mostly collected from <a href='https://onepiece.fandom.com/' target="_blank">onepiece.fandom.com</a></small>
            </header>
            <main>
                {fruitsDisplayed}
            </main>
            <button onClick={loadMore} className='load-button'>load more</button>
            <footer>
                <img id='footer-logo-img' src="https://i.postimg.cc/y65WWj1g/FRUIT-1.png" alt="logo" />
                <a href="#hero-title">back to the top</a>
            </footer>
        </>
    )
}

export default App
