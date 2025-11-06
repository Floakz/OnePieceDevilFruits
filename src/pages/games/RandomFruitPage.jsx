// pages/games/RandomFruitPage.jsx
import { useEffect, useState } from "react";
import Header from "../../Components/header/Header";
import { fetchAllFruitsOnce } from "../../lib/fruitsApi";
import Footer from "../../Components/footer/footer";
import Seo from '../../Components/Seo'
import styles from './games.module.css'

function genRandom(max) { return Math.floor(Math.random() * max); }

export default function RandomFruitPage() {
    const [allFruits, setAllFruits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fruitIndex, setFruitIndex] = useState(0);
    const [pool, setPool] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [isStarted, setIsStarted] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const fruitImgLocation = '/images/fruits';

    useEffect(() => {
        (async () => setAllFruits(await fetchAllFruitsOnce()))();
    }, []);

    // A/0 = LOGIA, B/1 = PARAMECIA, C/2 = ZOAN

    const quizzQuestions = [
        {
            question: 'On a long journey you can pack only one kind of comfort. Which feels most “you”?',
            answers: ['Something that lets you stay free no matter where you go', 'A clever gadget that does unexpected tricks', 'A sturdy tool that keeps you safe in tough places']
        },
        {
            question: 'When things get messy, what’s your go-to move?',
            answers: ['Keep moving and control the situation from a distance', 'Turn the chaos into a game and outsmart everyone', 'Stand firm and power through']
        },
        {
            question: 'Pick the scenery that makes you feel most alive.',
            answers: ['Endless horizons—sky, sea, wide open spaces', 'Crowded streets buzzing with surprises', 'Wild forests, mountains or hidden caves']
        },
        {
            question: 'Your friends describe you as…',
            answers: ['Unstoppable and hard to pin down', 'Unpredictable and full of ideas', 'Reliable and tough as nails']
        },
        {
            question: 'If life were a video game, which skill tree would you max out first?',
            answers: ['Mobility and map control', 'Creativity and mind-bending abilities', 'Strength and endurance']
        },
        {
            question: 'What kind of challenge secretly excites you?',
            answers: ['Mastering something that demands perfect timing', 'Winning with clever tricks no one sees coming', 'A straight-up test of willpower and grit']
        },
        {
            question: 'Imagine your power comes with a quirky drawback. Which would you tolerate best?',
            answers: ['A mysterious weakness to certain places or conditions', 'Looking a bit unusual now and then', 'Needing constant training to stay sharp']
        },
        {
            question: 'Why would you chase a power in the first place?',
            answers: ['Freedom and adventure', 'Fun and surprise', 'Protecting the people you care about']
        },
        {
            question: 'You find a mysterious chest on a deserted island. What do you do first?',
            answers: ['Study the surroundings and plan the safest way to open it', 'Pick the lock with something clever you just improvised', 'Smash it open and see what’s inside']
        },
        {
            question: 'Which kind of thrill gives you the biggest grin?',
            answers: ['Outrunning a storm across open waters', 'Pulling off a prank that nobody saw coming', 'Wrestling a wild beast and winning']
        },
    ]


    const startQuizz = () => {
        setIsStarted(true);
        setAnswers([]);
        setCurrentQuestion(0);
    };

    const nextQuestion = (answer) => {
        setAnswers(prev => [...prev, answer]);
        if (currentQuestion === 9) {
            setIsLoading(true)
            setTimeout(() => setIsLoading(false), 2000)
        }
        setCurrentQuestion(prev => prev + 1);

    };


    const isDone = isStarted && currentQuestion >= quizzQuestions.length;

    // scoring secreto
    const scores = answers.reduce(
        (acc, a) => {
            if (a === 'a') acc.logia++;
            else if (a === 'b') acc.paramecia++;
            else acc.zoan++;
            return acc;
        },
        { logia: 0, paramecia: 0, zoan: 0 }
    );
    const total = Math.max(answers.length, 1);
    const perc = {
        logia: Math.round((scores.logia / total) * 100),
        paramecia: Math.round((scores.paramecia / total) * 100),
        zoan: Math.round((scores.zoan / total) * 100),
    };




    const winner =
        scores.logia >= scores.paramecia && scores.logia >= scores.zoan ? 'Logia' :
            scores.paramecia >= scores.zoan ? 'Paramecia' : 'Zoan';

    const filtered = allFruits.filter(f => f.type === winner);
    const pick = filtered.length ? filtered[genRandom(filtered.length)] : null;

    const current = pool[fruitIndex];


    return (
        <>
            <Seo
                title="Random Devil Fruit Generator – Which Fruit Will You Get?"
                description="Click to discover your random Devil Fruit! Instantly reveal one of the mysterious One Piece Devil Fruits with user, ability and image."
                canonical="https://onepiecedevilfruits.com/random-fruit"
                image="https://onepiecedevilfruits.com/assets/random-fruit-preview.jpg"
            />

            <Header headerShown={false} />


            <div className="mainFull randomWrapper">

                {/* QUIZ EM CURSO */}
                {isStarted && !isLoading && !isDone && quizzQuestions[currentQuestion] && (
                    <div className={styles.quizzWrapper}>
                        <span>Question {currentQuestion + 1}</span>
                        <h2>{quizzQuestions[currentQuestion].question}</h2>

                        <div className={styles.answersWrapper}>
                            <div onClick={() => nextQuestion('a')}>
                                {quizzQuestions[currentQuestion].answers[0]}
                            </div>
                            <div onClick={() => nextQuestion('b')}>
                                {quizzQuestions[currentQuestion].answers[1]}
                            </div>
                            <div onClick={() => nextQuestion('c')}>
                                {quizzQuestions[currentQuestion].answers[2]}
                            </div>
                        </div>

                        <div className={styles.progressWrapper}>
                            <div className={styles.progressBarbt}></div>
                            <div className={styles.progressBartp} style={{ width: `${currentQuestion + 1}0%` }}></div>
                        </div>
                    </div>
                )}

                {/* Loading */}

                {isLoading && (
                    <div className={styles.loadingWrapper}>
                        <h4>Finding your fruit...</h4>
                    </div>
                )}

                {/* RESULTADO DO QUIZ */}
                {isDone && !isLoading &&
                    <div className={styles.resultWrapper}>
                        <h2>Bounty Alert!</h2>
                        <div>
                            {pick ? (
                                <>
                                    <h3>The seas whisper your name… <br />the {pick.name} has chosen you. </h3>
                                    <img src={`${fruitImgLocation}/${pick.id}.webp` ?? pick.img?.user} alt={pick.name} />
                                    <p className={styles.aboutText}>{pick.about}</p>
                                </>
                            ) : (
                                <p>No fruits available for {winner}…</p>
                            )}
                        </div>
                        <button className="getFruitButton" onClick={startQuizz}>
                            Try again
                        </button>
                    </div>
                }

                {/* ECRÃ INICIAL */}
                {!isStarted && !isLoading && (
                    <>
                        <h2>Feeling lucky, pirate?</h2>
                        <span>Take the quiz and see which Devil Fruit chooses <b>YOU!</b></span>
                        <button className="getFruitButton" onClick={startQuizz}>
                            Get Started
                        </button>
                    </>
                )}
            </div>

            <Footer />
        </>
    );
}