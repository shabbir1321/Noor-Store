import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import HomePage from './pages/HomePage';
import ProductDetails from './pages/ProductDetails';
import CategoryPage from './pages/CategoryPage';
import TrackingPage from './pages/TrackingPage';
import Logo from './components/Logo';
import './index.css';

const WHATSAPP_NUMBER = '917389072753';

function AdminWrapper() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return <AdminDashboard onBack={() => window.location.href = '/'} />;
}

const APP_MODE = import.meta.env.VITE_APP_MODE || 'shop';

function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Navbar />
      <div className="main-content">
        {children}
      </div>
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <Logo size={32} />
                <h3 style={{ margin: 0 }}>Noor Creation</h3>
              </div>
              <p>Premium gifts, florals, and hampers crafted with love for every occasion.</p>
            </div>
            <div className="footer-contact">
              <h4>Get In Touch</h4>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-whatsapp-link"
              >
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Noor Creation. All rights reserved.</p>
          </div>
        </div>
      </footer>
      <CartDrawer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {APP_MODE === 'admin' ? (
              <>
                <Route path="/" element={<AdminWrapper />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            ) : (
              <>
                <Route path="/" element={<AppLayout><HomePage /></AppLayout>} />
                <Route path="/category/:id" element={<AppLayout><CategoryPage /></AppLayout>} />
                <Route path="/product/:id" element={<AppLayout><ProductDetails /></AppLayout>} />
                <Route path="/tracking" element={<AppLayout><TrackingPage /></AppLayout>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            )}
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
