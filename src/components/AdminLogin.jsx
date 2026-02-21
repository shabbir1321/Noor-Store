import { useState } from 'react';
import Logo from './Logo';

export default function AdminLogin({ onLogin }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Updated password as requested
        if (password === 'noor123') {
            onLogin();
        } else {
            setError('Incorrect password. Please try again.');
            setPassword('');
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-card">
                <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                    <Logo size={64} />
                </div>
                <h2>Admin Access</h2>
                <p>Welcome back, curator. Please enter your access key.</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Access Password</label>
                        <input
                            type="password"
                            required
                            autoFocus
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div style={{ color: 'var(--color-accent)', fontSize: '0.9rem', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    <button type="submit" className="confirm-details-btn">
                        Login to Dashboard
                    </button>
                </form>

                <button
                    onClick={() => window.location.href = '/'}
                    className="admin-return-btn"
                >
                    Return to Shop
                </button>
            </div>
        </div>
    );
}
