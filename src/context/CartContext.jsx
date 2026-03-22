import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('noor_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('noor_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity = 1) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id ? { ...item, qty: item.qty + quantity } : item
                );
            }
            // Ensure product has price and other details needed for cart
            const newProduct = {
                id: product.id,
                name: product.name,
                price: parseFloat(product.price) || 0,
                img: product.img || product.images?.[0] || '',
                desc: product.desc || '',
                qty: quantity
            };
            return [...prevItems, newProduct];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, delta) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === productId ? { ...item, qty: Math.max(1, item.qty + delta) } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartCount = cartItems.reduce((total, item) => total + item.qty, 0);
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.qty), 0);
    const tax = subtotal * 0.18; // Assuming 18% GST for India
    const total = subtotal + tax;

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        tax,
        total
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
