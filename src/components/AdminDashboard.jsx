import { useCart } from '../context/CartContext';
import { sendOrderStatusUpdate } from '../utils/whatsapp';

export default function AdminDashboard({ onBack }) {
    const { orders, updateOrderStatus } = useCart();

    const handleApprove = (order) => {
        updateOrderStatus(order.id, 'approved');
    };

    const handleSendWhatsApp = (order) => {
        const url = sendOrderStatusUpdate(order.customer.phone, order.id, 'confirmed');
        window.open(url, '_blank');
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1>Admin Dashboard</h1>
                        <p style={{ color: 'var(--color-text-dim)', fontSize: '0.8rem' }}>Order Management System</p>
                    </div>
                    <button onClick={onBack} className="admin-back-btn">Exit Admin Mode</button>
                </div>
            </div>

            <main className="container" style={{ padding: '2rem 1rem' }}>
                <div className="orders-table-wrapper">
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '4rem' }}>No orders yet.</td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.id}>
                                        <td>
                                            <span className="order-id-badge">{order.orderNumber}</span>
                                            <div style={{ fontSize: '0.65rem', color: 'var(--color-text-dim)', marginTop: '4px' }}>
                                                {new Date(order.date).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="customer-name">{order.customer?.name}</div>
                                            <div className="customer-phone">{order.customer?.phone}</div>
                                            <div className="customer-address">{order.customer?.address}</div>
                                        </td>
                                        <td>
                                            <div className="order-items-compact">
                                                {order.items.map(item => (
                                                    <div key={item.id}>{item.name} x{item.quantity}</div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="order-total-cell">₹{order.total.toLocaleString('en-IN')}</td>
                                        <td>
                                            <span className={`status-badge status-${order.status}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="admin-actions">
                                                {order.status === 'pending' && (
                                                    <button
                                                        className="btn-approve"
                                                        onClick={() => handleApprove(order)}
                                                    >
                                                        Approve
                                                    </button>
                                                )}
                                                {order.status === 'approved' && (
                                                    <button
                                                        className="btn-whatsapp"
                                                        onClick={() => handleSendWhatsApp(order)}
                                                    >
                                                        💬 Notify
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
