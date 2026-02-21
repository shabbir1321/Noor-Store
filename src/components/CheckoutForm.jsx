import { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function CheckoutForm({ onComplete }) {
    const { placeOrder } = useCart();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.phone || !formData.address) return;
        try {
            const order = await placeOrder(formData);
            onComplete(order);
        } catch (error) {
            alert("Failed to place order. Please try again.");
        }
    };

    return (
        <div className="checkout-form-container">
            <h4>Delivery Details</h4>
            <form onSubmit={handleSubmit} className="checkout-form">
                <div className="form-group">
                    <label>Full Name</label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter your name"
                    />
                </div>
                <div className="form-group">
                    <label>Phone Number</label>
                    <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Active WhatsApp number"
                    />
                </div>
                <div className="form-group">
                    <label>Delivery Address</label>
                    <textarea
                        required
                        rows="3"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Flat no, Building, Street, Area, City"
                    />
                </div>
                <button type="submit" className="confirm-details-btn">
                    Proceed to Payment
                </button>
            </form>
        </div>
    );
}
