import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from './firebase';
import { collection, onSnapshot, query, where, limit } from 'firebase/firestore';
import Navbar from './components/Navbar';
import './App.css';

function App() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const categoriesScrollRef = useRef(null);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const scrollCategories = (direction) => {
        if (categoriesScrollRef.current) {
            const scrollAmount = 400;
            categoriesScrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        // Fetch Categories
        const unsubCats = onSnapshot(collection(db, "categories"), (snap) => {
            const cats = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Fallback default images if not provided in Firestore
            const defaultImgs = [
                'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&q=80',
                'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=200&q=80',
                'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=200&q=80',
                'https://images.unsplash.com/photo-1571867424488-4565932edb41?w=200&q=80'
            ];
            setCategories(cats.map((c, i) => ({
                ...c,
                img: c.img || defaultImgs[i % defaultImgs.length]
            })));
        });

        // Fetch Featured Products (only active ones)
        const qFeatured = query(
            collection(db, "products"),
            where("isFeatured", "==", true),
            where("status", "==", "active"),
            limit(3)
        );
        const unsubFeatured = onSnapshot(qFeatured, (snap) => {
            const products = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setFeaturedProducts(products);
            setLoading(false);
        });

        return () => {
            unsubCats();
            unsubFeatured();
        };
    }, []);


    return (
        <div className="app-container">
            <Navbar />

            <main>
                {/* HERO */}
                <section className="hero">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            Create Custom<br />
                            Products That<br />
                            <span className="hero-accent">Feel Premium</span>
                        </h1>
                        <p className="hero-desc">
                            Discover our curated collection of high-quality products. From apparel to premium drinkware, find the perfect canvas for your next project.
                        </p>
                        <div className="hero-btns">
                            <Link to="/products" className="btn-dark">Browse Catalog</Link>
                        </div>
                    </div>

                    <div className="hero-visual-container">
                        <div className="hero-visual-main">
                            <div className="visual-gift-box">
                                <div className="gift-lid"></div>
                                <div className="gift-ribbon-v"></div>
                                <div className="gift-ribbon-h"></div>
                                
                                {/* Hidden sparkles for hover pop */}
                                <div className="gift-sparkle h1"></div>
                                <div className="gift-sparkle h2"></div>
                                <div className="gift-sparkle h3"></div>
                            </div>
                            <div className="visual-floating-card card-1">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                                <span>Personalized</span>
                            </div>
                            <div className="visual-floating-card card-2">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                <span>Curated Quality</span>
                            </div>
                            <div className="visual-floating-card card-3">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                <span>Fast Delivery</span>
                            </div>
                            <div className="visual-floating-card card-4">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                                <span>Bespoke Design</span>
                            </div>
                            <div className="visual-sparkle s1"></div>
                            <div className="visual-sparkle s2"></div>
                            <div className="visual-sparkle s3"></div>
                            
                            <div className="visual-abstract-circle"></div>
                        </div>
                        <div className="hero-visual-bg-glow"></div>
                    </div>

                    <div className="scroll-indicator" onClick={() => document.querySelector('.categories-section').scrollIntoView({ behavior: 'smooth' })}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 13l5 5 5-5M7 6l5 5 5-5"/></svg>
                    </div>
                </section>

                {/* EXPLORE CATEGORIES */}
                <section className="categories-section">
                    <div className="section-top">
                        <div className="section-title-group">
                            <h2 className="section-heading">Explore Categories</h2>
                            <p className="section-sub">Curated categories for every personalization need.</p>
                        </div>
                        <div className="section-actions">
                            <Link to="/products" className="view-all">View All Products</Link>
                            <div className="category-slider-nav">
                                <button className="cat-nav-btn prev" onClick={() => scrollCategories('left')} aria-label="Previous Category">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                                </button>
                                <button className="cat-nav-btn next" onClick={() => scrollCategories('right')} aria-label="Next Category">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="categories-scroll-wrapper" ref={categoriesScrollRef}>
                        <div className="categories-row">
                            {categories.length > 0 ? (
                                categories.map((cat) => (
                                    <Link to={`/products?category=${cat.name}`} className="cat-card" key={cat.id}>
                                        <div className="cat-card-img">
                                            <img src={cat.img} alt={cat.name} />
                                            <div className="cat-card-overlay">
                                                <span className="cat-card-tag">Explore</span>
                                            </div>
                                        </div>
                                        <div className="cat-card-info">
                                            <h3 className="cat-card-name">{cat.name}</h3>
                                            <span className="cat-card-link">View Collection</span>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                [1, 2, 3, 4].map(i => <div key={i} className="cat-card skeleton" style={{ minWidth: '280px', height: '380px', background: 'var(--color-silver)', borderRadius: '4px' }} />)
                            )}

                            {/* CORPORATE ENTRY CARD */}
                            <Link to="/corporate" className="cat-card corp-entry-card">
                                <div className="cat-card-img">
                                    <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80" alt="Corporate Solutions" />
                                    <div className="cat-card-overlay">
                                        <span className="cat-card-tag accent">Business</span>
                                    </div>
                                </div>
                                <div className="cat-card-info">
                                    <h3 className="cat-card-name">Corporate & Bulk</h3>
                                    <span className="cat-card-link">Specialized Inquiry</span>
                                </div>
                            </Link>
                        </div>
                    </div>
                </section>


                {/* HOW IT WORKS */}
                <section id="how-it-works" className="how-works-section">
                    <p className="how-label">HOW IT WORKS</p>
                    <div className="how-steps">
                        <Link to="/products" className="how-step how-step-link">
                            <div className="how-icon">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
                                </svg>
                            </div>
                            <h3>Choose Product</h3>
                            <p>Select from our curated range of high-quality base items.</p>
                        </Link>
                        <div className="how-step">
                            <div className="how-icon">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                                </svg>
                            </div>
                            <h3>Customize Design</h3>
                            <p>Upload your logo or use our templates to design in real time.</p>
                        </div>
                        <div className="how-step">
                            <div className="how-icon">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
                                </svg>
                            </div>
                            <h3>Doorstep Delivery</h3>
                            <p>Your creation is printed with care and delivered in 3-5 business days.</p>
                        </div>
                    </div>
                </section>



                {/* FEATURED DESIGNS */}
                <section className="featured-section">
                    <h2 className="section-heading centered-heading">Featured Designs</h2>
                    <div className="featured-row">
                        {featuredProducts.length > 0 ? (
                            featuredProducts.map((p) => (
                                <Link to={`/product/${p.id}`} className="product-card" key={p.id}>
                                    <div className="product-img">
                                        <img src={p.img} alt={p.name} />
                                    </div>
                                    <div className="product-info">
                                        <span className="product-name">{p.name}</span>
                                        <span className="product-price">₹{p.price}</span>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <p className="no-featured">No featured products yet.</p>
                        )}
                    </div>
                </section>

                {/* CORPORATE CTA */}
                <section className="corporate-section">
                    <p className="corp-label">FOR BUSINESS</p>
                    <h2 className="corp-title">
                        Custom Merchandise for<br />Businesses &amp; Events
                    </h2>
                    <p className="corp-desc">
                        Bulk orders, employee kits, and corporate branding. Get premium quality products with exclusive corporate pricing and dedicated support.
                    </p>
                    <div className="corp-btns">
                        <Link to="/corporate" className="btn-white">Request Quote</Link>
                        <Link to="/products" className="btn-outline-white">Browse Catalog</Link>
                    </div>
                </section>
            </main>

            {/* FOOTER */}
            <footer className="footer">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">
                            <div className="logo-icon-sm">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                                </svg>
                            </div>
                            <span>Noor Creation</span>
                        </Link>
                        <p>Making premium custom products accessible to everyone. Quality you can feel, designs you can call yours.</p>
                    </div>
                    <div className="footer-col">
                        <h4>Explore</h4>
                        <ul>
                            <li><Link to="/products?category=Apparel">Custom Apparel</Link></li>
                            <li><Link to="/products?category=Drinkware">Premium Drinkware</Link></li>
                            <li><Link to="/products?category=Office">Office & Stationeries</Link></li>
                            <li><Link to="/products?category=Accessories">Bespoke Accessories</Link></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Company</h4>
                        <ul>
                            <li><a href="#about">About Our Story</a></li>
                            <li><a href="#how-it-works">How We Deliver</a></li>
                            <li><Link to="/corporate">Corporate Inquiry</Link></li>
                            <li><a href="https://wa.me/yournumber">Contact Concierge</a></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Legal</h4>
                        <ul>
                            <li><Link to="/">Terms of Service</Link></li>
                            <li><Link to="/">Shipping Policy</Link></li>
                            <li><Link to="/">Returns & Refunds</Link></li>
                            <li><Link to="/">Privacy Strategy</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2024 Noor Creation. All rights reserved.</p>
                    <div className="footer-socials">
                        <span className="social-dot"></span>
                        <span className="social-dot"></span>
                        <span className="social-dot"></span>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;
