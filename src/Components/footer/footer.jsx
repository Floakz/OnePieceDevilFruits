import { useState } from "react"

export default function Footer() {

    let [isThankOpen, setIsThankOpen] = useState(false)

    const personIcon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
    </svg>

    return (
        <footer>
            <h3>ONE PIECE DEVIL FRUITS . com</h3>

            <span className='emailFooter'>
                Anything missing or wrong?<br /><span> info@onepiecedevilfruits.com</span>
            </span>
            <div className="footer-button-wrapper">
                <div className="special-thanks-warpper">
                    {isThankOpen && <div className="special-thanks-box">
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
                    <span style={{ backgroundColor: isThankOpen ? 'rgba(54, 118, 255, 0.457)' : '' }} onClick={() => setIsThankOpen(prev => !prev)} className='footer-btn'>SPECIAL THANKS</span>
                </div>
                <a href='#hero-title'>back to the top</a>
            </div>
        </footer>
    )
}