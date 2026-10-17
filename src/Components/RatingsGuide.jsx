import styles from './RatingsGuide.module.css';

export default function RatingsGuide({ compact = false }) {
    return <details className={`${styles.guide} ${compact ? styles.compact : ''}`}>
        <summary>How to read the scores</summary>
        <div className={styles.copy}>
            <p>These are the site’s own estimates, not official One Piece stats or reader votes. The numbers are hand-set; there’s no fixed formula behind them.</p>
            <dl>
                <div><dt>Attack · /100</dt><dd>How much damage a power can do, and how useful it is on the offensive.</dd></div>
                <div><dt>Defense · /100</dt><dd>How well it can block, avoid, or withstand damage.</dd></div>
                <div><dt>Utility · /100</dt><dd>What it offers beyond damage: travel, support, healing, and other useful tricks.</dd></div>
                <div><dt>Power · /100</dt><dd>A separate overall estimate, also used in the crew games. It isn’t an average of the three scores above.</dd></div>
                <div><dt>Rarity · 1–5 stars</dt><dd>Our rarity rating, from more common to more unusual. It doesn’t describe your odds of finding a fruit.</dd></div>
            </dl>
            <p>A higher number isn’t a guaranteed win. The user, their training, and the matchup still matter.</p>
        </div>
    </details>;
}
