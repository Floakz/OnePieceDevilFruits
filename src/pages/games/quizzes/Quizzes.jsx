// pages/games/Quizzes.jsx
import { useEffect, useState, useRef } from "react";
import Header from "../../../Components/header/Header";
import Footer from "../../../Components/footer/footer";
import Seo from "../../../Components/Seo";
import styles from './Quizzes.module.css';
import { quizzes } from "../../../utils/quizzes";
import { useNavigate } from "react-router-dom";

export default function Quizzes() {

    const navigate = useNavigate();

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
                            <div
                                onClick={() => navigate(`/quizzes/${quiz.id}`)}
                                key={quiz.id}
                                className={styles.quizCard}>

                                <div
                                    style={{ backgroundImage: `url(${imgUrl}${quiz.id}/cover.webp)`, height: '50%', width: '100%', backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '10px 10px 0 0' }}

                                ></div>
                                <div>  <h2>{quiz.title}</h2>
                                    <p>{quiz.description}</p></div>
                            </div>
                        ))}







                    </div>




                </div>

            </div >
            <Footer />
        </>
    );
}
