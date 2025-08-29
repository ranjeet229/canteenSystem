const API_BASE = 'https://canteensystem.onrender.com/api';

export const api = {
    getMenu: async () => {
        const response = await fetch(`${API_BASE}/menu`);
        if (!response.ok) throw new Error('Failed to fetch menu');
        return await response.json();
    },

    createOrder: async (orderData) => {
        const response = await fetch(`${API_BASE}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        if (!response.ok) throw new Error('Failed to create order');
        return await response.json();
    },

    getOrder: async (orderId) => {
        const response = await fetch(`${API_BASE}/orders/${orderId}`);
        if (!response.ok) throw new Error('Failed to get order');
        return await response.json();
    },

    payOrder: async (orderId) => {
        const response = await fetch(`${API_BASE}/orders/${orderId}/pay`, { method: 'PUT' });
        if (!response.ok) throw new Error('Payment failed');
        return await response.json();
    },

    getOrderHistory: async (customerEmail) => {
        const response = await fetch(`${API_BASE}/orders?customerEmail=${encodeURIComponent(customerEmail)}`);
        if (!response.ok) throw new Error('Failed to fetch order history');
        return await response.json();
    }
};