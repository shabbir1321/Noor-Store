import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './AccountPage.css';

const AccountPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                fetchOrders(currentUser.uid);
            } else {
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    const fetchOrders = async (uid) => {
        try {
            const q = query(
                collection(db, "orders"),
                where("userId", "==", uid),
                orderBy("createdAt", "desc")
            );
            const querySnapshot = await getDocs(q);
            const ordersList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setOrders(ordersList);
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error("Sign out error:", error);
        }
    };

    if (loading) {
        return (
            <div className="account-page empty">
                <Navbar />
                <div className="account-container">
                    <div className="empty-state">
                        <div className="loader"></div>
                        <p>Loading your desk...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="account-page empty">
                <Navbar />
                <div className="account-container">
                    <div className="empty-state">
                        <h2>Please Sign In</h2>
                        <p>You need to be logged in to access your user desk.</p>
                        <Link to="/" className="btn-dark">Go to Home</Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const initials = user.displayName
        ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
        : (user.email ? user.email[0].toUpperCase() : 'U');

    return (
        <div className="account-page">
            <Navbar />

            <main className="account-container">
                <div className="account-grid">
                    {/* Sidebar / Profile Summary */}
                    <aside className="account-sidebar">
                        <div className="profile-card">
                            <div className="profile-avatar-large">{initials}</div>
                            <h2 className="profile-name">{user.displayName || 'User'}</h2>
                            <p className="profile-email">{user.email}</p>
                            <span className="profile-badge">PRO MEMBER</span>
                        </div>

                        <nav className="account-nav">
                            <button className="account-nav-item active">Dashboard</button>
                            <button className="account-nav-item">My Orders</button>
                            <button className="account-nav-item">Settings</button>
                            <button className="account-nav-item sign-out-btn" onClick={handleSignOut}>Sign Out</button>
                        </nav>
                    </aside>

                    {/* Main Content Area */}
                    <section className="account-content">
                        <header className="content-header">
                            <h1>User Desk</h1>
                            <p>Welcome back, {user.displayName || (user.email ? user.email.split('@')[0] : 'Guest')}! Here is your real-time purchase history.</p>
                        </header>

                        <div className="stats-grid">
                            <div className="stat-box">
                                <span className="stat-val">{orders.length.toString().padStart(2, '0')}</span>
                                <span className="stat-label">Total Orders</span>
                            </div>
                            <div className="stat-box">
                                <span className="stat-val">00</span>
                                <span className="stat-label">Active Designs</span>
                            </div>
                            <div className="stat-box">
                                <span className="stat-val">00</span>
                                <span className="stat-label">Points Earned</span>
                            </div>
                        </div>

                        <div className="recent-activity">
                            <h3 className="sub-heading">Recent Purchases</h3>
                            <div className="activity-list">
                                {orders.length > 0 ? (
                                    orders.map((order) => (
                                        <div className="activity-item" key={order.id}>
                                            <div className="activity-icon">📦</div>
                                            <div className="activity-info">
                                                <h4>Order for {order.items.map(i => i.name).join(', ')}</h4>
                                                <p className="order-meta">Total: ${order.total} • Status: <span className="status-tag">{order.status}</span></p>
                                                <span>{order.createdAt?.toDate().toLocaleDateString()} at {order.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-activity">
                                        <p>No recent purchases found.</p>
                                        <Link to="/products" className="btn-start-shopping">Start Shopping</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AccountPage;
