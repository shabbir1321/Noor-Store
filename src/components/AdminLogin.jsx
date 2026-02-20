import { useState } from 'react';

export default function AdminLogin({ onLogin }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // A simple password for now, as requested.
        if (password === 'noor_admin_2024') {
            onLogin();
        } else {
            setError('Incorrect password. Please try again.');
            setPassword('');
        }
    };

    return (
        <div className="admin-login-container" style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--color-bg)',
            padding: '1rem'
        }}>
            <div className="admin-login-card" style={{
                background: 'var(--color-surface)',
                padding: '2.5rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
                width: '100%',
                maxWidth: '400px',
                textAlign: 'center',
                boxShadow: 'var(--shadow-card)'
            }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌸</div>
                <h2 style={{ marginBottom: '0.5rem' }}>Admin Access</h2>
                <p style={{ color: 'var(--color-text-dim)', fontSize: '0.9rem', marginBottom: '2rem' }}>
                    Enter the password to manage orders
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
                        <input
                            type="password"
                            required
                            autoFocus
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            style={{
                                width: '100%',
                                background: 'var(--color-surface-2)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-sm)',
                                padding: '0.8rem 1rem',
                                color: 'var(--color-text)'
                            }}
                        />
                    </div>

                    {error && (
                        <div style={{ color: '#ff6b6b', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                            {error}
                        </div>
                    )}

                    <button type="submit" className="confirm-details-btn" style={{ width: '100%' }}>
                        Login to Dashboard
                    </button>
                </form>

                <button
                    onClick={() => window.location.href = '/'}
                    style={{
                        background: 'none',
                        color: 'var(--color-text-dim)',
                        marginTop: '1.5rem',
                        fontSize: '0.8rem',
                        textDecoration: 'underline'
                    }}
                >
                    Return to Shop
                </button>
            </div>
        </div>
    );
}
