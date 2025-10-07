import Header from "../../../Components/header/Header"
import Footer from "../../../Components/footer/footer"
import { fetchAllFruitsOnce } from "../../../lib/fruitsApi";
import Seo from "../../../Components/Seo"
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import fruitsExpandedInfo from "../../../lib/fruits/fruitsExpandedInfo";
import styles from './expandedFruit.module.css'

export default function ExpandedFruit() {
    const { id } = useParams();

    const navigate = useNavigate()

    const [shownImageCarro, setShownImageCarro] = useState(0)
    const [fruitInfo, setFruitInfo] = useState(null);
    const [otherFruits, setOtherFruits] = useState();
    const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'notfound' | 'error'
    const [imageLoaded, setImageLoaded] = useState(false)



    useEffect(() => {
        let active = true;

        (async () => {
            try {
                setShownImageCarro(0)
                setStatus('loading');
                const allFruits = await fetchAllFruitsOnce();


                const base = allFruits.find(f => String(f.id) === String(id));
                const extra = fruitsExpandedInfo.find(f => String(f.id) === String(id));

                if (!active) return;

                if (!base && !extra) {
                    setFruitInfo(null);
                    setStatus('notfound');
                    return;
                }

                const merged = { ...(base || {}), ...(extra || {}) };

                const pool = allFruits.filter(f => String(f.id) !== String(id));
                const picks = pool.sort(() => Math.random() - 0.5).slice(0, 5);
                setOtherFruits(picks);

                setFruitInfo(merged);
                setStatus('ready');

            } catch (err) {
                console.error('Error finding the fruit', err);
                if (active) setStatus('error');
            }
        })();

        return () => { active = false; };
    }, [id]);


    function updateImageCarro(direction) {
        setImageLoaded(false) // reset loading
        setShownImageCarro(prev => {
            if (direction === 'next') return prev + 1
            if (direction === 'back') return prev - 1
            return prev
        })
    }

    const SITE = "https://onepiecedevilfruits.com";
    const isReady = status === "ready" && fruitInfo;

    const seoTitle = isReady
        ? `${fruitInfo.name} — user ${fruitInfo.user || 'unknown'} | One Piece Devil Fruits`
        : "One Piece Devil Fruits — details, users and stats";

    const seoDescription = isReady
        ? (fruitInfo.about
            ? fruitInfo.about.slice(0, 155) // corta simples para não ficar gigante
            : `Explore ${fruitInfo.name}${fruitInfo.type ? ` (${fruitInfo.type})` : ''}${fruitInfo.user ? ` used by ${fruitInfo.user}` : ''}. Stats, strengths, weaknesses and images.`)
        : "Browse Devil Fruits with type, user, stats and images.";

    const seoCanonical = isReady
        ? `${SITE}/fruit/${fruitInfo.id}`
        : `${SITE}/fruits`;

    return (
        <>

            <Seo
                title={seoTitle}
                description={seoDescription}
                canonical={seoCanonical}
            />


            <Header />
            {status === 'loading' && <div className={styles.pageDetailWrapper}><h2>Loading… 🏴‍☠️</h2></div>}
            {status === 'error' && <div className={styles.pageDetailWrapper}><h2>Ups. Something went Wrong</h2></div>}
            {status === 'notfound' && <div className={styles.pageDetailWrapper}><h2>Fruit not found</h2></div>}


            {status === 'ready' && (
                <div className={styles.pageDetailWrapper}>

                    <div className={styles.titleWrapper}>
                        <img className='fruitImg' src={fruitInfo.img.fruit || 'https://i.postimg.cc/Sxp09zGS/unkown.png'} alt={`${fruitInfo.name} picture`} />
                        <h1 className={styles.pageTitle}>{fruitInfo.name}</h1>
                    </div>

                    <div className={styles.sectionDetailWrapper}>

                        <div className={styles.wrapper1x2}>
                            <div className={styles.InfoWrapper}>
                                <span className={styles.sectionTitle}>📌 Quick Facts</span>
                                <div className={styles.gridDiv2x2}>
                                    <p>Type: <span className={styles.spanTag}>{fruitInfo.type}</span></p>
                                    <p>User: <span>{fruitInfo.user}</span></p>
                                    <p>First Appearance: <span>{fruitInfo.firstAppearance || 'Unkown'} </span></p>
                                    <p>Previous User: <span>{fruitInfo.previousUser || 'Unkown'}</span></p>
                                </div>

                                <span className={styles.sectionTitle}>🌪️ About</span>
                                <p className={styles.text}>{fruitInfo.about}</p>
                            </div>

                            <div className={styles.imgBox}>
                                <img className={styles.userImg} src={fruitInfo.img.user} alt={`${fruitInfo.user} picture`} />
                            </div>
                        </div>

                    </div>


                    <div className={styles.sectionWrapper}>
                        <div className={styles.wrapper1x3}>
                            {/* <div>
                                <span className={styles.sectionTitle}>⚔️ Abilities</span>
                                {fruitInfo.abilities.map((ablt, idx) => {
                                    return (
                                        <>
                                            <p className={styles.text}>• {ablt}</p>
                                            {idx === fruitInfo.abilities.length - 1 ? null : <br />}
                                        </>
                                    )
                                })}

                            </div> */}

                            <div>
                                <span className={styles.sectionTitle}>🛡️ Strengths</span>
                                {fruitInfo.strengths.map((ablt, idx) => {
                                    return (
                                        <>
                                            <p className={styles.text}>✓ {ablt}</p>
                                            {idx === fruitInfo.strengths.length - 1 ? null : <br />}
                                        </>
                                    )
                                })}
                            </div>


                            <div>
                                <span className={styles.sectionTitle}>⚠️ Weaknesses</span>
                                {fruitInfo.weaknesses.map((ablt, idx) => {
                                    return (
                                        <>
                                            <p className={styles.text}>✘ {ablt}</p>
                                            {idx === fruitInfo.weaknesses.length - 1 ? null : <br />}
                                        </>
                                    )
                                })}
                            </div>

                        </div>

                    </div>


                    <div className={`${styles.sectionWrapper} ${styles.sectionOutline}`}>
                        <span className={styles.sectionTitle}>📊 Stats</span>
                        <div className={styles.spacer20px}></div>

                        <div className={styles.wrapper4x4}>

                            <div className={styles.statWrapper}>
                                <div className={styles.statCopyWrapper}>
                                    <p>Attack</p>
                                    <p>{fruitInfo.ratings.attack}/100</p>
                                </div>
                                <div className={styles.statBarWrapper}>
                                    <div></div>
                                    <div style={{ width: `${fruitInfo?.ratings?.attack ?? 0}%` }} />
                                </div>
                            </div>

                            <div className={styles.statWrapper}>
                                <div className={styles.statCopyWrapper}>
                                    <p>Utility</p>
                                    <p>{fruitInfo.ratings.utility}/100</p>
                                </div>
                                <div className={styles.statBarWrapper}>
                                    <div></div>
                                    <div style={{ width: `${fruitInfo?.ratings?.utility ?? 0}%` }} />
                                </div>
                            </div>

                            <div className={styles.statWrapper}>
                                <div className={styles.statCopyWrapper}>
                                    <p>Defense</p>
                                    <p>{fruitInfo.ratings.defense}/100</p>
                                </div>
                                <div className={styles.statBarWrapper}>
                                    <div></div>
                                    <div style={{ width: `${fruitInfo?.ratings?.defense ?? 0}%` }} />
                                </div>
                            </div>

                            <div className={styles.statWrapper}>
                                <div className={styles.statCopyWrapper}>
                                    <p>Rarity</p>
                                    <div className={styles.rarityStarWrapper}>

                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill={fruitInfo.rarity >= 1 ? 'yellow' : '#4d78a5'} class="bi bi-star-fill" viewBox="0 0 16 16">
                                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill={fruitInfo.rarity >= 2 ? 'yellow' : '#4d78a5'} class="bi bi-star-fill" viewBox="0 0 16 16">
                                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill={fruitInfo.rarity >= 3 ? 'yellow' : '#4d78a5'} class="bi bi-star-fill" viewBox="0 0 16 16">
                                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill={fruitInfo.rarity >= 4 ? 'yellow' : '#4d78a5'} class="bi bi-star-fill" viewBox="0 0 16 16">
                                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill={fruitInfo.rarity >= 5 ? 'yellow' : '#4d78a5'} class="bi bi-star-fill" viewBox="0 0 16 16">
                                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                        </svg>

                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>



                    {fruitInfo.images.length > 0 &&

                        <div className={styles.sectionWrapper}>
                            <div className={styles.carrosselWrapper}>
                                <div className={styles.carroComands}>
                                    {!imageLoaded ? (
                                        <div className={styles.loader}></div>
                                    ) : (
                                        <>
                                            {shownImageCarro === 0 ? <div></div> : (
                                                <svg onClick={() => updateImageCarro('back')} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left-short" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5" /> </svg>
                                            )}
                                            {shownImageCarro === fruitInfo.images.length - 1 ? <div></div> : (
                                                <svg onClick={() => updateImageCarro('next')} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-short" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8" /> </svg>
                                            )}
                                        </>
                                    )}
                                </div>

                                <img
                                    className={styles.carrosselImg}
                                    src={fruitInfo.images[shownImageCarro]}
                                    onLoad={() => setImageLoaded(true)}
                                    alt={`example of ${fruitInfo.name}`}
                                />
                            </div>


                        </div>

                    }

                    <div className={styles.sectionWrapper}>
                        <span className={styles.sectionTitle}>✨ Other fruits you might like</span>
                        <div className={styles.otherFruitsWrapper}>
                            {otherFruits.map(fruit => {
                                return (
                                    <div
                                        onClick={() => { navigate(`/fruit/${fruit.id}`); window.scrollTo(0, 0) }}
                                        className={styles.otherFruitsSingle}
                                        style={{
                                            backgroundImage: `linear-gradient(rgba(8,18,60,0.60), rgba(8,18,60,0.90)), url(${fruit.img.user})`
                                        }}
                                    >
                                        <img className={styles.otherfruitImg} src={fruit.img.fruit || 'https://i.postimg.cc/Sxp09zGS/unkown.png'} alt={`${fruit.name} picture`} />
                                        <h2>{fruit.name}</h2>
                                    </div>
                                )
                            })}
                        </div>
                    </div>


                </div>
            )}
            <Footer />
        </>
    );
}
