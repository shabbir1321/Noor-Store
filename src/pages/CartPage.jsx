import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './CartPage.css';

const CartPage = () => {
    const { cartItems, updateQuantity, removeFromCart, subtotal, tax, total, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [step, setStep] = useState('cart'); // 'cart', 'checkout', 'payment'
    const [isVerifying, setIsVerifying] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        email: '',
        address: '',
        city: '',
        state: '',
        pincode: ''
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
        else if (!/^\d{10}$/.test(formData.mobile.trim())) newErrors.mobile = 'Enter a valid 10-digit mobile number';
        
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';
        if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
        else if (!/^\d{6}$/.test(formData.pincode.trim())) newErrors.pincode = 'Enter a valid 6-digit pincode';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCheckout = async (e) => {
        if (e) e.preventDefault();
        
        if (step === 'cart') {
            setStep('checkout');
            window.scrollTo(0, 0);
            return;
        }

        if (step === 'checkout') {
            if (!validateForm()) return;
            setStep('payment');
            window.scrollTo(0, 0);
            return;
        }

        // Final submission (from payment step)
        setIsVerifying(true);
        setLoading(true);
        
        // Simulate payment verification delay
        await new Promise(resolve => setTimeout(resolve, 3500));

        try {
            const orderData = {
                customerDetails: formData,
                items: cartItems,
                subtotal: subtotal.toFixed(2),
                tax: tax.toFixed(2),
                total: total.toFixed(2),
                status: 'Processing',
                createdAt: serverTimestamp(),
                userId: auth.currentUser?.uid || 'guest',
                paymentMethod: 'UPI/QR'
            };

            await addDoc(collection(db, "orders"), orderData);
            setOrderSuccess(true);
            setIsVerifying(false);
            clearCart(); 

            setTimeout(() => {
                navigate('/');
            }, 4000);

        } catch (error) {
            console.error("Checkout error:", error);
            alert("There was an error processing your order. Please try again.");
            setIsVerifying(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cart-page">
            <Navbar />

            <div className="cart-container">
                <div className="cart-header">
                    <h1>
                        {isVerifying ? 'Verifying Payment' : (
                            <>
                                {step === 'cart' && 'Your Cart'}
                                {step === 'checkout' && 'Delivery Details'}
                                {step === 'payment' && 'Payment'}
                            </>
                        )}
                    </h1>
                    {step === 'cart' && !isVerifying && <span className="cart-count">{cartItems.length} items</span>}
                </div>

                <div className="cart-main">
                    {isVerifying ? (
                        <div className="payment-verifying-container">
                            <div className="verifying-content">
                                <div className="spinner"></div>
                                <h2>Payment in Process</h2>
                                <p>Please do not refresh the page or close the window.</p>
                                <p className="verifying-sub">We are verifying your transaction with the bank...</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {step === 'cart' && (
                                <div className="cart-items">
                                    {cartItems.length > 0 ? (
                                        cartItems.map((item) => (
                                            <div className="cart-item" key={item.id}>
                                                <div className="cart-item-img">
                                                    <img src={item.img} alt={item.name} />
                                                </div>
                                                <div className="cart-item-details">
                                                    <div className="cart-item-info">
                                                        <h3>{item.name}</h3>
                                                        <p>{item.desc}</p>
                                                        <div className="qty-controls">
                                                            <button onClick={() => updateQuantity(item.id, -1)}>−</button>
                                                            <span>{item.qty}</span>
                                                            <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                                                        </div>
                                                    </div>
                                                    <div className="cart-item-actions">
                                                        <span className="cart-item-price">₹{(item.price * item.qty).toFixed(2)}</span>
                                                        <button className="btn-remove" onClick={() => removeFromCart(item.id)}>
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="cart-empty">
                                            <p>Your cart is empty.</p>
                                            <Link to="/products" className="btn-browse-cart">Start Shopping</Link>
                                        </div>
                                    )}
                                    <Link to="/products" className="continue-link">
                                        ← Continue Shopping
                                    </Link>
                                </div>
                            )}

                            {step === 'checkout' && (
                                <div className="checkout-form-container">
                                    <form className="checkout-form">
                                        <div className="form-section">
                                            <h3>Contact Information</h3>
                                            <div className="form-group">
                                                <label>Full Name *</label>
                                                <input 
                                                    type="text" 
                                                    name="name" 
                                                    value={formData.name} 
                                                    onChange={handleInputChange} 
                                                    placeholder="Enter your full name"
                                                    className={errors.name ? 'error' : ''}
                                                />
                                                {errors.name && <span className="error-text">{errors.name}</span>}
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Mobile Number *</label>
                                                    <input 
                                                        type="tel" 
                                                        name="mobile" 
                                                        value={formData.mobile} 
                                                        onChange={handleInputChange} 
                                                        placeholder="10-digit mobile number"
                                                        className={errors.mobile ? 'error' : ''}
                                                    />
                                                    {errors.mobile && <span className="error-text">{errors.mobile}</span>}
                                                </div>
                                                <div className="form-group">
                                                    <label>Email Address (Optional)</label>
                                                    <input 
                                                        type="email" 
                                                        name="email" 
                                                        value={formData.email} 
                                                        onChange={handleInputChange} 
                                                        placeholder="your@email.com"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-section">
                                            <h3>Shipping Address</h3>
                                            <div className="form-group">
                                                <label>Complete Address *</label>
                                                <textarea 
                                                    name="address" 
                                                    value={formData.address} 
                                                    onChange={handleInputChange} 
                                                    placeholder="House No, Street, Landmark..."
                                                    className={errors.address ? 'error' : ''}
                                                />
                                                {errors.address && <span className="error-text">{errors.address}</span>}
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>City *</label>
                                                    <input 
                                                        type="text" 
                                                        name="city" 
                                                        value={formData.city} 
                                                        onChange={handleInputChange} 
                                                        placeholder="City"
                                                        className={errors.city ? 'error' : ''}
                                                    />
                                                    {errors.city && <span className="error-text">{errors.city}</span>}
                                                </div>
                                                <div className="form-group">
                                                    <label>Pincode *</label>
                                                    <input 
                                                        type="text" 
                                                        name="pincode" 
                                                        value={formData.pincode} 
                                                        onChange={handleInputChange} 
                                                        placeholder="6-digit pincode"
                                                        className={errors.pincode ? 'error' : ''}
                                                    />
                                                    {errors.pincode && <span className="error-text">{errors.pincode}</span>}
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>State *</label>
                                                <input 
                                                    type="text" 
                                                    name="state" 
                                                    value={formData.state} 
                                                    onChange={handleInputChange} 
                                                    placeholder="State"
                                                    className={errors.state ? 'error' : ''}
                                                />
                                                {errors.state && <span className="error-text">{errors.state}</span>}
                                            </div>
                                        </div>

                                        <button type="button" className="btn-back-to-cart" onClick={() => setStep('cart')}>
                                            ← Back to Cart
                                        </button>
                                    </form>
                                </div>
                            )}

                            {step === 'payment' && (
                                <div className="payment-screen-container">
                                    <div className="payment-content">
                                        <div className="qr-section">
                                            <div className="qr-wrapper">
                                                <img src="/payment_qr.png" alt="Payment QR Code" className="payment-qr-img" />
                                            </div>
                                            <div className="qr-info">
                                                <h3>Scan to Pay</h3>
                                                <p className="pay-amount">Pay ₹{total.toFixed(2)}</p>
                                                <p className="upi-id">UPI ID: <span>noorcreation@upi</span></p>
                                            </div>
                                        </div>
                                        <div className="payment-help">
                                            <p>Need help with payment? Contact us:</p>
                                            <p className="help-mobile">Mob: +91 9876543210</p>
                                        </div>
                                        <button type="button" className="btn-back-to-cart" onClick={() => setStep('checkout')}>
                                            ← Back to Details
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Order Summary */}
                    <div className="cart-summary">
                        <div className="summary-card">
                            <h2>Order Summary</h2>
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Shipping</span>
                                <span className="free">Free</span>
                            </div>
                            <div className="summary-row">
                                <span>Tax (18% GST)</span>
                                <span>₹{tax.toFixed(2)}</span>
                            </div>
                            <div className="summary-divider"></div>
                            <div className="summary-row total">
                                <span>Total</span>
                                <span>₹{total.toFixed(2)}</span>
                            </div>

                            <button
                                className="btn-checkout"
                                onClick={handleCheckout}
                                disabled={loading || cartItems.length === 0 || orderSuccess || isVerifying}
                            >
                                {isVerifying ? 'Verifying...' : orderSuccess ? 'Order Placed! 🎉' : step === 'payment' ? 'I Have Paid →' : step === 'checkout' ? 'Proceed to Payment →' : 'Checkout →'}
                            </button>

                            <div className="secure-badge">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                                <span>Secure payment. Your data is protected by industry standard encryption.</span>
                            </div>

                            <div className="payment-icons">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5">
                                    <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
                                </svg>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5">
                                    <circle cx="7" cy="12" r="4" /><circle cx="17" cy="12" r="4" />
                                </svg>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5">
                                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default CartPage;
