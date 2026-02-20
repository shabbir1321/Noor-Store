import { useState, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import CheckoutForm from './CheckoutForm';

export default function CartDrawer() {
    const {
        cartItems,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
        orders
    } = useCart();

    const [step, setStep] = useState('cart'); // 'cart', 'info', 'payment', 'done'
    const [activeOrderId, setActiveOrderId] = useState(null);

    // Find the current status of the active order from the global orders list
    const activeOrder = useMemo(() => {
        return orders.find(o => o.id === activeOrderId);
    }, [orders, activeOrderId]);

    if (!isCartOpen) return null;

    const handleClose = () => {
        setIsCartOpen(false);
        // Only reset if not in the waiting/done state
        if (step === 'cart' || step === 'info') {
            setTimeout(() => setStep('cart'), 300);
        }
    };

    const onInfoComplete = (order) => {
        setActiveOrderId(order.id);
        setStep('payment');
    };

    return (
        <>
            <div className="cart-overlay" onClick={handleClose} />
            <aside className="cart-drawer">
                <div className="cart-header">
                    <h3>
                        {step === 'cart' && '🛍️ Your Cart'}
                        {step === 'info' && '📝 Delivery Details'}
                        {step === 'payment' && '💳 Pay & Confirm'}
                        {step === 'done' && (activeOrder?.status === 'approved' ? '✅ Order Successful' : '⏳ Order Pending')}
                    </h3>
                    <button className="cart-close-btn" onClick={handleClose}>✕</button>
                </div>

                <div className="cart-items-list">
                    {step === 'cart' && (
                        <>
                            {cartItems.length === 0 ? (
                                <div className="cart-empty">
                                    <div className="cart-empty-icon">🛒</div>
                                    <h4>Your cart is empty</h4>
                                </div>
                            ) : (
                                cartItems.map((item) => (
                                    <div className="cart-item" key={item.id}>
                                        <img className="cart-item-img" src={item.image} alt={item.name} />
                                        <div className="cart-item-details">
                                            <div className="cart-item-name">{item.name}</div>
                                            <div className="cart-item-price">₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                                            <div className="cart-item-controls">
                                                <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                                                <span className="qty-value">{item.quantity}</span>
                                                <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                            </div>
                                        </div>
                                        <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>🗑️</button>
                                    </div>
                                ))
                            )}
                        </>
                    )}

                    {step === 'info' && <CheckoutForm onComplete={onInfoComplete} />}

                    {step === 'payment' && (
                        <div className="payment-view">
                            <div className="payment-qr-placeholder">
                                <svg width="180" height="180" viewBox="0 0 100 100" style={{ background: '#fff', padding: '10px', borderRadius: '8px' }}>
                                    <path d="M10 10H40V40H10V10ZM15 15V35H35V15H15Z" fill="#111" />
                                    <path d="M60 10H90V40H60V10ZM65 15V35H85V15H65Z" fill="#111" />
                                    <path d="M10 60H40V90H10V60ZM15 65V85H35V65H15Z" fill="#111" />
                                    <rect x="45" y="45" width="10" height="10" fill="#111" />
                                    <rect x="60" y="60" width="10" height="10" fill="#111" />
                                    <rect x="75" y="75" width="15" height="15" fill="#111" />
                                </svg>
                            </div>
                            <div className="payment-details">
                                <p>Scan QR or pay to UPI ID:</p>
                                <div className="upi-id">noorcreation@upi</div>
                                <p>Phone: <strong>+91 7389072753</strong></p>
                                <div className="payment-instruction">
                                    <small>Once paid, our team will review and approve your order.</small>
                                </div>
                            </div>
                            <button className="checkout-btn" onClick={() => setStep('done')}>
                                I have made the payment
                            </button>
                        </div>
                    )}

                    {step === 'done' && (
                        <div className="order-complete-view">
                            {activeOrder?.status === 'approved' ? (
                                <>
                                    <div className="success-icon">🎉</div>
                                    <h4>Order Successful!</h4>
                                    <p>Order ID: <strong>{activeOrderId}</strong></p>
                                    <p style={{ fontSize: '0.85rem', marginTop: '1rem', color: '#6ee098' }}>
                                        Payment confirmed. We are preparing your gift! 🌸
                                    </p>
                                    <button className="confirm-details-btn" style={{ marginTop: '2rem' }} onClick={() => { setStep('cart'); handleClose(); }}>
                                        Continue Shopping
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="success-icon" style={{ animation: 'pulse 1.5s infinite' }}>⏳</div>
                                    <h4>Order Request Pending</h4>
                                    <p>Order ID: <strong>{activeOrderId}</strong></p>
                                    <div className="payment-instruction" style={{ marginTop: '1.5rem' }}>
                                        <p>We are verifying your payment details.</p>
                                        <small>Please keep this window open. This screen will update automatically once the admin approves your order.</small>
                                    </div>
                                    <button className="clear-cart-btn" style={{ marginTop: '2rem' }} onClick={handleClose}>
                                        Close & Check Later
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <div className="cart-footer">
                    {step === 'cart' && cartItems.length > 0 && (
                        <>
                            <div className="cart-total-row">
                                <span className="cart-total-label">Total</span>
                                <span className="cart-total-price">₹{totalPrice.toLocaleString('en-IN')}</span>
                            </div>
                            <button className="checkout-btn" onClick={() => setStep('info')}>
                                Checkout
                            </button>
                            <button className="clear-cart-btn" onClick={clearCart}>Clear cart</button>
                        </>
                    )}
                    {step === 'info' && (
                        <button className="clear-cart-btn" onClick={() => setStep('cart')}>← Back to Cart</button>
                    )}
                </div>
            </aside>
        </>
    );
}
