import { useEffect, useState, useRef } from "react";
import Header from "../../../Components/header/Header";
import Footer from "../../../Components/footer/footer";
import Seo from "../../../Components/Seo";
import styles from './Quizzes.module.css';
import { useParams } from "react-router-dom";
import { quizzes } from "../../../utils/quizzes";

export default function ExpandedQuizz() {

    const { id } = useParams();
    const Quizz = quizzes.find((quiz) => quiz.id === id);



    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [percentage, setPercentage] = useState(1);

    // NEW state
    const [selectedAnswer, setSelectedAnswer] = useState(null); // index clicked
    const [isAnswered, setIsAnswered] = useState(false); // locks clicks during feedback

    const timeoutRef = useRef(null);

    // cleanup any pending timeout if component unmounts mid-wait
    useEffect(() => {
        return () => clearTimeout(timeoutRef.current);
    }, []);

    const currentQuestion = Quizz?.questions[currentQuestionIndex];

    const handleOptionClick = (index) => {
        if (isAnswered) return;
        const isCorrect = index === currentQuestion.correctAnswer;
        const newScore = isCorrect ? score + 1 : score;

        setSelectedAnswer(index);
        setIsAnswered(true);

        if (isCorrect) {
            setScore(newScore);
        }

        timeoutRef.current = setTimeout(() => {
            const nextIndex = currentQuestionIndex + 1;


            if (currentQuestionIndex === Quizz.questions.length - 1) {
                setShowResults(true);
                return;
            }


            setPercentage((nextIndex / Quizz.questions.length) * 100);

            if (nextIndex >= Quizz.questions.length) {
                setShowResults(true);
            } else {
                setCurrentQuestionIndex(nextIndex);
            }

            setSelectedAnswer(null);
            setIsAnswered(false);
        }, 1000);
    };
    const getOptionClassName = (index) => {
        if (!isAnswered) return styles.option;

        const isCorrectOption = index === currentQuestion.correctAnswer;
        const isSelectedOption = index === selectedAnswer;

        if (isCorrectOption) return `${styles.option} ${styles.correct}`;
        if (isSelectedOption && !isCorrectOption) return `${styles.option} ${styles.incorrect}`;
        return styles.option;
    };

    return (
        <>
            <Seo
                title="OnePiece Quizzes"
                description="Test your knowledge of the One Piece universe and One Piece DevilFruits with our fun quizzes!"
                canonical="https://onepiecedevilfruits.com/quizzes"
            />

            <Header headerShown={false} />
            <div className="mainFull">
                <div className={styles.quizzesPageWrapper}>

                    <div className={styles.titleWrapper}>
                        <h1>{Quizz?.title}</h1>
                    </div>

                    <div className={styles.quizContentWrapper}>
                        {!showResults ? <>
                            <div className={styles.questionContentWrapper}>
                                <img className={styles.questionImage} src={currentQuestion?.image} alt={Quizz?.title} />
                                <div className={styles.questionWrapper}>
                                    <h2>{currentQuestion?.question}</h2>

                                    <div className={styles.optionsWrapper}>
                                        {currentQuestion?.options.map((option, index) => (
                                            <div
                                                key={index}
                                                className={getOptionClassName(index)}
                                                onClick={() => handleOptionClick(index)}
                                            >
                                                {option}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.progressBar}>
                                <div style={{ width: `${percentage}%` }}></div>
                                <div></div>
                            </div></>

                            :

                            <div>
                                <h2>Quiz Completed!</h2>
                                <p>Your Score: {score} / {Quizz?.questions.length}</p>
                                <button onClick={() => {
                                    setCurrentQuestionIndex(0);
                                    setScore(0);
                                    setShowResults(false);
                                    setPercentage(1);
                                    setSelectedAnswer(null);
                                    setIsAnswered(false);

                                }}>Retake Quiz</button>
                            </div>}

                    </div>




                </div>
            </div>
            <Footer />
        </>
    );
}