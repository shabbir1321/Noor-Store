import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { db } from '../firebase';
import { useAuth } from './AuthContext';
import {
    collection,
    addDoc,
    onSnapshot,
    updateDoc,
    doc,
    query,
    orderBy,
    where,
    setDoc,
    getDoc,
    deleteDoc
} from 'firebase/firestore';

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const { user } = useAuth() || {}; // Use destructuring with fallback
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [orders, setOrders] = useState([]);

    // Real-time listener for orders from Firebase
    useEffect(() => {
        if (!db) return;

        // If admin mode, see all orders. If shop mode, see only own orders.
        const isAdmin = window.location.pathname.startsWith('/admin') || import.meta.env.VITE_APP_MODE === 'admin';

        let q;
        if (isAdmin) {
            q = query(collection(db, 'orders'), orderBy('date', 'desc'));
        } else if (user) {
            q = query(collection(db, 'orders'), where('userId', '==', user.uid), orderBy('date', 'desc'));
        } else {
            setOrders([]);
            return;
        }

        const unsubscribe = onSnapshot(q,
            (snapshot) => {
                const ordersData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setOrders(ordersData);
            },
            (error) => {
                console.error("Noor: Firestore listener error:", error);
            }
        );

        return () => unsubscribe();
    }, [user]);

    // Sync Cart with Firestore when user logs in
    useEffect(() => {
        if (user && db) {
            const cartRef = doc(db, 'carts', user.uid);
            const unsubscribe = onSnapshot(cartRef, (docSnap) => {
                if (docSnap.exists()) {
                    const remoteItems = docSnap.data().items || [];
                    // Only update if data actually changed to prevent loops
                    setCartItems(prev => {
                        if (JSON.stringify(prev) === JSON.stringify(remoteItems)) return prev;
                        return remoteItems;
                    });
                }
            });
            return () => unsubscribe();
        } else if (!user) {
            setCartItems([]);
        }
    }, [user]);

    // Helper to sanitize items for Firestore: Keep ONLY essential fields and remove undefineds
    const sanitizeItems = (items) => {
        return items.map(item => ({
            id: item.id,
            name: item.name || '',
            price: Number(item.price) || 0,
            quantity: Number(item.quantity) || 1,
            image: item.image || '',
        }));
    };

    // Update Firestore cart whenever cartItems change
    const syncCartToFirestore = useCallback(async (newItems) => {
        if (!user || !db) return;

        try {
            const sanitized = sanitizeItems(newItems);
            const cartRef = doc(db, 'carts', user.uid);

            // Log for debugging if needed (remove in prod)
            console.log("Noor: Syncing cart...", sanitized.length, "items");

            await setDoc(cartRef, {
                items: sanitized,
                updatedAt: new Date().toISOString()
            });
        } catch (err) {
            console.error("Noor: Cart sync error:", err);
            // If it's the "invalid nested entity" or size error, we at least log it clearly now
            if (err.message?.includes('too large') || err.code === 'invalid-argument') {
                console.error("Critical: Cart payload too large even with Storage URLs?");
            }
        }
    }, [user]);

    const addToCart = useCallback((product) => {
        setCartItems((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            let next;
            if (existing) {
                next = prev.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1, customDesign: product.customDesign || item.customDesign } : item
                );
            } else {
                next = [...prev, { ...product, quantity: 1 }];
            }
            // Trigger sync after state update
            setTimeout(() => syncCartToFirestore(next), 0);
            return next;
        });
        setIsCartOpen(true);
    }, [syncCartToFirestore]);

    const removeFromCart = useCallback((productId) => {
        setCartItems((prev) => {
            const next = prev.filter((item) => item.id !== productId);
            setTimeout(() => syncCartToFirestore(next), 0);
            return next;
        });
    }, [syncCartToFirestore]);

    const updateQuantity = useCallback((productId, quantity) => {
        if (quantity < 1) return;
        setCartItems((prev) => {
            const next = prev.map((item) => (item.id === productId ? { ...item, quantity } : item));
            setTimeout(() => syncCartToFirestore(next), 0);
            return next;
        });
    }, [syncCartToFirestore]);

    const clearCart = useCallback(() => {
        setCartItems([]);
        setTimeout(() => syncCartToFirestore([]), 0);
    }, [syncCartToFirestore]);

    const placeOrder = useCallback(async (customerInfo) => {
        const orderData = {
            orderNumber: `NC-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
            items: [...cartItems],
            total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
            customer: customerInfo,
            userId: user?.uid || 'guest',
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
    }, [cartItems, clearCart, user]);

    const updateOrderStatus = useCallback(async (orderId, status) => {
        try {
            const orderRef = doc(db, 'orders', orderId);
            await updateDoc(orderRef, { status });
        } catch (error) {
            console.error("Noor: Error updating order status: ", error);
        }
    }, []);

    const deleteOrder = useCallback(async (orderId) => {
        try {
            const orderRef = doc(db, 'orders', orderId);
            await deleteDoc(orderRef);
        } catch (error) {
            console.error("Noor: Error deleting order: ", error);
            alert("Failed to delete order. Please try again.");
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
                deleteOrder,
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
