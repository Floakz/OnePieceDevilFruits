import { NavLink } from "react-router-dom"
import { FOOTER_NAVIGATION } from "../../lib/footerNavigation.js"

export default function Footer() {

    return (
        <footer className="site-footer">
            <div className="footer-intro">
                <p className="footer-brand">One Piece Devil Fruits</p>
                <p className="emailFooter">Anything missing or wrong?<br />
                    <a href="mailto:info@onepiecedevilfruits.com">info@onepiecedevilfruits.com</a>
                </p>
            </div>

            <nav className="footer-navigation" aria-label="Footer">
                {FOOTER_NAVIGATION.map(([heading, links]) => <div key={heading}>
                    <h2>{heading}</h2>
                    <ul>
                        {links.map(([label, path]) => <li key={path}><NavLink to={path} end>{label}</NavLink></li>)}
                    </ul>
                </div>)}
            </nav>
        </footer>
    )
}
