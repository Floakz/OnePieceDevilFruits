// Header.jsx
import "../../App.css"
import { NavLink, useNavigate } from "react-router-dom";
import SearchBar from "../searchBar/searchBar";

export default function Header({ headerShown }) {

    const navigate = useNavigate()




    return (
        <>
            <header>
                <small className="headerDisclouser" id="hero-title">
                    Fan-made page | Opinions ahead, handle with care.
                </small>
            </header>

            <nav>
                <div className="navSection">
                    <img
                        onClick={() => navigate('/')}
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
                            to="/community"
                            className={({ isActive }) => `menuOption ${isActive ? "isActive" : ""}`}
                        >
                            COMMUNITY
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

                        <NavLink
                            to="/daily-fight"
                            className={({ isActive }) => `menuOption ${isActive ? "isActive" : ""}`}
                        >
                            Daily Fight
                        </NavLink>
                    </div>
                </div>

                {headerShown &&
                    <>
                        <h1>
                            Devil Fruits <br /> <span className="colorYellow">Uncovered</span>
                        </h1>
                        <small className="pageSubTitle">
                            Discover the powers and the USERS who wield them
                        </small>
                        <SearchBar />
                    </>}
            </nav>
        </>
    );
}
