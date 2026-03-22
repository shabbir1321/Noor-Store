import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const [currentImage, setCurrentImage] = useState('');
    const [selectedColor, setSelectedColor] = useState('#000000');
    const [customText, setCustomText] = useState('');
    const [logoPreview, setLogoPreview] = useState(null);
    const [isAdded, setIsAdded] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const docRef = doc(db, "products", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setProduct({ id: docSnap.id, ...data });
                    setCurrentImage(data.img || '');
                    if (data.colors && data.colors.length > 0) {
                        setSelectedColor(data.colors[0]);
                    }
                } else {
                    console.log("No such product!");
                }
            } catch (err) {
                console.error("Error fetching product:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setLogoPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleAddToCart = () => {
        addToCart(product, 1);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    if (loading) {
        return (
            <div className="pdp-page">
                <Navbar />
                <div className="pdp-container" style={{ textAlign: 'center', padding: '100px' }}>
                    <div className="skeleton" style={{ height: '400px', width: '100%', borderRadius: '20px', background: '#eee' }}></div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="pdp-not-found">
                <Navbar />
                <div className="pdp-not-found-content">
                    <h2>Product Not Found</h2>
                    <p>We couldn't find the product you're looking for.</p>
                    <Link to="/products" className="btn-back">Return to Shop</Link>
                </div>
                <Footer />
            </div>
        );
    }

    const productColors = product.colors || ['#ffffff', '#000000', '#3b82f6', '#ef4444'];

    return (
        <div className="pdp-page">
            <Navbar />

            <div className="pdp-container">
                {/* BREADCRUMB */}
                <nav className="pdp-breadcrumb">
                    <Link to="/">Home</Link>
                    <span>/</span>
                    <Link to="/products">Catalog</Link>
                    <span>/</span>
                    <span>{product.name}</span>
                </nav>

                <main className="pdp-main">
                    {/* LEFT: IMAGE PANEL */}
                    <div className="pdp-image-container">
                        <div className="pdp-image-wrap">
                            <img src={currentImage} alt={product.name} />

                            <div className="pdp-image-controls">
                                <button className="pdp-img-btn" title="Zoom">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
                                    </svg>
                                </button>
                                <button className="pdp-img-btn" title="Rotate">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M23 4v6h-6" /><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        {product.images && product.images.length > 1 && (
                            <div className="pdp-gallery">
                                {product.images.map((imgUrl, idx) => (
                                    <div 
                                        key={idx} 
                                        className={`pdp-thumbnail ${currentImage === imgUrl ? 'active' : ''}`}
                                        onClick={() => setCurrentImage(imgUrl)}
                                    >
                                        <img src={imgUrl} alt={`${product.name} view ${idx + 1}`} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT: CUSTOMIZER PANEL */}
                    <div className="pdp-customizer">
                        <header className="pdp-header">
                            <h1 className="pdp-name">{product.name}</h1>
                            <p className="pdp-subtitle">{product.category} • Premium Quality</p>
                        </header>

                        {/* CONDITIONAL COLOR VARIANTS (IMAGE SWAPPING) */}
                        {product.colorVariants && product.colorVariants.length > 0 && (
                            <div className="pdp-section pdp-dynamic-colors">
                                <label className="pdp-step-label">Available Colors</label>
                                <div className="pdp-colors">
                                    {product.colorVariants.map(variant => (
                                        <button
                                            key={variant.name}
                                            className={`pdp-color-swatch pdp-color-image ${currentImage === variant.imgUrl ? 'active' : ''}`}
                                            onClick={() => setCurrentImage(variant.imgUrl)}
                                            title={variant.name}
                                        >
                                            <img src={variant.imgUrl} alt={variant.name} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* SIMPLE COLOR SELECTION (NO IMAGE SWAP) */}
                        {!product.colorVariants && product.colors && product.colors.length > 0 && (
                            <div className="pdp-section pdp-simple-colors">
                                <label className="pdp-step-label">Select Color</label>
                                <div className="pdp-colors">
                                    {product.colors.map(color => (
                                        <button
                                            key={color}
                                            className={`pdp-color-swatch ${selectedColor === color ? 'active' : ''}`}
                                            onClick={() => setSelectedColor(color)}
                                            style={{ backgroundColor: color }}
                                            title={color}
                                        />
                                    ))}
                                </div>
                                <p className="pdp-selected-color-name">Selected: {selectedColor}</p>
                            </div>
                        )}


                        <div className="pdp-section">
                            <label className="pdp-step-label">Add Customization</label>
                            <div className="pdp-customizer-box">
                                <div className="pdp-upload-area" onClick={() => document.getElementById('logo-file').click()}>
                                    <input type="file" id="logo-file" hidden onChange={handleLogoUpload} accept="image/*" />
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4m4-5l5-5 5 5m-5-5v12" />
                                    </svg>
                                    <span>{logoPreview ? "Change Logo" : "Upload Your Logo"}</span>
                                    {logoPreview && <div className="upload-success">✓ Logo Attached</div>}
                                </div>

                                <div style={{ marginTop: '20px' }}>
                                    <input
                                        type="text"
                                        className="pdp-text-input"
                                        placeholder="Add custom text..."
                                        value={customText}
                                        onChange={(e) => setCustomText(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pdp-description-section">
                            <h3 className="pdp-section-title">Description</h3>
                            <p className="pdp-description-text">{product.desc}</p>
                        </div>

                        <div className="pdp-total">
                            <span className="pdp-total-price">₹{product.price}</span>
                        </div>

                        <div className="pdp-actions">
                            <button 
                                className={`pdp-add-to-cart-btn ${isAdded ? 'added' : ''}`} 
                                onClick={handleAddToCart}
                            >
                                {isAdded ? 'Added to Cart!' : `Add to Cart — ₹${product.price}`}
                            </button>
                            <a
                                href={`https://wa.me/YOUR_NUMBER?text=Hi, I am interested in ${product.name}`}
                                className="pdp-whatsapp-btn"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                <span>Inquire on WhatsApp</span>
                            </a>
                        </div>
                        <p className="pdp-shipping-note">Premium Studio-Grade Quality • Worldwide Delivery</p>
                    </div>
                </main>


            </div>

            <Footer />
        </div>
    );
};

export default ProductDetailPage;
