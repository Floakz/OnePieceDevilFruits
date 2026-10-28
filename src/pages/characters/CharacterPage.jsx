import { useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import Header from '../../Components/header/Header.jsx';
import Footer from '../../Components/footer/footer.jsx';
import Seo from '../../Components/Seo.jsx';
import FruitImage from '../../Components/FruitImage.jsx';
import CharacterPortrait from './CharacterPortrait.jsx';
import ProfileContent from './ProfileContent.jsx';
import characterIndex from '../../lib/characterIndex.js';
import { getCharacterSeo } from '../../lib/characterSeo.js';
import useCharacterProfile from '../../hooks/useCharacterProfile.js';
import { slugify } from '../../lib/slugify.js';
import fruitStyles from '../fruits/expanded/expandedFruit.module.css';
import styles from './characters.module.css';

export default function CharacterPage() {
    const { slug } = useParams();
    const { hash } = useLocation();
    const { entry, profile, status, retry } = useCharacterProfile(slug);
    const related = entry ? characterIndex.filter(other => other.slug !== slug && other.group === entry.group).slice(0, 3) : [];

    useEffect(() => {
        if (!hash || !profile) return;
        const frame = requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' }));
        return () => cancelAnimationFrame(frame);
    }, [hash, profile]);

    return <>
        <Seo {...getCharacterSeo(entry)} noindex={!entry || status === 'error'} />
        <Header headerShown={false} />
        <main className={`${fruitStyles.pageDetailWrapper} ${styles.detailPage}`}>
            <nav className={fruitStyles.breadcrumbs} aria-label="Breadcrumb">
                <Link to="/characters">Characters</Link>
                {entry && <><span aria-hidden="true">/</span><span aria-current="page">{entry.name}</span></>}
            </nav>
            {status === 'loading' && <div className={styles.empty} role="status"><p>Loading character…</p></div>}
            {status === 'error' && <div className={styles.empty} role="alert"><p>This character couldn’t load. Give it another try.</p><button className={styles.button} onClick={retry} type="button">Try again</button></div>}
            {status === 'not-found' && <div className={styles.empty}><h1>Character not found</h1><p>This character is not in our collection yet.</p></div>}
            {profile && <>
                <div className={fruitStyles.titleWrapper}>
                    <FruitImage fruit={{ id: profile.fruitId, name: profile.fruitName }} className="fruitImg" />
                    <h1 className={fruitStyles.pageTitle}>{profile.name}</h1>
                    <div className={fruitStyles.titleNames}>
                        <span lang="ja">{profile.japaneseName}</span>
                        <span>{profile.romanizedName}</span>
                    </div>
                    <p className={styles.profileAlias}>{profile.alias}</p>
                </div>
                <section id="overview" className={fruitStyles.sectionDetailWrapper} aria-labelledby="overview-title">
                    <div className={fruitStyles.wrapper1x2}>
                        <div className={fruitStyles.InfoWrapper}>
                            <h2 id="overview-title" className={fruitStyles.sectionTitle}>Quick facts</h2>
                            <p className={styles.overview}>{profile.about}</p>
                            <dl className={styles.facts}>
                                {[
                                    ['Group', profile.group], ['Role', profile.role], ['Debut arc', profile.debutArc],
                                    ['First appearance', profile.firstAppearance], ['Age during Arabasta', profile.age],
                                    ['Birthday', profile.birthday], ['Height', profile.height], ['Devil Fruit', profile.fruitName],
                                ].filter(([, value]) => value).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
                            </dl>
                        </div>
                        <div className={fruitStyles.imgBox}><CharacterPortrait profile={profile} className={fruitStyles.userImg} /></div>
                    </div>
                </section>
               
                <ProfileContent id="background" title="Background" paragraphs={profile.background} />
                <ProfileContent id="personality" title="Personality" paragraphs={profile.personality} />
                <section id="abilities" className={`${fruitStyles.sectionWrapper} ${styles.powerPanel}`} aria-labelledby="abilities-title">
                    <FruitImage fruit={{ id: profile.fruitId, name: profile.fruitName }} loading="lazy" />
                    <div className={styles.textSection}>
                        <h2 id="abilities-title" className={fruitStyles.sectionTitle}>Abilities and fighting style</h2>
                        <p className={styles.fruitName}>{profile.fruitName}<span>{profile.fruitRomanizedName} · {profile.fruitType}</span></p>
                        {profile.combat.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
                        <Link className={styles.button} to={`/fruit/${slugify(profile.fruitName)}`}>View fruit details <span aria-hidden="true">→</span></Link>
                        <small className={styles.fruitNote}>Fruit pages may include information from later arcs.</small>
                    </div>
                </section>
                <section id="relationships" className={`${fruitStyles.sectionWrapper} ${styles.textSection}`} aria-labelledby="relationships-title">
                    <h2 id="relationships-title" className={fruitStyles.sectionTitle}>Relationships</h2>
                    <dl className={styles.relationships}>{profile.relationships.map(relationship => <div key={relationship.name}>
                        <dt>{relationship.name}</dt><dd>{relationship.text}</dd>
                    </div>)}</dl>
                </section>
                <section className={`${fruitStyles.sectionWrapper} ${styles.textSection}`} aria-labelledby="details-title">
                    <h2 id="details-title" className={fruitStyles.sectionTitle}>Details and trivia</h2>
                    <ul className={styles.trivia}>{profile.details.map(detail => <li key={detail}>{detail}</li>)}</ul>
                </section>
                <details key={slug} id="story" className={styles.spoilers}>
                    <summary><span>Story spoilers</span><small>Through the end of Arabasta</small></summary>
                    <div className={styles.spoilerBody}>
                        <h2>{profile.name}’s story</h2>
                        {profile.story.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
                    </div>
                </details>
                {related.length > 0 && <section className={`${fruitStyles.sectionWrapper} ${styles.more}`} aria-labelledby="more-characters">
                    <h2 id="more-characters" className={fruitStyles.sectionTitle}>More familiar faces</h2>
                    <div className={styles.relatedGrid}>{related.map(other => <Link key={other.slug} to={`/characters/${other.slug}`} className={styles.relatedCard}>
                        <CharacterPortrait profile={other} loading="lazy" />
                        <div><h3>{other.name}</h3><p lang="ja">{other.japaneseName}</p><p>{other.romanizedName}</p><span>{other.alias}</span></div>
                    </Link>)}</div>
                </section>}
            </>}
        </main>
        <Footer />
    </>;
}
