import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const { user } = useAuth();
    const [added, setAdded] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const handleAdd = (e) => {
        e.preventDefault();
        if (!user) {
            setIsAuthModalOpen(true);
            return;
        }
        addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <Link to={`/product/${product.id}`} className="product-card">
            <div className="product-img-wrapper">
                <img src={product.image} alt={product.name} loading="lazy" />
                {discount > 0 && <span className="discount-badge">-{discount}% Off</span>}
                {product.badge && <span className="premium-badge">{product.badge}</span>}
            </div>
            <div className="product-info">
                <h3 className="product-title">{product.name}</h3>
                <div className="product-price-row">
                    <span className="price-current">₹{product.price.toLocaleString('en-IN')}</span>
                    {product.originalPrice && (
                        <span className="price-old">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                    )}
                </div>
                <button
                    className={`add-to-cart-btn ${added ? 'added' : ''}`}
                    onClick={handleAdd}
                >
                    {added ? '✓ Added to Cart' : 'Add to Cart'}
                </button>
            </div>
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </Link>
    );
}
