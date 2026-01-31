// Header.jsx
import "../../App.css"
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import SearchBar from "../searchBar/searchBar";
import styles from './header.module.css'
import { useState, useEffect } from "react";

function useViewportWidth() {
    const [w, setW] = useState(() => window.innerWidth);
    useEffect(() => {
        const onResize = () => setW(window.innerWidth);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);
    return w;
}



function useScrollLock(isLocked) {
    useEffect(() => {
        const html = document.documentElement;
        const body = document.body;

        const lock = () => {
            const scrollY = window.scrollY || window.pageYOffset;
            body.dataset.scrollY = String(scrollY);

            // Prevent background scroll & keep visual position
            body.style.position = "fixed";
            body.style.top = `-${scrollY}px`;
            body.style.left = "0";
            body.style.right = "0";
            body.style.width = "100%";
            body.style.overflow = "hidden";

            // Tame overscroll/bounce on mobile
            html.style.overscrollBehavior = "contain";
        };

        const unlock = () => {
            const y = parseInt(body.dataset.scrollY || "0", 10);

            body.style.position = "";
            body.style.top = "";
            body.style.left = "";
            body.style.right = "";
            body.style.width = "";
            body.style.overflow = "";
            html.style.overscrollBehavior = "";

            // Restore previous scroll position
            window.scrollTo(0, y);
            delete body.dataset.scrollY;
        };

        if (isLocked) lock();
        else unlock();

        return () => unlock(); // cleanup on unmount
    }, [isLocked]);
}


export default function Header({ headerShown, headerTitle }) {

    let [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    let [discordTag, setDiscordTag] = useState(false)

    const navigate = useNavigate()

    const width = useViewportWidth();

    const menuIcon = <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 16 16"><path fill="currentColor" d="M1 3h14v3H1zm0 4h14v3H1zm0 4h14v3H1z" /></svg>
    const closeIcon = <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 16 16"><path fill="currentColor" d="m3.5 2.086l4.5 4.5l4.5-4.5L13.914 3.5L9.414 8l4.5 4.5l-1.414 1.414l-4.5-4.5l-4.5 4.5L2.086 12.5l4.5-4.5l-4.5-4.5z" /></svg>

    const arrowDownIco = <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" className="bi bi-caret-down-fill" viewBox="0 0 16 16">
        <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
    </svg>

    const location = useLocation();

    const isMiniGamesActive =
        location.pathname.startsWith("/random-fruit") ||
        location.pathname.startsWith("/fruit-battle")


    const isDevilFruitsActive =
        location.pathname === "/" ||
        location.pathname.startsWith("/paramecia") ||
        location.pathname.startsWith("/logia") ||
        location.pathname.startsWith("/zoan") ||
        location.pathname.startsWith("/community")



    useScrollLock(isMobileMenuOpen);



    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    return (
        <>
            <header>
                <small className="headerDisclouser" id="hero-title">
                    Fan-made page | Opinions ahead, handle with care.
                </small>
            </header>

            <nav>

                {width > 900 ?

                    <div className="navSection">
                        <img
                            onClick={() => navigate('/')}
                            src="https://i.ibb.co/7xzkFDts/OPDV-COM-LOGO.png"
                            alt="Onepiecedevilfruits.com logo"
                        />

                        <div className="menuWrapper">

                            <div className={`menuOption ${isDevilFruitsActive ? "isActive" : ""} ${styles.OptionWrapper}`}>
                                <span tabIndex={0}>Devil fruits {arrowDownIco}</span>

                                <div className={styles.menuItemDropdownWrapper}>
                                    <NavLink
                                        to="/"
                                        className={({ isActive }) => ` ${isActive ? styles.dropItemActive : ""} ${styles.dropdownItem}`}
                                    >
                                        All Fruits
                                    </NavLink>

                                    <NavLink
                                        to="/paramecia"
                                        className={({ isActive }) => ` ${isActive ? styles.dropItemActive : ""} ${styles.dropdownItem}`}
                                    >
                                        PARAMECIA
                                    </NavLink>

                                    <NavLink
                                        to="/logia"
                                        className={({ isActive }) => ` ${isActive ? styles.dropItemActive : ""} ${styles.dropdownItem}`}
                                    >
                                        LOGIA
                                    </NavLink>

                                    <NavLink
                                        to="/zoan"
                                        className={({ isActive }) => ` ${isActive ? styles.dropItemActive : ""} ${styles.dropdownItem}`}
                                    >
                                        ZOAN
                                    </NavLink>


                                    <NavLink
                                        to="/community"
                                        className={({ isActive }) => ` ${isActive ? styles.dropItemActive : ""} ${styles.dropdownItem}`}
                                    >
                                        COMMUNITY
                                    </NavLink>

                                </div>

                            </div>


                            <div className={`menuOption ${isMiniGamesActive ? "isActive" : ""} ${styles.OptionWrapper}`}>
                                <span>Pirate Games {arrowDownIco}</span>

                                <div className={styles.menuItemDropdownWrapper}>

                                    <NavLink
                                        to="/random-fruit"
                                        className={({ isActive }) => ` ${isActive ? styles.dropItemActive : ""} ${styles.dropdownItem}`}
                                    >
                                        FRUIT FINDER
                                    </NavLink>

                                    <NavLink
                                        to="/fruit-battle"
                                        className={({ isActive }) => ` ${isActive ? styles.dropItemActive : ""} ${styles.dropdownItem}`}
                                    >
                                        FRUIT BATTLE
                                    </NavLink>




                                </div>

                            </div>

                            <NavLink
                                to="/grand-run"
                                className={({ isActive }) => `menuOption ${isActive ? "isActive" : ""}`}
                            >
                                GRAND RUN
                            </NavLink>


                            <NavLink
                                to="/daily-fight"
                                className={({ isActive }) => `menuOption ${isActive ? "isActive" : ""}`}
                            >
                                Daily Fight
                            </NavLink>


                            <NavLink
                                to="/treasure-chest"
                                className={({ isActive }) => `menuOption ${isActive ? "isActive" : ""}`}
                            >
                                Treasure Chest
                            </NavLink>


                        </div>
                    </div>

                    :
                    <>
                        {isMobileMenuOpen && <div className={styles.fullPageMenu}>

                            <NavLink
                                to="/"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={({ isActive }) => ` ${isActive ? styles.dropItemActive : ""} ${styles.dropdownItem}`}
                            >
                                All Fruits
                            </NavLink>

                            <NavLink
                                to="/paramecia"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={({ isActive }) => ` ${isActive ? styles.dropItemActive : ""} ${styles.dropdownItem}`}
                            >
                                PARAMECIA
                            </NavLink>

                            <NavLink
                                to="/logia"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={({ isActive }) => ` ${isActive ? styles.dropItemActive : ""} ${styles.dropdownItem}`}
                            >
                                LOGIA
                            </NavLink>

                            <NavLink
                                to="/zoan"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={({ isActive }) => ` ${isActive ? styles.dropItemActive : ""} ${styles.dropdownItem}`}
                            >
                                ZOAN
                            </NavLink>


                            <NavLink
                                to="/community"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={({ isActive }) => ` ${isActive ? styles.dropItemActive : ""} ${styles.dropdownItem}`}
                            >
                                COMMUNITY
                            </NavLink>

                            <NavLink
                                to="/random-fruit"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={({ isActive }) => ` ${isActive ? styles.dropItemActive : ""} ${styles.dropdownItem}`}
                            >
                                FRUIT FINDER
                            </NavLink>


                            <NavLink
                                to="/grand-run"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={({ isActive }) => ` ${isActive ? styles.dropItemActive : ""} ${styles.dropdownItem}`}
                            >
                                GRAND RUN
                            </NavLink>

                            <NavLink
                                to="/daily-fight"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={({ isActive }) => ` ${isActive ? styles.dropItemActive : ""} ${styles.dropdownItem}`}
                            >
                                Daily Fight
                            </NavLink>

                            <NavLink
                                to="/treasure-chest"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={({ isActive }) => ` ${isActive ? styles.dropItemActive : ""} ${styles.dropdownItem}`}
                            >
                                Treasure Chest
                            </NavLink>

                        </div>}
                        <div onClick={() => setIsMobileMenuOpen(prev => !prev)} className={styles.mobileMenuButton}>
                            {isMobileMenuOpen ? closeIcon : menuIcon}
                        </div>
                    </>
                }

                {headerShown &&
                    <>

                        {headerTitle ? <h1>{headerTitle}</h1> : <h1>Devil Fruits <br /><span className="colorYellow">Uncovered</span> </h1>}


                        <small className="pageSubTitle">
                            Discover the powers and the USERS who wield them
                        </small>
                        <SearchBar />
                    </>}

                <div onClick={e => { e.preventDefault(), window.open('https://discord.gg/vDy2cahP') }} onMouseOver={() => setDiscordTag(true)} onMouseOut={() => setDiscordTag(false)} className={styles.discordButton}>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-discord" viewBox="0 0 16 16">
                            <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612" />
                        </svg>
                    </div>
                    {discordTag && <span>Community Discord (Partner)</span>}
                </div>
            </nav>
        </>
    );
}
