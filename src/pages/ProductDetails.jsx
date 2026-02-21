import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart, setIsCartOpen } = useCart();
    const { user } = useAuth();
    const [activeImage, setActiveImage] = useState(0);
    const [added, setAdded] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const product = useMemo(() => {
        return products.find((p) => p.id === parseInt(id));
    }, [id]);

    if (!product) {
        return (
            <div className="container" style={{ padding: '8rem 1rem', textAlign: 'center' }}>
                <h2 style={{ color: 'var(--color-primary)' }}>Product not found</h2>
                <Link to="/" style={{ color: 'var(--color-primary)', marginTop: '1rem', display: 'inline-block' }}>
                    Return to Home
                </Link>
            </div>
        );
    }


    const handleAdd = async () => {
        if (!user) {
            setIsAuthModalOpen(true);
            return;
        }

        addToCart({ ...product });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const handleBuyNow = async () => {
        if (!user) {
            setIsAuthModalOpen(true);
            return;
        }

        addToCart({ ...product });
        setIsCartOpen(true);
        navigate('/checkout');
    };

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <div className="product-details-page">
            <div className="container" style={{ paddingTop: '3rem' }}>
                <div className="breadcrumb">
                    <Link to="/">Home</Link>
                    <span>/</span>
                    <Link to={`/category/${product.category}`}>{product.category}</Link>
                    <span>/</span>
                    <span>{product.name}</span>
                </div>

                <div className="details-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)', gap: '5rem' }}>

                    {/* Left: Product Images */}
                    <div className="gallery-section">
                        <div style={{ position: 'sticky', top: '120px' }}>
                            <div style={{
                                position: 'relative',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-md)',
                                padding: '2rem',
                                background: '#fff',
                                marginBottom: '1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minHeight: '400px'
                            }}>
                                <img
                                    src={product.gallery?.[activeImage] || product.image}
                                    alt={product.name}
                                    style={{ width: '100%', height: '400px', objectFit: 'contain' }}
                                />

                            </div>

                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                                {(product.gallery || [product.image]).map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        style={{
                                            width: '70px', height: '70px', padding: '4px',
                                            border: activeImage === idx ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                                            borderRadius: 'var(--radius-sm)', overflow: 'hidden'
                                        }}
                                    >
                                        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </button>
                                ))}
                            </div>

                            {/* Customization Controls */}
                            {product.isCustomizable && (
                                <div style={{
                                    marginTop: '2rem',
                                    padding: '1.5rem',
                                    border: '2px dashed var(--color-primary)',
                                    borderRadius: 'var(--radius-md)',
                                    background: 'rgba(212, 175, 55, 0.05)',
                                    textAlign: 'center'
                                }}>
                                    <h4 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>✨ Upload Your Print Design</h4>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-dim)', marginBottom: '1.2rem' }}>
                                        Upload the final file you want us to print on your {product.name.toLowerCase()}.
                                    </p>

                                    <label style={{
                                        display: 'inline-block',
                                        padding: '0.8rem 1.5rem',
                                        background: imageFile ? 'var(--color-success)' : 'var(--color-primary)',
                                        color: '#fff',
                                        borderRadius: 'var(--radius-sm)',
                                        cursor: 'pointer',
                                        fontWeight: '700',
                                        transition: 'var(--transition)'
                                    }}>
                                        {imageFile ? 'Change Design File' : 'Select Design File'}
                                        <input
                                            type="file"
                                            hidden
                                            accept="image/*,.pdf,.zip"
                                            onChange={handleImageUpload}
                                        />
                                    </label>

                                    {imageFile && (
                                        <div style={{ marginTop: '1rem', padding: '0.8rem', background: '#fff', borderRadius: '4px', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}>
                                            <span style={{ color: 'var(--color-success)', fontWeight: '700' }}>✔️ Selected:</span> {imageFile.name}
                                        </div>
                                    )}

                                    {!imageFile && (
                                        <p style={{ marginTop: '0.8rem', fontSize: '0.8rem', color: 'var(--color-text-dim)' }}>
                                            High-res PNG, JPG, PDF or ZIP supported
                                        </p>
                                    )}
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '3rem' }}>
                                <button
                                    className={`add-to-cart-btn ${added ? 'added' : ''}`}
                                    onClick={handleAdd}
                                    style={{ flex: 1, height: '60px', fontSize: '1rem', margin: 0 }}
                                >
                                    {added ? '✓ Added to Cart' : 'Add to Cart'}
                                </button>
                                <button
                                    className="carousel-btn"
                                    style={{ flex: 1, height: '60px', margin: 0 }}
                                    onClick={handleBuyNow}
                                >
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="info-section">
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{product.name}</h1>

                        <div style={{ display: 'flex', gap: '10px', marginBottom: '2rem' }}>
                            {product.badge && <span className="category-tab active" style={{ padding: '4px 12px', fontSize: '0.8rem', borderRadius: '4px', opacity: 1, transform: 'none' }}>{product.badge}</span>}
                            <span className="price-current" style={{ color: 'var(--color-primary)', fontSize: '1rem' }}>Premium Woodcraft</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '1.5rem', marginBottom: '2.5rem' }}>
                            <span className="price-current" style={{ fontSize: '2.5rem' }}>₹{product.price.toLocaleString('en-IN')}</span>
                            {product.originalPrice && (
                                <>
                                    <span className="price-old" style={{ fontSize: '1.2rem' }}>₹{product.originalPrice.toLocaleString('en-IN')}</span>
                                    <span style={{ color: 'var(--color-success)', fontWeight: '700', fontSize: '1.2rem' }}>
                                        {discount}% OFF
                                    </span>
                                </>
                            )}
                        </div>

                        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '2.5rem' }}>
                            <h3 style={{ marginBottom: '1rem' }}>Product Overview</h3>
                            <p style={{ color: 'var(--color-text-dim)', fontSize: '1.1rem', lineHeight: '1.8' }}>{product.fullDescription || product.description}</p>
                        </div>

                        {product.specifications && (
                            <div style={{ marginTop: '3rem' }}>
                                <h3>Specifications</h3>
                                <table className="specs-table">
                                    <tbody>
                                        {product.specifications.map((spec, idx) => (
                                            <tr key={idx}>
                                                <td>{spec.key}</td>
                                                <td>{spec.value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <div style={{ marginTop: '4rem', padding: '2rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <span style={{ fontSize: '2rem' }}>🛍️</span>
                            <div>
                                <h4 style={{ marginBottom: '0.25rem' }}>Secure Checkout</h4>
                                <p style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem' }}>We offer 100% safe payments and handcrafted quality guarantee.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </div>
    );
}
