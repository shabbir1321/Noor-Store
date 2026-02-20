import { useState, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext';
import { products, categories } from './data/products';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import './index.css';

const WHATSAPP_NUMBER = '917389072753';

function ShopPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const { totalItems, totalPrice, setIsCartOpen } = useCart();

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return products;
    return products.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  const activeCategoryName =
    categories.find((c) => c.id === activeCategory)?.name ?? 'All Gifts';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      {/* Hero */}
      <section className="hero">
        <div className="hero-orbs">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
        </div>
        <p className="hero-subtitle">✦ Where Every Gift Tells a Story ✦</p>
        <h1>
          Curated with <span className="gold-text">Love</span>
        </h1>
        <p>
          Discover our hand-picked collection of premium gifts — from fresh florals
          to luxury hampers, crafted to create unforgettable moments.
        </p>
      </section>

      {/* Category Tabs */}
      <div className="categories-bar">
        <div className="categories-scroll">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`category-tab${activeCategory === cat.id ? ' active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Products */}
      <main className="products-section" style={{ flex: 1 }}>
        <div className="container">
          <div className="section-header">
            <h2>{activeCategoryName}</h2>
            <span className="product-count">{filteredProducts.length} items</span>
          </div>
          {filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--color-text-dim)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎁</div>
              <p>No products in this category yet.</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-logo">🌸 Noor Creation</div>
        <p>Premium gifts • Order Management System</p>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="footer-whatsapp-link"
        >
          <span>📲</span>
          <span>Chat with us on WhatsApp</span>
        </a>
        <p style={{ marginTop: '1.25rem', fontSize: '0.72rem' }}>
          © {new Date().getFullYear()} Noor Creation. All rights reserved.
        </p>
      </footer>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* ---- MOBILE STICKY BOTTOM CART BAR ---- */}
      <div className="mobile-cart-bar">
        <button
          className="mobile-cart-open-btn"
          onClick={() => setIsCartOpen(true)}
          aria-label="Open cart"
        >
          <span>🛍️</span>
          <span>
            {totalItems === 0
              ? 'View Cart'
              : `${totalItems} item${totalItems > 1 ? 's' : ''}`}
          </span>
          {totalItems > 0 && (
            <span className="mobile-cart-badge" key={totalItems}>{totalItems}</span>
          )}
        </button>
        {totalItems > 0 && (
          <button
            style={{
              background: 'linear-gradient(135deg, #25D366, #128C7E)',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.88rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.8rem 1rem',
              flex: '0 0 auto',
            }}
            onClick={() => setIsCartOpen(true)}
          >
            ₹{totalPrice.toLocaleString('en-IN')}
          </button>
        )}
      </div>
    </div>
  );
}

function AdminWrapper() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return <AdminDashboard onBack={() => window.location.href = '/'} />;
}

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ShopPage />} />
          <Route path="/admin" element={<AdminWrapper />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
