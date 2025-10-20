import styles from './store.module.css'
import Seo from '../../Components/Seo'
import Header from '../../Components/header/Header'
import Footer from '../../Components/footer/footer'
import products from '../../lib/products'

export default function Store() {

    const bannerImgMockup = 'https://i.ibb.co/Kp5JZj6g/Banner-store.webp'

    return (
        <>
            <Seo
                title="One Piece Devil Fruit Products – Collectibles, Figures & Gifts"
                description="Discover the best One Piece Devil Fruit products inspired by the legendary anime! Find collectible figures, replicas, shirts, and gifts of your favorite Devil Fruits. Perfect for fans and collectors alike!"
                canonical="https://onepiecedevilfruits.com/treasure-chest"
            />

            <Header />




            <div className="mainFull">

                <div className={styles.introSectionWrapper}>
                    <h1>⚓ Explore One Piece inspired collectibles and gifts</h1>
                    <span>Perfect for fans, collectors, and crewmates alike! ☠️</span>
                </div>

                <div className={styles.storeBanner} style={{ backgroundImage: `url(${bannerImgMockup})` }}></div>

                <div className={styles.storePageWrapper}>



                    {/* <div className={styles.storeNavWrapper}>
                        <span>Categories:</span>
                        <button className={styles.storeNavButton}>Hot</button>
                        <button className={styles.storeNavButton}>Fruits</button>
                        <button className={styles.storeNavButton}>Crews</button>
                        <button className={styles.storeNavButton}>Other</button>
                    </div> */}

                    <div className={styles.mainPageWrapper}>


                        <div className={styles.storeGrid}>


                            {products && products.map((product, idx) => {
                                return (

                                    <a href={product.link} target='_blank'>
                                        <div key={`${product} ${idx}`} className={styles.productCard}>
                                            <div style={{ backgroundImage: `url(${product.img})` }} className={styles.productImageWrapper}></div>
                                            <div className={styles.productDescriptionWrapper}>
                                                <h2>{product.name}</h2>
                                                {/* <span className={styles.productDescription}>A realistic Mera Mera no Mi for your Devil Fruit shelf.</span> */}
                                                <button className={styles.viewStoreButton}>view on on store</button>

                                            </div>
                                        </div> </a>


                                )
                            })}
                        </div>

                    </div>
                </div>

            </div>
            <Footer />

        </>
    )
}