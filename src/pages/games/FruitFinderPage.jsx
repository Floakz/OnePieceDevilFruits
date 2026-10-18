import { useEffect, useMemo, useReducer, useRef } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../Components/header/Header';
import Footer from '../../Components/footer/footer';
import Seo from '../../Components/Seo';
import SocialShare from '../../Components/socialShare/SocialShare';
import FruitImage from '../../Components/FruitImage.jsx';
import CatalogState from '../../Components/CatalogState.jsx';
import useFruits from '../../hooks/useFruits.js';
import { slugify } from '../../lib/slugify.js';
import { FINDER_PAGE, INITIAL_FINDER_STATE, createFinderRun, finderAnswersComplete, finderReducer, findFruitMatches, getFinderCandidates, getFinderQuestion, pickFinderMatch } from '../../lib/fruitFinder.js';
import styles from './games.module.css';

export default function FruitFinderPage() {
    const { fruits, status, retry } = useFruits();
    const [quiz, dispatch] = useReducer(finderReducer, INITIAL_FINDER_STATE);
    const questionHeading = useRef(null);
    const reviewPanel = useRef(null);
    const reviewTarget = useRef(null);
    const question = getFinderQuestion(quiz.phase === 'editing' ? quiz.editingQuestionId : quiz.questionIds[quiz.questionIndex]);
    const matches = useMemo(() => findFruitMatches(fruits, quiz.answers, { questionIds: quiz.questionIds, limit: fruits.length }), [fruits, quiz.answers, quiz.questionIds]);
    const match = useMemo(() => pickFinderMatch(matches, quiz.resultRoll), [matches, quiz.resultRoll]);
    const alternatives = getFinderCandidates(matches).filter(other => other.fruit.id !== match?.fruit.id).slice(0, 2);
    const pick = match?.fruit;
    const canShowResult = finderAnswersComplete(quiz.answers, quiz.questionIds);

    function startQuiz() {
        reviewTarget.current = null;
        dispatch({ type: 'START', run: createFinderRun() });
    }

    function editAnswer(id) {
        reviewTarget.current = id;
        dispatch({ type: 'EDIT', questionId: id });
    }

    useEffect(() => {
        if (status !== 'ready' || quiz.phase === 'intro') return;
        if (quiz.phase === 'review' && reviewTarget.current) {
            reviewPanel.current?.querySelector(`[data-question-id="${reviewTarget.current}"]`)?.focus({ preventScroll: true });
            reviewTarget.current = null;
            return;
        }
        questionHeading.current?.focus({ preventScroll: true });
    }, [quiz.phase, quiz.questionIndex, quiz.editingQuestionId, status]);

    return <>
        <Seo title={FINDER_PAGE.title} description={FINDER_PAGE.description} canonical={FINDER_PAGE.url} />
        <Header headerShown={false} />
        <div className="mainFull randomWrapper">
            {status !== 'ready' ? <CatalogState status={status} retry={retry} />
                : quiz.phase === 'intro' ? <>
                    <h2>Which Devil Fruit fits you?</h2>
                    <span>Eight questions from a rotating pool. We’ll find a fruit that fits your answers.</span>
                    <button type="button" className="getFruitButton" onClick={startQuiz}>Get started</button>
                </> : quiz.phase === 'review' ? <div className={styles.finderReview} ref={reviewPanel}>
                    <h2 ref={questionHeading} tabIndex={-1}>Your answers</h2>
                    <p>Change any answer without starting a new quiz.</p>
                    <ol className={styles.reviewAnswers}>{quiz.questionIds.filter(id => quiz.answers[id]).map(id => {
                        const asked = getFinderQuestion(id);
                        const answer = asked.answers.find(option => option.id === quiz.answers[id]);
                        return <li key={id} role="listitem">
                            <div><h3>{asked.question}</h3><p>{answer.label}</p></div>
                            <button type="button" data-question-id={id} aria-label={`Change answer for: ${asked.question}`} onClick={() => editAnswer(id)}>Change</button>
                        </li>;
                    })}</ol>
                    <button type="button" className="getFruitButton" onClick={() => dispatch({ type: 'RESUME' })}>{canShowResult ? 'See your match' : 'Continue quiz'}</button>
                </div> : ['questions', 'editing'].includes(quiz.phase) ? <div className={`${styles.quizzWrapper} ${styles.finderQuiz}`}>
                    <span>{quiz.phase === 'editing' ? 'Change answer' : `Question ${quiz.questionIndex + 1} of ${quiz.questionIds.length}`}</span>
                    <h2 ref={questionHeading} tabIndex={-1}>{question.question}</h2>
                    <div className={styles.answersWrapper}>
                        {question.answers.map(answer => <button
                            type="button"
                            key={answer.id}
                            aria-pressed={quiz.answers[question.id] === answer.id}
                            onClick={() => dispatch({ type: 'ANSWER', questionId: question.id, answerId: answer.id })}
                        >{answer.label}</button>)}
                    </div>
                    {quiz.phase === 'questions' && <div className={styles.progressWrapper} role="progressbar" aria-label="Quiz progress"
                        aria-valuemin={0} aria-valuemax={quiz.questionIds.length} aria-valuenow={quiz.questionIndex + 1}>
                        <div className={styles.progressBarbt} />
                        <div className={styles.progressBartp} style={{ width: `${(quiz.questionIndex + 1) / quiz.questionIds.length * 100}%` }} />
                    </div>}
                    <div className={styles.finderControls}>
                        {quiz.phase === 'editing'
                            ? <button type="button" onClick={() => dispatch({ type: 'CANCEL_EDIT' })}>Cancel</button>
                            : <button type="button" disabled={!Object.keys(quiz.answers).length} onClick={() => dispatch({ type: 'REVIEW' })}>Review answers</button>}
                    </div>
                </div> : pick ? <div className={`${styles.resultWrapper} ${styles.finderResult}`}>
                    <h2 ref={questionHeading} tabIndex={-1}>Your match</h2>
                    <div>
                        <h3><Link to={`/fruit/${slugify(pick.name)}`} className={styles.fruitNameLink}>{pick.name}</Link></h3>
                        <FruitImage fruit={pick} />
                        <p className={styles.aboutText}>{match.summary}</p>
                    </div>

                    {alternatives.length > 0 && <div className={styles.closeMatches}>
                        <span>Other close matches</span>
                        {alternatives.map(other => <Link key={other.fruit.id} className={styles.fruitNameLink} to={`/fruit/${slugify(other.fruit.name)}`}>{other.fruit.name}</Link>)}
                    </div>}
                    <button type="button" className="getFruitButton" onClick={startQuiz}>Try again</button>
                    <div className={styles.finderControls}><button type="button" onClick={() => dispatch({ type: 'REVIEW' })}>Review answers</button></div>
                    <SocialShare title="Fruit Finder" url={FINDER_PAGE.url} text={`I matched with ${pick.name} in Fruit Finder. Which Devil Fruit fits you?`} />
                </div> : <div className="catalogState" role="alert">
                    <p>We couldn’t find a fruit in this list. Try loading it again.</p>
                    <button type="button" onClick={retry}>Try again</button>
                </div>}
        </div>
        <Footer />
    </>;
}
