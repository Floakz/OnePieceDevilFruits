import { useState } from "react"
import { NavLink } from "react-router-dom"
import { FOOTER_NAVIGATION } from "../../lib/footerNavigation.js"

export default function Footer() {

    let [isThankOpen, setIsThankOpen] = useState(false)

    const personIcon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
    </svg>

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
            <div className="footer-button-wrapper">
                <div className="special-thanks-warpper">
                    {isThankOpen && <div id="footer-credits" className="special-thanks-box">
                        <h4>Content verification:</h4>
                        <div>
                            <p>{personIcon} Sewwwy</p>
                            <p>{personIcon} sergeant_pepper07</p>
                            <p>{personIcon} amohuseat</p>
                        </div>

                        <h4>Content & Art:</h4>
                        <div>
                            <p>{personIcon} MrCryandCheat</p>

                        </div>
                    </div>}
                    <button type="button" aria-expanded={isThankOpen} aria-controls={isThankOpen ? 'footer-credits' : undefined} onClick={() => setIsThankOpen(prev => !prev)} className="footer-btn">Special thanks</button>
                </div>
                <a href='#hero-title'>back to the top</a>
            </div>
        </footer>
    )
}
