import styles from './characters.module.css';
import fruitStyles from '../fruits/expanded/expandedFruit.module.css';

export default function ProfileContent({ id, title, paragraphs }) {
    return <section id={id} className={`${fruitStyles.sectionWrapper} ${styles.textSection}`} aria-labelledby={`${id}-title`}>
        <h2 id={`${id}-title`} className={fruitStyles.sectionTitle}>{title}</h2>
        {paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
    </section>;
}
