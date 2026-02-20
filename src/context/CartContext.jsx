import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { db } from '../firebase';
import {
    collection,
    addDoc,
    onSnapshot,
    updateDoc,
    doc,
    query,
    orderBy
} from 'firebase/firestore';

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [orders, setOrders] = useState([]);

    // Real-time listener for orders from Firebase
    useEffect(() => {
        const q = query(collection(db, 'orders'), orderBy('date', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const ordersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setOrders(ordersData);
        });

        return () => unsubscribe();
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

    const placeOrder = useCallback(async (customerInfo) => {
        const orderData = {
            orderNumber: `NC-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            items: [...cartItems],
            total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
            customer: customerInfo,
            status: 'pending',
            date: new Date().toISOString(),
        };

        try {
            const docRef = await addDoc(collection(db, 'orders'), orderData);
            clearCart();
            return { id: docRef.id, ...orderData };
        } catch (error) {
            console.error("Error placing order: ", error);
            throw error;
        }
    }, [cartItems, clearCart]);

    const updateOrderStatus = useCallback(async (orderId, status) => {
        try {
            const orderRef = doc(db, 'orders', orderId);
            await updateDoc(orderRef, { status });
        } catch (error) {
            console.error("Error updating order status: ", error);
        }
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
