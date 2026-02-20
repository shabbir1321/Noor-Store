import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [orders, setOrders] = useState(() => {
        const saved = localStorage.getItem('noor_orders');
        return saved ? JSON.parse(saved) : [];
    });

    // Persist orders to localStorage
    useEffect(() => {
        localStorage.setItem('noor_orders', JSON.stringify(orders));
    }, [orders]);

    // Sync with other tabs (e.g. Admin updates status in another tab)
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'noor_orders' && e.newValue) {
                setOrders(JSON.parse(e.newValue));
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const addToCart = useCallback((product) => {
        setCartItems((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        setIsCartOpen(true);
    }, []);

    const removeFromCart = useCallback((productId) => {
        setCartItems((prev) => prev.filter((item) => item.id !== productId));
    }, []);

    const updateQuantity = useCallback((productId, quantity) => {
        if (quantity < 1) return;
        setCartItems((prev) =>
            prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
        );
    }, []);

    const clearCart = useCallback(() => setCartItems([]), []);

    const placeOrder = useCallback((customerInfo) => {
        const newOrder = {
            id: `NC-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            items: [...cartItems],
            total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
            customer: customerInfo, // { name, phone, address }
            status: 'pending', // 'pending', 'approved', 'declined'
            date: new Date().toISOString(),
        };

        setOrders((prev) => [newOrder, ...prev]);
        clearCart();
        return newOrder;
    }, [cartItems, clearCart]);

    const updateOrderStatus = useCallback((orderId, status) => {
        setOrders((prev) => {
            const updated = prev.map((o) => (o.id === orderId ? { ...o, status } : o));
            // Manually trigger storage event for the same tab if necessary, 
            // but localStorage.setItem in the useEffect will handle cross-tab.
            return updated;
        });
    }, []);

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                placeOrder,
                orders,
                updateOrderStatus,
                totalItems,
                totalPrice,
                isCartOpen,
                setIsCartOpen,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
}
