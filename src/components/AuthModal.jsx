import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
    const { login, register } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                await register(formData.email, formData.password, formData.name);
            }
            onClose();
        } catch (err) {
            setError(err.message.includes('auth/user-not-found') ? 'Account not found' : err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cart-overlay" onClick={onClose} style={{ zIndex: 3000 }}>
            <div className="admin-login-card" onClick={e => e.stopPropagation()} style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                maxWidth: '450px'
            }}>
                <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🌸</div>
                <h2>{isLogin ? 'Welcome Back' : 'Join Noor Creation'}</h2>
                <p style={{ marginBottom: '2rem' }}>
                    {isLogin ? 'Sign in to access your cart and track orders' : 'Create an account for a personalized experience'}
                </p>

                <form onSubmit={handleSubmit} className="checkout-form">
                    {!isLogin && (
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Enter your name"
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            placeholder="your@email.com"
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            required
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div style={{ color: 'var(--color-accent)', fontSize: '0.85rem', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    <button type="submit" className="confirm-details-btn" disabled={loading}>
                        {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Create Account')}
                    </button>
                </form>

                <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="admin-return-btn"
                    style={{ marginTop: '1.5rem' }}
                >
                    {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
                </button>

                <button
                    onClick={onClose}
                    className="admin-return-btn"
                    style={{ fontSize: '0.8rem', opacity: 0.6 }}
                >
                    Maybe later
                </button>
            </div>
        </div >
    );
}
