// pages/games/Quizzes.jsx
import Header from "../../../Components/header/Header";
import Footer from "../../../Components/footer/footer";
import Seo from "../../../Components/Seo";
import styles from './Quizzes.module.css';
import { quizzes } from "../../../utils/quizzes";
import { Link } from "react-router-dom";

export default function Quizzes() {
    const imgUrl = 'https://cd-opf.pages.dev/quizzes/'

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
                        <h1>Test your knowledge with our <span className={styles.quizzSpan}>Quizzes!</span></h1>
                    </div>

                    <div className={styles.fullQuizzGrid}>
                        {quizzes.map((quiz) => (
                            <Link
                                to={`/quizzes/${quiz.slug}`}
                                key={quiz.id}
                                className={styles.quizCard}>

                                <div
                                    style={{ backgroundImage: `url(${imgUrl}${quiz.id}/cover.webp)`, height: '50%', width: '100%', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '10px 10px 0 0' }}

                                ></div>
                                <div>
                                    <h2>{quiz.title}</h2>
                                    <p>{quiz.description}</p>
                                    <p className={styles.quizMeta}>
                                        <span>{quiz.questions.length} {quiz.questions.length === 1 ? "question" : "questions"}</span>
                                        <span aria-hidden="true">•</span>
                                        <span>Difficulty: {quiz.difficulty}/5</span>
                                    </p>
                                </div>
                            </Link>
                        ))}







                    </div>




                </div>

            </div >
            <Footer />
        </>
    );
}
