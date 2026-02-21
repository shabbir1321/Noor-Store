import { useState, useMemo, useEffect } from 'react';
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

    const [step, setStep] = useState(() => {
        const saved = localStorage.getItem('noor_checkout_step');
        return saved || 'cart';
    });
    const [activeOrderId, setActiveOrderId] = useState(() => {
        return localStorage.getItem('noor_active_order_id');
    });

    // Persist session state
    useEffect(() => {
        localStorage.setItem('noor_checkout_step', step);
        if (activeOrderId) {
            localStorage.setItem('noor_active_order_id', activeOrderId);
        } else {
            localStorage.removeItem('noor_active_order_id');
        }
    }, [step, activeOrderId]);

    // Find the current status of the active order from the global orders list
    const activeOrder = useMemo(() => {
        return orders.find(o => o.id === activeOrderId);
    }, [orders, activeOrderId]);

    const clearSession = () => {
        setActiveOrderId(null);
        setStep('cart');
        localStorage.removeItem('noor_active_order_id');
        localStorage.removeItem('noor_checkout_step');
    };

    if (!isCartOpen) return null;

    const handleClose = () => {
        setIsCartOpen(false);
        if (step === 'cart' || step === 'info') {
            setTimeout(() => setStep('cart'), 300);
        }
    };

    const onInfoComplete = (order) => {
        if (order && order.id) {
            setActiveOrderId(order.id);
            setStep('payment');
        }
    };

    return (
        <>
            <div className="cart-overlay" onClick={handleClose} />
            <aside className="cart-drawer">
                <div className="cart-header" style={{ height: '70px', padding: '0 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)' }}>
                    <h3>
                        {step === 'cart' && '🛍️ Your Selection'}
                        {step === 'info' && '📝 Delivery Information'}
                        {step === 'payment' && '💳 Checkout'}
                        {step === 'done' && '✅ Order Status'}
                    </h3>
                    <button onClick={handleClose} style={{ fontSize: '1.5rem', color: 'var(--color-text-dim)' }}>✕</button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
                    {step === 'cart' && (
                        <>
                            {cartItems.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                                    <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🛒</div>
                                    <h4 style={{ color: 'var(--color-text-dim)' }}>Your cart is empty</h4>
                                </div>
                            ) : (
                                cartItems.map((item) => (
                                    <div className="cart-item" key={item.id} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', background: 'var(--color-bg)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                                        <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                                            <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                                            {item.customDesign && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '50%',
                                                    left: '50%',
                                                    transform: 'translate(-50%, -40%)',
                                                    width: '30px',
                                                    height: '35px',
                                                    pointerEvents: 'none'
                                                }}>
                                                    <img src={item.customDesign} alt="Custom" style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: 0.8, mixBlendMode: 'multiply' }} />
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: '700', marginBottom: '0.25rem' }}>
                                                {item.name}
                                                {item.customDesign && <span style={{ marginLeft: '8px', fontSize: '0.7rem', color: 'var(--color-primary)', background: '#fff', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--color-primary)' }}>Custom</span>}
                                            </div>
                                            <div style={{ color: 'var(--color-primary)', fontWeight: '800' }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{ background: '#eee', width: '24px', height: '24px', borderRadius: '4px' }}>−</button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ background: '#eee', width: '24px', height: '24px', borderRadius: '4px' }}>+</button>
                                            </div>
                                        </div>
                                        <button onClick={() => removeFromCart(item.id)} style={{ alignSelf: 'flex-start', color: '#ff4d4f' }}>🗑️</button>
                                    </div>
                                ))
                            )}
                        </>
                    )}

                    {step === 'info' && <CheckoutForm onComplete={onInfoComplete} />}
                    {step === 'payment' && (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ background: '#fff', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', marginBottom: '2rem', display: 'inline-block' }}>
                                <svg width="150" height="150" viewBox="0 0 100 100">
                                    <path d="M10 10H40V40H10V10ZM15 15V35H35V15H15Z" fill="#111" />
                                    <path d="M60 10H90V40H60V10ZM65 15V35H85V15H65Z" fill="#111" />
                                    <path d="M10 60H40V90H10V60ZM15 65V85H35V65H15Z" fill="#111" />
                                </svg>
                            </div>
                            <p style={{ color: 'var(--color-text-dim)', marginBottom: '1rem' }}>Scan to pay via UPI</p>
                            <div style={{ fontVariantNumeric: 'tabular-nums', fontWeight: '800', fontSize: '1.2rem', color: 'var(--color-primary)', letterSpacing: '1px' }}>noorcreation@upi</div>
                            <button className="carousel-btn" onClick={() => setStep('done')} style={{ width: '100%', marginTop: '3rem' }}>
                                Confirm Payment
                            </button>
                        </div>
                    )}
                    {step === 'done' && (
                        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                            {activeOrder?.status === 'approved' ? (
                                <>
                                    <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>🎁</div>
                                    <h3 style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>Order Confirmed!</h3>
                                    <p style={{ color: 'var(--color-text-dim)', lineHeight: '1.8' }}>
                                        Thank you for choosing Noor Creation. We've received your payment and are handcrafting your gift.
                                    </p>
                                    <button className="carousel-btn" style={{ marginTop: '3rem', width: '100%' }} onClick={() => { clearSession(); handleClose(); }}>Continue Shopping</button>
                                </>
                            ) : (
                                <>
                                    <div style={{ fontSize: '4rem', marginBottom: '2rem', animation: 'pulse 2s infinite' }}>⏳</div>
                                    <h3>Awaiting Approval</h3>
                                    <p style={{ color: 'var(--color-text-dim)', marginTop: '1.5rem', lineHeight: '1.6' }}>
                                        Our curators are verifying your payment. We'll update this automatically!
                                    </p>
                                    <button className="add-to-cart-btn" style={{ marginTop: '3rem' }} onClick={handleClose}>Check Later</button>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <div style={{ background: 'var(--color-bg)', padding: '2rem 1.5rem', borderTop: '1px solid var(--color-border)' }}>
                    {step === 'cart' && cartItems.length > 0 && (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <span style={{ color: 'var(--color-text-dim)', fontWeight: '600' }}>Order Summary</span>
                                <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-primary)' }}>₹{totalPrice.toLocaleString('en-IN')}</span>
                            </div>
                            <button className="carousel-btn" style={{ width: '100%', marginBottom: '1rem' }} onClick={() => setStep('info')}>Checkout</button>
                            <button onClick={clearCart} style={{ width: '100%', color: 'var(--color-accent)', fontWeight: '700' }}>Empty Cart</button>
                        </>
                    )}
                    {step === 'info' && (
                        <button onClick={() => setStep('cart')} style={{ fontWeight: '700', color: 'var(--color-primary)' }}>← Back to selection</button>
                    )}
                </div>
            </aside>
        </>
    );
}
