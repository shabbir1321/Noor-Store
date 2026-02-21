import { useState, Fragment } from 'react';
import { useCart } from '../context/CartContext';
import { sendOrderStatusUpdate } from '../utils/whatsapp';
import Logo from './Logo';

export default function AdminDashboard({ onBack }) {
    const { orders, updateOrderStatus, deleteOrder } = useCart();
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    const handleApprove = (e, order) => {
        e.stopPropagation();
        updateOrderStatus(order.id, 'approved');
    };

    const handleSendWhatsApp = (e, order) => {
        e.stopPropagation();
        const url = sendOrderStatusUpdate(order.customer.phone, order.id, 'confirmed');
        window.open(url, '_blank');
    };

    const handleDelete = (e, orderId) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
            deleteOrder(orderId);
        }
    };

    const toggleExpand = (orderId) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    return (
        <div className="admin-dashboard">
            <header className="admin-header">
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <Logo size={42} />
                        <div>
                            <h1>Admin Dashboard</h1>
                            <p style={{ color: 'var(--color-text-dim)', fontSize: '0.8rem' }}>Luxury Order Management</p>
                        </div>
                    </div>
                    <button onClick={onBack} className="admin-back-btn">Exit System</button>
                </div>
            </header>

            <main className="container" style={{ padding: '3rem 0' }}>
                <div className="orders-table-wrapper">
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Summary</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '6rem' }}>
                                        <h4 style={{ color: 'var(--color-text-dim)' }}>No orders in the system yet.</h4>
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => {
                                    const isExpanded = expandedOrderId === order.id;
                                    return (
                                        <Fragment key={order.id}>
                                            <tr
                                                onClick={() => toggleExpand(order.id)}
                                                style={{ cursor: 'pointer', transition: 'background 0.2s' }}
                                                className={`order-row ${isExpanded ? 'active-expansion' : ''}`}
                                            >
                                                <td>
                                                    <span className="order-id-badge">#{order.orderNumber}</span>
                                                    <div style={{ fontSize: '0.7rem', color: 'var(--color-text-dim)', marginTop: '6px' }}>
                                                        {new Date(order.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="customer-name">{order.customer?.name}</div>
                                                    <div className="customer-phone">{order.customer?.phone}</div>
                                                </td>
                                                <td>
                                                    <div style={{ fontSize: '0.85rem' }}>
                                                        {order.items.length} items Selection
                                                    </div>
                                                </td>
                                                <td>
                                                    <span style={{ fontWeight: '800', color: 'var(--color-primary)' }}>
                                                        ₹{order.total.toLocaleString('en-IN')}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`status-badge status-${order.status}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                        {order.status === 'pending' && (
                                                            <button
                                                                className="btn-approve"
                                                                onClick={(e) => handleApprove(e, order)}
                                                            >
                                                                Approve
                                                            </button>
                                                        )}
                                                        {order.status === 'approved' && (
                                                            <button
                                                                className="btn-whatsapp"
                                                                onClick={(e) => handleSendWhatsApp(e, order)}
                                                            >
                                                                Notify
                                                            </button>
                                                        )}
                                                        <button
                                                            className="btn-delete"
                                                            onClick={(e) => handleDelete(e, order.id)}
                                                            title="Delete Order"
                                                            style={{
                                                                padding: '6px',
                                                                color: 'var(--color-accent)',
                                                                fontSize: '1.2rem',
                                                                marginLeft: '8px',
                                                                borderRadius: '4px',
                                                                transition: 'var(--transition)'
                                                            }}
                                                        >
                                                            🗑️
                                                        </button>
                                                        <span style={{ fontSize: '0.9rem', color: 'var(--color-primary)', fontWeight: '800', marginLeft: '12px' }}>
                                                            {isExpanded ? 'HIDE ▲' : 'DETAILS ▼'}
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                            {isExpanded && (
                                                <tr style={{ background: '#fafafa' }}>
                                                    <td colSpan="6" style={{ padding: '2.5rem' }}>
                                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                                                            {/* Shipping Details */}
                                                            <div style={{ padding: '1.5rem', background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
                                                                <h4 style={{ marginBottom: '1.2rem', color: 'var(--color-primary)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.8rem' }}>📍 Delivery Details</h4>
                                                                <p style={{ fontSize: '1rem', lineHeight: '1.8' }}>
                                                                    <strong style={{ color: 'var(--color-text-dim)' }}>Name:</strong> {order.customer?.name}<br />
                                                                    <strong style={{ color: 'var(--color-text-dim)' }}>Phone:</strong> {order.customer?.phone}<br />
                                                                    <strong style={{ color: 'var(--color-text-dim)' }}>Address:</strong><br />
                                                                    <span style={{ whiteSpace: 'pre-wrap' }}>{order.customer?.address}</span>
                                                                </p>
                                                            </div>

                                                            {/* Itemized List */}
                                                            <div style={{ padding: '1.5rem', background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
                                                                <h4 style={{ marginBottom: '1.2rem', color: 'var(--color-primary)', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.8rem' }}>🛒 Order items</h4>
                                                                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                                                    {order.items.map((item, idx) => (
                                                                        <div key={idx} style={{ padding: '0.8rem 0', borderBottom: '1px dashed #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                            <div style={{ fontSize: '0.95rem' }}>
                                                                                <span style={{ fontWeight: '800', color: 'var(--color-primary)' }}>{item.quantity}x</span> {item.name}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                <div style={{ mt: '1.5rem', pt: '1rem', borderTop: '2px solid var(--color-bg)', textAlign: 'right', fontWeight: '900', fontSize: '1.2rem', color: 'var(--color-primary)' }}>
                                                                    TOTAL: ₹{order.total.toLocaleString('en-IN')}
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </Fragment>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
