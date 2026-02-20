import { useCart } from '../context/CartContext';

export default function Navbar() {
    const { totalItems, setIsCartOpen } = useCart();

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <div className="navbar-logo">
                    <span className="brand-name">🌸 Noor Creation</span>
                    <span className="brand-tagline">Premium Gift Shop</span>
                </div>
                {/* Cart button visible only on desktop (≥768px) */}
                <button
                    className="navbar-cart-btn"
                    onClick={() => setIsCartOpen(true)}
                    aria-label="Open cart"
                >
                    <span>🛍️</span>
                    <span>Cart</span>
                    {totalItems > 0 && (
                        <span className="cart-badge" key={totalItems}>{totalItems}</span>
                    )}
                </button>
            </div>
        </nav>
    );
}
