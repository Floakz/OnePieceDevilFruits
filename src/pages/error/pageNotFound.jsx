import Header from "../../Components/header/Header";
import styles from './error.module.css'
import Seo from "../../Components/Seo";
import Footer from "../../Components/footer/footer";

export default function PageNotFound() {

    return (
        <>
            <Seo title="Page not found" noindex canonical="https://onepiecedevilfruits.com/404" />

            <Header />
            <div className={styles.errorWrapper}>
                <h2>Your Log Pose seems to be broken!</h2>
                <span>The page you’re looking for might be lost at sea.</span>
            </div>
            <Footer />
        </>
    )
}