import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import ProductsPage from './pages/ProductsPage';
import CorporatePage from './pages/CorporatePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import AccountPage from './pages/AccountPage';
import AboutPage from './pages/AboutPage';
import { CartProvider } from './context/CartContext';
import './index.css';

import { auth } from './firebase';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';

// Initialize anonymous auth for Shop to help with Firestore permissions
onAuthStateChanged(auth, (user) => {
    if (!user) {
        signInAnonymously(auth).catch(err => console.error("Anonymous auth failed:", err));
    }
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <CartProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/corporate" element={<CorporatePage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/account" element={<AccountPage />} />
                    <Route path="/about" element={<AboutPage />} />
                </Routes>
            </BrowserRouter>
        </CartProvider>
    </React.StrictMode>
);
