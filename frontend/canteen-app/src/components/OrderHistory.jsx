import React from 'react';
import { History } from 'lucide-react';
import { styles } from '../styles/styles';

const OrderHistory = ({ orders }) => {
    const getStatusStyle = (status) => {
        switch (status) {
            case 'completed': return styles.statusConfirmed;
            case 'cancelled': return styles.statusCancelled;
            case 'pending': return styles.statusPending;
            case 'confirmed': return styles.statusConfirmed;
            default: return styles.statusPending;
        }
    };

    return (
        <div>
            <h2 style={{ ...styles.orderTitle, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <History style={{ width: '24px', height: '24px' }} />
                Order History
            </h2>

            {orders.length === 0 ? (
                <div style={styles.emptyState}>
                    <History style={styles.emptyStateIcon} />
                    <p>No previous orders found</p>
                </div>
            ) : (
                <div>
                    {orders.map((order) => (
                        <div key={order.orderId} style={styles.historyItem}>
                            <div style={styles.historyHeader}>
                                <div>
                                    <span style={styles.historyOrderId}>#{order.orderId}</span>
                                    <p style={styles.historyDate}>
                                        {new Date(order.createdAt).toLocaleDateString()} at{' '}
                                        {new Date(order.createdAt).toLocaleTimeString()}
                                    </p>
                                </div>
                                <div style={styles.historyRight}>
                                    <span style={{ ...styles.stockBadge, ...getStatusStyle(order.status) }}>
                                        {order.status}
                                    </span>
                                    <p style={{ ...styles.menuItemPrice, marginTop: '0.25rem' }}>
                                        ${order.totalAmount.toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            <div style={styles.historyItems}>
                                Items: {order.items.map(item => `${item.name} (${item.quantity})`).join(', ')}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;