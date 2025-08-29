import React, { useCallback } from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { styles } from '../styles/styles';
import CountdownTimer from './CountdownTimer';

const OrderSummary = ({ order, onPay, onCancel }) => {
    const handleExpire = useCallback(() => {
        alert('Order has expired and will be automatically cancelled');
        if (onCancel) onCancel();
    }, [onCancel]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending': return styles.statusPending;
            case 'confirmed': return styles.statusConfirmed;
            case 'cancelled': return styles.statusCancelled;
            default: return styles.statusPending;
        }
    };

    const getPaymentStatusStyle = (status) => {
        switch (status) {
            case 'pending': return styles.statusPaymentPending;
            case 'paid': return styles.statusPaymentPaid;
            default: return styles.statusCancelled;
        }
    };

    return (
        <div style={styles.orderSummaryCard}>
            <div style={styles.orderHeader}>
                <h2 style={styles.orderTitle}>Order Summary</h2>
                <span style={styles.orderId}>#{order.orderId}</span>
            </div>

            {order.status === 'pending' && (
                <div style={{ marginBottom: '1.5rem' }}>
                    <CountdownTimer expiresAt={order.expiresAt} onExpire={handleExpire} />
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem', margin: 0 }}>
                        Complete payment within the time limit or your order will be automatically cancelled
                    </p>
                </div>
            )}

            <div style={styles.orderItems}>
                <h3 style={styles.orderItemsTitle}>Order Items:</h3>
                <div style={styles.orderItemsList}>
                    {order.items.map((item, index) => (
                        <div key={index} style={styles.orderItem}>
                            <div>
                                <span style={styles.orderItemName}>{item.name}</span>
                                <span style={styles.orderItemQuantity}>x{item.quantity}</span>
                            </div>
                            <span style={styles.orderItemPrice}>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div style={styles.orderTotal}>
                <div style={styles.orderTotalRow}>
                    <span>Total Amount:</span>
                    <span style={styles.orderTotalAmount}>${order.totalAmount.toFixed(2)}</span>
                </div>
            </div>

            <div style={styles.statusBadges}>
                <div style={{ ...styles.statusBadge, ...getStatusStyle(order.status) }}>
                    {order.status === 'pending' && <Clock style={{ width: '16px', height: '16px' }} />}
                    {order.status === 'confirmed' && <CheckCircle style={{ width: '16px', height: '16px' }} />}
                    {order.status === 'cancelled' && <XCircle style={{ width: '16px', height: '16px' }} />}
                    <span style={{ textTransform: 'capitalize' }}>{order.status}</span>
                </div>

                <div style={{ ...styles.statusBadge, ...getPaymentStatusStyle(order.paymentStatus) }}>
                    <span style={{ textTransform: 'capitalize' }}>Payment: {order.paymentStatus}</span>
                </div>
            </div>

            {order.status === 'pending' && (
                <div style={styles.actionButtons}>
                    <button
                        onClick={() => onPay(order.orderId)}
                        style={styles.actionButton}
                        onMouseEnter={(e) => Object.assign(e.target.style, { ...styles.actionButton, ...styles.actionButtonPay, ...styles.actionButtonPayHover })}
                        onMouseLeave={(e) => Object.assign(e.target.style, { ...styles.actionButton, ...styles.actionButtonPay })}
                    >
                        <CheckCircle style={{ width: '20px', height: '20px' }} />
                        Complete Payment
                    </button>
                    <button
                        onClick={() => onCancel(order.orderId)}
                        style={{ ...styles.actionButton, ...styles.actionButtonCancel }}
                        onMouseEnter={(e) => Object.assign(e.target.style, { ...styles.actionButton, ...styles.actionButtonCancel, ...styles.actionButtonCancelHover })}
                        onMouseLeave={(e) => Object.assign(e.target.style, { ...styles.actionButton, ...styles.actionButtonCancel })}
                    >
                        <XCircle style={{ width: '20px', height: '20px' }} />
                        Cancel Order
                    </button>
                </div>
            )}
        </div>
    );
};

export default OrderSummary;