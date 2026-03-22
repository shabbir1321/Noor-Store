import React from 'react';
import './Footer.css';

const Footer = () => (
    <footer className="footer">
        <div className="footer-grid">
            <div className="footer-brand">
                <div className="footer-logo">
                    <div className="logo-icon-sm">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                        </svg>
                    </div>
                    <span>Noor Creation</span>
                </div>
                <p>Premium customizable essentials for the modern lifestyle. Quality you can feel, design you can see.</p>
                <div className="footer-social-icons">
                    <span className="social-icon">🌐</span>
                    <span className="social-icon">✉</span>
                    <span className="social-icon">↗</span>
                </div>
            </div>
            <div className="footer-col">
                <h4>Shop</h4>
                <ul>
                    <li><a href="#">New Arrivals</a></li>
                    <li><a href="#">Mugs &amp; Cups</a></li>
                    <li><a href="#">Water Bottles</a></li>
                    <li><a href="#">Tech Accessories</a></li>
                </ul>
            </div>
            <div className="footer-col">
                <h4>Company</h4>
                <ul>
                    <li><a href="#">Our Story</a></li>
                    <li><a href="#">Sustainability</a></li>
                    <li><a href="#">Bulk Orders</a></li>
                    <li><a href="#">Contact</a></li>
                </ul>
            </div>
            <div className="footer-col">
                <h4>Support</h4>
                <ul>
                    <li><a href="#">Shipping Info</a></li>
                    <li><a href="#">Returns</a></li>
                    <li><a href="#">Customizer Help</a></li>
                    <li><a href="#">FAQ</a></li>
                </ul>
            </div>
        </div>
        <div className="footer-bottom">
            <p>© 2024 Noor Creation. All rights reserved.</p>
            <div className="footer-bottom-right">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
            </div>
        </div>
    </footer>
);

export default Footer;
