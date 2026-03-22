import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
    const { cartCount } = useCart();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            navigate(`/products?search=${searchQuery}`);
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-container">
                    {/* Logo */}
                    <Link to="/" className="logo">
                        <div className="logo-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                            </svg>
                        </div>
                        <span>Noor Creation</span>
                    </Link>

                    {/* Desk Nav Links */}
                    <div className="nav-links">
                        <Link to="/products" className="nav-link">Products</Link>
                        <Link to="/about" className="nav-link">About</Link>
                    </div>

                    {/* Search */}
                    <div className="nav-search">
                        <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" onClick={() => navigate(`/products?search=${searchQuery}`)} style={{ cursor: 'pointer' }}>
                            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch}
                        />
                    </div>

                    {/* Right Actions */}
                    <div className="nav-actions">
                        <Link to="/cart" className="nav-icon-btn cart-btn" title="View Cart">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                            </svg>
                            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                        </Link>

                        {/* Hamburger for Mobile */}
                        <button className="hamburger" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Menu">
                            <div className={`bar ${isMobileMenuOpen ? 'open' : ''}`}></div>
                        </button>
                    </div>
                </div>

                {/* Mobile Dropdown */}
                <div className={`mobile-nav ${isMobileMenuOpen ? 'active' : ''}`}>
                    <div className="mobile-search">
                        <input
                            type="text"
                            placeholder="Search catalog..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch}
                        />
                    </div>
                    <Link to="/products" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>All Products</Link>
                    <Link to="/cart" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>My Cart ({cartCount})</Link>
                    <Link to="/about" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>About Our Story</Link>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
