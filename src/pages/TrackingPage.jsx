import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function TrackingPage() {
    const { orders } = useCart();
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="container" style={{ padding: '8rem 1rem', textAlign: 'center' }}>
                <h2>Please login to track your orders</h2>
                <Link to="/" className="admin-back-btn" style={{ marginTop: '2rem', display: 'inline-block' }}>Back to Shop</Link>
            </div>
        );
    }

    return (
        <div className="tracking-page" style={{ background: 'var(--color-bg)', minHeight: '80vh', padding: '4rem 0' }}>
            <div className="container">
                <div className="section-header">
                    <div>
                        <h1 className="section-title">Your Orders</h1>
                        <p className="section-subtitle">Real-time status of your treasures</p>
                    </div>
                    <Link to="/" style={{ color: 'var(--color-primary)', fontWeight: '700' }}>← Continue Shopping</Link>
                </div>

                <div className="orders-grid" style={{ display: 'grid', gap: '2rem', marginTop: '3rem' }}>
                    {orders.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '6rem', background: '#fff', borderRadius: 'var(--radius-md)' }}>
                            <h3 style={{ color: 'var(--color-text-dim)' }}>No orders found yet</h3>
                        </div>
                    ) : (
                        orders.map(order => (
                            <div key={order.id} className="order-card" style={{ background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                                <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--color-surface-soft)' }}>
                                    <div>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>Order Number</span>
                                        <div style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--color-primary)' }}>#{order.orderNumber}</div>
                                    </div>
                                    <span className={`status-badge status-${order.status}`} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                                        {order.status === 'pending' ? '⏳ Verifying Payment' : '🎁 Handcrafting'}
                                    </span>
                                </div>
                                <div style={{ padding: '2rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                        <div>
                                            <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase' }}>Items</h4>
                                            {order.items.map((item, idx) => (
                                                <div key={idx} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                                    <img src={item.image} alt="" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                                                    <div>
                                                        <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{item.name}</div>
                                                        <div style={{ fontSize: '0.85rem', color: 'var(--color-text-dim)' }}>Qty: {item.quantity} × ₹{item.price}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase' }}>Delivery Address</h4>
                                            <p style={{ color: 'var(--color-text-dim)', fontSize: '0.95rem', lineHeight: '1.6' }}>{order.customer.address}</p>
                                            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px dotted var(--color-border)' }}>
                                                <span style={{ color: 'var(--color-text-dim)' }}>Total Paid</span>
                                                <div style={{ fontSize: '1.8rem', fontWeight: '800' }}>₹{order.total.toLocaleString('en-IN')}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ padding: '1rem 2rem', background: 'var(--color-bg)', fontSize: '0.85rem', color: 'var(--color-text-dim)', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Placed on {new Date(order.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                                    <span>Thank you for choosing Noor Creation</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
