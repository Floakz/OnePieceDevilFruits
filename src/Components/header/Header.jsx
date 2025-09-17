// Header.jsx
import "../../App.css"
import { NavLink } from "react-router-dom";

export default function Header() {
    return (
        <>
            <header>
                <small className="headerDisclouser" id="hero-title">
                    Fan-made page | Opinions ahead, handle with care.
                </small>
            </header>

            <nav>
                <h1>
                    Devil Fruits <br /> <span className="colorYellow">Uncovered</span>
                </h1>
                <small className="pageSubTitle">
                    Discover the powers and the USERS who wield them
                </small>

                <div className="navSection">
                    <img
                        src="https://i.ibb.co/7xzkFDts/OPDV-COM-LOGO.png"
                        alt="Onepiecedevilfruits.com logo"
                    />

                    <div className="menuWrapper">
                        <NavLink
                            to="/"
                            className={({ isActive }) => `menuOption ${isActive ? "isActive" : ""}`}
                        >
                            All
                        </NavLink>

                        <NavLink
                            to="/paramecia"
                            className={({ isActive }) => `menuOption ${isActive ? "isActive" : ""}`}
                        >
                            PARAMECIA
                        </NavLink>

                        <NavLink
                            to="/logia"
                            className={({ isActive }) => `menuOption ${isActive ? "isActive" : ""}`}
                        >
                            LOGIA
                        </NavLink>

                        <NavLink
                            to="/zoan"
                            className={({ isActive }) => `menuOption ${isActive ? "isActive" : ""}`}
                        >
                            ZOAN
                        </NavLink>

                        <span>|</span>

                        <NavLink
                            to="/random-fruit"
                            className={({ isActive }) => `menuOption ${isActive ? "isActive" : ""}`}
                        >
                            FRUIT FINDER
                        </NavLink>

                        <NavLink
                            to="/fruit-battle"
                            className={({ isActive }) => `fruitBattleMenuItem menuOption ${isActive ? "isActive" : ""}`}
                        >
                            FRUIT BATTLE
                        </NavLink>


                        <NavLink
                            to="/grand-run"
                            className={({ isActive }) => `menuOption ${isActive ? "isActive" : ""}`}
                        >
                            GRAND RUN
                        </NavLink>
                    </div>
                </div>
            </nav>
        </>
    );
}
