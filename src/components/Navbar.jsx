import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import AuthModal from './AuthModal';

export default function Navbar() {
    const { totalItems, setIsCartOpen } = useCart();
    const { user, logout } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    return (
        <nav className="navbar">
            <div className="container">
                <Link to="/" className="nav-brand">
                    <Logo size={40} />
                    <span style={{ marginLeft: '4px', letterSpacing: '1px' }}>Noor Creation</span>
                </Link>

                <div className="nav-search">
                    <input
                        type="text"
                        placeholder="Search for gifts, flowers..."
                    />
                </div>

                <div className="nav-actions" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    {user ? (
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{user.displayName || 'Giver'}</div>
                                <button onClick={logout} style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: '600' }}>Logout</button>
                            </div>
                            <Link to="/tracking" style={{ fontSize: '1.2rem', textDecoration: 'none' }}>📦</Link>
                        </div>
                    ) : (
                        <button className="admin-back-btn" style={{ padding: '0.5rem 1.2rem' }} onClick={() => setIsAuthModalOpen(true)}>
                            Login
                        </button>
                    )}

                    <button className="nav-cart-btn" onClick={() => setIsCartOpen(true)}>
                        <span>🛍️</span>
                        <span>Cart</span>
                        {totalItems > 0 && (
                            <span className="cart-count">{totalItems}</span>
                        )}
                    </button>
                </div>
            </div>

            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </nav>
    );
}
