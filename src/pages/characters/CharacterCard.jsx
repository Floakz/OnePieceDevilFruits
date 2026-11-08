import { Link } from 'react-router-dom';
import FruitImage from '../../Components/FruitImage.jsx';
import CharacterPortrait from './CharacterPortrait.jsx';
import '../../Components/fruitcardstyle.css';
import styles from './characters.module.css';

export default function CharacterCard({ profile }) {
    return <Link to={`/characters/${profile.slug}`} className={`fruitCard-wrapper cardClickable ${styles.characterCard}`}>
        <div className={`info-wrapper ${styles.cardInfo}`}>
            <div>
                <FruitImage fruit={{ id: profile.fruitId, name: profile.fruitName }} className="fruitImg" loading="lazy" />
                <h2 className="titleFruit">{profile.name}</h2>
                <div className="fruitNames">
                    <span lang="ja">{profile.japaneseName}</span>
                    <span>{profile.romanizedName}</span>
                </div>
                <p className={styles.cardAlias}>{profile.alias}</p>
            </div>
            <p className={`aboutSection ${styles.cardAbout}`}>{profile.about}</p>
            <div className={styles.cardTags}>
                <div><small>Group</small><span>{profile.group}</span></div>
                <div><small>Fruit type</small><span>{profile.fruitType}</span></div>
                <div><small>Debut</small><span>{profile.debutArc}</span></div>
            </div>
        </div>
        <CharacterPortrait profile={profile} loading="lazy" className={`userImg ${styles.cardPortrait}`} />
    </Link>;
}
