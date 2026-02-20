// WhatsApp utility: format order and open WhatsApp chat
const WHATSAPP_NUMBER = '917389072753';
const SHOP_SECRET = 'NOOR_GIFT_2024'; // Internal key to detect tampering

function generateOrderId() {
    return `NC-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
}

function generateVerificationCode(orderId, total) {
    // A simple checksum to detect if the price was edited
    const raw = `${orderId}${total}${SHOP_SECRET}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
        hash = (hash << 5) - hash + raw.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36).toUpperCase().slice(-4);
}

export function openWhatsAppOrder(cartItems, totalPrice) {
    const orderId = generateOrderId();
    const vCode = generateVerificationCode(orderId, totalPrice);

    const itemLines = cartItems
        .map(
            (item) =>
                `  • ${item.name} × ${item.quantity} = ₹${(item.price * item.quantity).toLocaleString('en-IN')}`
        )
        .join('\n');

    const message = `🌸 *New Order: ${orderId}* 🌸

🛍️ *Items:*
${itemLines}

💰 *Total: ₹${totalPrice.toLocaleString('en-IN')}*
Verification: [${vCode}]

----------------------------------
📦 *DO NOT EDIT THIS MESSAGE*
_Editing may delay order verification._
----------------------------------`;

    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(url, '_blank');
}

export function sendOrderStatusUpdate(customerPhone, orderId, status) {
    // This function creates a WhatsApp link for the shop owner to send a status update
    // to a customer. Automated sending requires WhatsApp Business API.
    const messages = {
        confirmed: `✅ *Order Confirmed!* Your order #${orderId} has been confirmed. We're preparing it with love! 🌸`,
        shipped: `🚚 *Order Shipped!* Your order #${orderId} is on its way! Estimated delivery: 1-2 days.`,
        delivered: `🎉 *Order Delivered!* Your order #${orderId} has been delivered. Enjoy your gift! 💝`,
        cancelled: `❌ *Order Cancelled.* Your order #${orderId} has been cancelled. Contact us for more info.`,
    };

    const message = messages[status] || `Update for your order #${orderId}: ${status}`;
    const encodedMessage = encodeURIComponent(message);
    const cleanPhone = customerPhone.replace(/\D/g, '');
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}
