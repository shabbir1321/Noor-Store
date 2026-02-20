import { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);

    const handleAdd = () => {
        addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    const badgeClass =
        product.badge === 'Bestseller' || product.badge === 'Popular' || product.badge === 'Luxury' || product.badge === 'Premium'
            ? 'badge badge-gold'
            : 'badge badge-rose';

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <div className="product-card">
            <div className="product-image-wrap">
                <img src={product.image} alt={product.name} loading="lazy" />
                {product.badge && (
                    <div className="product-badge-wrap">
                        <span className={badgeClass}>{product.badge}</span>
                    </div>
                )}
                {discount > 0 && (
                    <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                        <span className="badge" style={{
                            background: 'rgba(192,82,90,0.15)',
                            border: '1px solid rgba(192,82,90,0.4)',
                            color: '#e07080',
                        }}>
                            -{discount}%
                        </span>
                    </div>
                )}
            </div>
            <div className="product-info">
                <div className="product-name">{product.name}</div>
                <div className="product-description">{product.description}</div>
                <div className="product-footer">
                    <div className="product-price-wrap">
                        <span className="product-price">₹{product.price.toLocaleString('en-IN')}</span>
                        {product.originalPrice && (
                            <span className="product-original-price">
                                ₹{product.originalPrice.toLocaleString('en-IN')}
                            </span>
                        )}
                    </div>
                    <button
                        className={`add-to-cart-btn${added ? ' added' : ''}`}
                        onClick={handleAdd}
                        aria-label={`Add ${product.name} to cart`}
                    >
                        {added ? '✓ Added' : '+ Add'}
                    </button>
                </div>
            </div>
        </div>
    );
}
