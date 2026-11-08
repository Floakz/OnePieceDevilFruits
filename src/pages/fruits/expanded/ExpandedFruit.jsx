import Header from '../../../Components/header/Header';
import Footer from '../../../Components/footer/footer';
import Seo from '../../../Components/Seo';
import FruitImage from '../../../Components/FruitImage.jsx';
import RatingsGuide from '../../../Components/RatingsGuide.jsx';
import useFruits from '../../../hooks/useFruits.js';
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { createElement, useEffect, useMemo } from 'react';
import fruitsExpandedInfo from '../../../lib/fruits/fruitsExpandedInfo';
import styles from './expandedFruit.module.css';
import { getFruitImages } from '../../../lib/imagesMap';
import { slugify } from '../../../lib/slugify';
import { getAbilityTags, getRelatedFruits } from '../../../lib/fruitDiscovery.js';
import characterIndex from '../../../lib/characterIndex.js';
import { findFruitUserCharacter } from '../../../lib/characterLinks.js';
import FruitGallery from './FruitGallery.jsx';

const extraById = new Map(fruitsExpandedInfo.map(fruit => [String(fruit.id), fruit]));
const SITE = 'https://onepiecedevilfruits.com';

function Score({ label, value }) {
    const known = Number.isFinite(value);
    return <div className={styles.statWrapper}>
        <div className={styles.statCopyWrapper}><p>{label}</p><p>{known ? `${value}/100` : 'Not rated'}</p></div>
        <div className={styles.statBarWrapper} aria-hidden="true"><div /><div style={{ width: `${known ? Math.max(0, Math.min(100, value)) : 0}%` }} /></div>
    </div>;
}

function DetailList({ items, empty }) {
    return items?.length ? <ul className={styles.detailList}>{items.map((text, index) => <li key={index}>{text}</li>)}</ul>
        : <p className={styles.muted}>{empty}</p>;
}

function SectionTitle({ id, as: heading = 'h2', emoji, children }) {
    return createElement(heading, { id, className: styles.sectionTitle }, <span aria-hidden="true">{emoji}</span>, ' ', children);
}

function FruitUser({ fruitId, name }) {
    const character = findFruitUserCharacter(characterIndex, fruitId, name);
    return character ? <Link className={styles.arcLink} to={`/characters/${character.slug}`}>{name}</Link>
        : <span>{name || 'Unknown'}</span>;
}

export default function ExpandedFruit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { fruits, status, retry } = useFruits();
    const matchedFruit = useMemo(() => fruits.find(fruit => String(fruit.id) === id
        || slugify(fruit.name) === slugify(id) || slugify(fruit.romanizedName) === slugify(id)), [fruits, id]);
    const fruitInfo = useMemo(() => matchedFruit ? { ...matchedFruit, ...extraById.get(String(matchedFruit.id)) } : null, [matchedFruit]);
    const otherFruits = useMemo(() => fruitInfo ? getRelatedFruits(fruitInfo, fruits) : [], [fruitInfo, fruits]);
    const finalImgs = useMemo(() => {
        if (!fruitInfo) return [];
        const local = getFruitImages(String(fruitInfo.id));
        return local.length ? local : (fruitInfo.images || []);
    }, [fruitInfo]);

    useEffect(() => {
        if (matchedFruit && id !== slugify(matchedFruit.name)) {
            navigate({ pathname: `/fruit/${slugify(matchedFruit.name)}`, search: location.search, hash: location.hash }, { replace: true });
        }
    }, [matchedFruit, id, navigate, location.search, location.hash]);

    // A section link can also be opened directly or shared with someone else.
    useEffect(() => {
        if (status !== 'ready' || !fruitInfo || !location.hash) return;
        const frame = requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: 'start' }));
        return () => cancelAnimationFrame(frame);
    }, [status, fruitInfo, location.hash]);

    const isReady = status === 'ready' && fruitInfo;
    const categoryPath = fruitInfo?.type?.includes('Logia') ? '/logia' : fruitInfo?.type?.includes('Zoan') ? '/zoan' : '/paramecia';
    const title = isReady ? `${fruitInfo.name}${fruitInfo.romanizedName ? ` (${fruitInfo.romanizedName})` : ''} | One Piece Devil Fruits` : 'One Piece Devil Fruits — details, users and stats';
    const canonical = isReady ? `${SITE}/fruit/${slugify(fruitInfo.name)}` : `${SITE}/`;
    const summary = fruitInfo ? (fruitInfo.abilities?.[0] || fruitInfo.about || '').split(/(?<=[.!?])\s+/)[0] : '';
    const tags = fruitInfo ? getAbilityTags(fruitInfo) : [];
    const cdn = import.meta.env.VITE_CDN_BASE;
    const seoImage = fruitInfo ? (cdn ? `${cdn}/fruits/${fruitInfo.id}.webp` : fruitInfo.img?.fruit) : undefined;
    const jsonLd = isReady ? {
        '@context': 'https://schema.org', '@graph': [
            {
                '@type': 'BreadcrumbList', itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
                    { '@type': 'ListItem', position: 2, name: `${fruitInfo.type} Fruits`, item: `${SITE}${categoryPath}` },
                    { '@type': 'ListItem', position: 3, name: fruitInfo.name, item: canonical },
                ]
            },
            { '@type': 'WebPage', name: fruitInfo.name, alternateName: [fruitInfo.romanizedName, fruitInfo.japaneseName].filter(Boolean), url: canonical, description: summary, image: seoImage },
        ],
    } : undefined;

    return <>
        <Seo title={title} description={fruitInfo?.about?.slice(0, 158) || 'Browse Devil Fruits with type, user, stats and images.'}
            canonical={canonical} image={seoImage} type="article" noindex={status === 'error' || (status === 'ready' && !fruitInfo)} jsonLd={jsonLd} />
        <Header headerShown={false} />
        {status === 'loading' && <div className={styles.pageDetailWrapper} role="status"><p>Loading this fruit…</p></div>}
        {status === 'error' && <div className={styles.pageDetailWrapper}><div className="catalogState" role="alert">
            <p>This fruit couldn’t load. Give it another try.</p><button type="button" onClick={retry}>Try again</button>
        </div></div>}
        {status === 'ready' && !fruitInfo && <div className={styles.pageDetailWrapper}><h1 className={styles.notFoundTitle}>Fruit not found</h1><Link to="/">Back to all fruits</Link></div>}
        {isReady && <main className={styles.pageDetailWrapper}>
            <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
                <Link to="/">All fruits</Link><span aria-hidden="true">/</span><Link to={categoryPath}>{fruitInfo.type}</Link><span aria-hidden="true">/</span><span aria-current="page">{fruitInfo.name}</span>
            </nav>
            <div className={styles.titleWrapper}>
                <FruitImage fruit={fruitInfo} className="fruitImg" alt={`${fruitInfo.name} picture`} />
                <h1 className={styles.pageTitle}>{fruitInfo.name}</h1>
                {(fruitInfo.japaneseName || fruitInfo.romanizedName) && <div className={styles.titleNames}>
                    {fruitInfo.japaneseName && <span lang="ja">{fruitInfo.japaneseName}</span>}
                    {fruitInfo.romanizedName && <span>{fruitInfo.romanizedName}</span>}
                </div>}
                {tags.length > 0 && <ul className={styles.abilityTags} aria-label="Ability tags">{tags.map(tag => <li key={tag.id}><Link to={`/?ability=${tag.id}#fruit-filters`}>{tag.label}</Link></li>)}</ul>}
            </div>

            <section id="fruit-facts" tabIndex={-1} className={styles.sectionDetailWrapper} aria-labelledby="facts-title">
                <div className={styles.wrapper1x2}>
                    <div className={styles.InfoWrapper}>
                        <SectionTitle id="facts-title" emoji="📌">Quick facts</SectionTitle>
                        <div className={styles.gridDiv2x2}>
                            <p>Type:<br /> <span className={styles.spanTag}>{fruitInfo.type}</span></p>
                            <p>User:<br /> <FruitUser fruitId={fruitInfo.id} name={fruitInfo.user} /></p>
                            <p>Debut arc:<br /> {fruitInfo.debutArc ? <Link className={styles.arcLink} to={`/?arc=${encodeURIComponent(fruitInfo.debutArc)}#fruit-filters`}>{fruitInfo.debutArc}</Link> : <span>Unknown</span>}</p>
                            <p>First appearance:<br /> <span>{fruitInfo.firstAppearance || 'Unknown'}</span></p>
                            <p>Previous user:<br /> <FruitUser fruitId={fruitInfo.id} name={fruitInfo.previousUser} /></p>
                            <p>Awakening:<br /> <span>{fruitInfo.isAwakened == null ? 'Unknown' : fruitInfo.isAwakened ? 'Awakened' : 'Not confirmed'}</span></p>
                            <p>Canon status:<br /> <span>{fruitInfo.isCanon == null ? 'Unknown' : fruitInfo.isCanon ? 'Canon' : 'Non-canon'}</span></p>
                        </div>
                        <SectionTitle as="h3" emoji="🏷️">Names</SectionTitle>
                        <dl className={styles.namesGrid}>
                            <div><dt>English</dt><dd>{fruitInfo.name}</dd></div>
                            <div><dt>Romanized</dt><dd>{fruitInfo.romanizedName || 'Unknown'}</dd></div>
                            <div><dt>Japanese</dt><dd lang="ja">{fruitInfo.japaneseName || 'Unknown'}</dd></div>
                            <div><dt>Meaning</dt><dd>{fruitInfo.nameMeaning || 'Unknown'}</dd></div>
                        </dl>
                    </div>
                    <div className={styles.imgBox}><FruitImage fruit={fruitInfo} kind="character" className={styles.userImg} loading="lazy" /></div>
                </div>
            </section>
            <section id="fruit-abilities" tabIndex={-1} className={styles.sectionWrapper} aria-labelledby="abilities-title">
                <SectionTitle id="abilities-title" emoji="🌪️">Abilities</SectionTitle>
                <DetailList items={fruitInfo.abilities?.length ? fruitInfo.abilities : fruitInfo.about ? [fruitInfo.about] : []} empty="We haven’t added the abilities yet." />
                {fruitInfo.techniques?.length > 0 && <><SectionTitle as="h3" emoji="⚔️">Named techniques</SectionTitle><DetailList items={fruitInfo.techniques} /></>}
            </section>
            <div className={styles.sectionWrapper}>
                <div className={styles.wrapper1x3}>
                    <section id="fruit-strengths" tabIndex={-1} aria-labelledby="strengths-title"><SectionTitle id="strengths-title" emoji="🛡️">Strengths</SectionTitle><DetailList items={fruitInfo.strengths} empty="We haven’t added the strengths yet." /></section>
                    <section id="fruit-weaknesses" tabIndex={-1} aria-labelledby="weaknesses-title"><SectionTitle id="weaknesses-title" emoji="⚠️">Weaknesses</SectionTitle><DetailList items={fruitInfo.weaknesses} empty="We haven’t added the weaknesses yet." /></section>
                </div>
            </div>
            <section id="fruit-stats" tabIndex={-1} className={`${styles.sectionWrapper} ${styles.sectionOutline}`} aria-labelledby="stats-title">
                <div className={styles.statsHeading}><SectionTitle id="stats-title" emoji="📊">Stats</SectionTitle><span className={styles.editorialLabel}>Editorial scores</span></div>
                <div className={styles.wrapper4x4}>
                    <Score label="Attack" value={fruitInfo.ratings?.attack} /><Score label="Defense" value={fruitInfo.ratings?.defense} />
                    <Score label="Utility" value={fruitInfo.ratings?.utility} /><Score label="Power" value={fruitInfo.power} />
                    <div className={styles.statWrapper}><div className={styles.statCopyWrapper}><p>Rarity</p><p>{Number.isFinite(fruitInfo.rarity) ? `${fruitInfo.rarity}/5` : 'Not rated'}</p></div>
                        <div className={styles.rarityStarWrapper} aria-hidden="true">{[1, 2, 3, 4, 5].map(star => <span key={star} style={{ color: fruitInfo.rarity >= star ? '#f8de3c' : '#4d78a5' }}>★</span>)}</div>
                    </div>
                </div>
                <RatingsGuide />
            </section>
            {finalImgs.length > 0 && <section id="fruit-gallery" tabIndex={-1} className={styles.sectionWrapper} aria-labelledby="gallery-title">
                <SectionTitle id="gallery-title" emoji="🖼️">Gallery</SectionTitle><FruitGallery key={fruitInfo.id} images={finalImgs} fruit={fruitInfo} />
            </section>}
            {otherFruits.length > 0 && <section className={styles.sectionWrapper} aria-labelledby="related-title">
                <SectionTitle id="related-title" emoji="✨">Worth a look next</SectionTitle>
                <div className={styles.otherFruitsWrapper}>{otherFruits.map(fruit => <Link key={fruit.id} to={`/fruit/${slugify(fruit.name)}`} className={styles.otherFruitsSingle}>
                    <FruitImage fruit={fruit} kind="character" loading="lazy" className={styles.relatedCharacter} alt="" aria-hidden="true" />
                    <FruitImage fruit={fruit} loading="lazy" className={styles.otherfruitImg} />
                    <h3>{fruit.name}</h3><p className={styles.relatedReason}>{fruit.reason}</p>
                </Link>)}</div>
            </section>}
        </main>}
        <Footer />
    </>;
}
