import Header from '../../Components/header/Header.jsx';
import Footer from '../../Components/footer/footer.jsx';
import styles from './Poll.module.css';

export default function PollLayout({ children }) {
    return (
        <>
            <Header headerShown={false} />
            <div className={`mainFull ${styles.pollShell}`}>
                <main className={styles.page}>{children}</main>
            </div>
            <Footer />
        </>
    );
}
