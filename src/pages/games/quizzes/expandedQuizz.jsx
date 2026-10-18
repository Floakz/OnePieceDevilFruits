import { useEffect, useState, useRef } from "react";
import Header from "../../../Components/header/Header";
import Footer from "../../../Components/footer/footer";
import Seo from "../../../Components/Seo";
import styles from './Quizzes.module.css';
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { quizzes } from "../../../utils/quizzes";

export default function ExpandedQuizz() {

    const { slug } = useParams();
    const Quizz = quizzes.find((quiz) => quiz.slug === slug || quiz.id === slug);


    const imgUrl = 'https://cd-opf.pages.dev/quizzes/'

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [percentage, setPercentage] = useState(1);
    const navigate = useNavigate();
    const location = useLocation();

    const [quizzState, setQuizzState] = useState(0)

    // NEW state
    const [selectedAnswer, setSelectedAnswer] = useState(null); // index clicked
    const [isAnswered, setIsAnswered] = useState(false); // locks clicks during feedback

    const timeoutRef = useRef(null);

    // cleanup any pending timeout if component unmounts mid-wait
    useEffect(() => {
        return () => clearTimeout(timeoutRef.current);
    }, []);

    const currentQuestion = Quizz?.questions[currentQuestionIndex];


    const otherQuizzes = quizzes.filter((quiz) => quiz.id !== Quizz?.id).slice(0, 3);

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

    useEffect(() => {
        if (Quizz && slug !== Quizz.slug) {
            navigate(`/quizzes/${Quizz.slug}/${location.search}${location.hash}`, { replace: true });
            return;
        }

        setQuizzState(0);
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowResults(false);
        setPercentage(1);
        setSelectedAnswer(null);
        setIsAnswered(false);

        clearTimeout(timeoutRef.current);
    }, [Quizz, location.hash, location.search, navigate, slug]);

    if (!Quizz) {
        return (
            <>
                <Seo
                    title="Quiz not found | One Piece Devil Fruits"
                    description="The requested One Piece quiz could not be found."
                    canonical="https://onepiecedevilfruits.com/quizzes"
                />
                <Header headerShown={false} />
                <div className="mainFull">
                    <div className={styles.quizzesPageWrapper}>
                        <div className={styles.titleWrapper}><h1>Quiz not found</h1></div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Seo
                title={`${Quizz.title} | One Piece Quizzes`}
                description={Quizz.description}
                canonical={`https://onepiecedevilfruits.com/quizzes/${Quizz.slug}`}
            />

            <Header headerShown={false} />
            <div className="mainFull">
                <div className={styles.quizzesPageWrapper}>

                    <div className={styles.titleWrapper}>
                        <h1>{Quizz?.title}</h1>
                    </div>



                    <div className={styles.quizContentWrapper}>

                        {quizzState === 0 &&

                            <div className={styles.questionContentWrapper}>
                                <img className={styles.quizIntroImage} src={`${imgUrl}${Quizz.id}/cover.webp`} alt={Quizz?.title} />
                                <div className={styles.quizIntroTextWrapper}>
                                    <h2>{Quizz?.title}</h2>
                                    <p>{Quizz?.description}</p>
                                    <button className={styles.startButton} onClick={() => setQuizzState(1)}>Start Quiz</button>
                                </div>
                            </div>

                        }

                        {quizzState === 1 ?

                            (!showResults ? <>
                                <div className={styles.questionContentWrapper}>
                                    <img className={styles.questionImage} src={`${imgUrl}${Quizz.id}/${currentQuestionIndex + 1}.webp`} alt={Quizz?.title} />
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

                                <div className={`${styles.questionContentWrapper} ${styles.finalDiv}`}>
                                    <div className={styles.finalScoreWrapper}>
                                        <div>
                                            <img className={styles.QuizzfinalImage} src={'https://cd-opf.pages.dev/quizzes/misc/vegapunk-quizz-finalImage.webp'} alt={Quizz?.title} />
                                        </div>
                                        <div>
                                            <h2>Quiz Completed!</h2>

                                            <p className={styles.finalScore}>Your Score: <br /> {score} / {Quizz?.questions.length}</p>

                                            <button
                                                className={styles.retakeButton}
                                                onClick={() => {
                                                    setCurrentQuestionIndex(0);
                                                    setScore(0);
                                                    setShowResults(false);
                                                    setPercentage(1);
                                                    setSelectedAnswer(null);
                                                    setIsAnswered(false);
                                                    setQuizzState(0);
                                                }}>Retake Quiz</button>
                                        </div>
                                    </div>
                                </div>) : null
                        }

                    </div>

                    <div className={styles.otherQuizzSuggestionsWrapper}>
                        <h4>Other quizzes</h4>
                        <div className={styles.otherQuizzList}>
                            {otherQuizzes.map((quiz) => (
                                <Link
                                    to={`/quizzes/${quiz.slug}/`}
                                    key={quiz.id}
                                    className={styles.otherQuizzItem}
                                    style={{ backgroundImage: `url(${imgUrl}${quiz.id}/cover.webp)` }}
                                >
                                    <p>{quiz.title}</p>
                                </Link>
                            ))}
                        </div>
                    </div>





                </div>
            </div >
            <Footer />
        </>
    );
}
