import React, { useState, useEffect, useCallback } from 'react';

import { ShoppingCart, Clock, CheckCircle, XCircle, Plus, Minus, User, History } from 'lucide-react';

// CSS styles
const styles = {
    app: {
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        fontFamily: '"Inter", "Arial", sans-serif'
    },
    header: {
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    headerContent: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    headerTitle: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#1f2937',
        margin: '0 0 0.25rem 0'
    },
    headerSubtitle: {
        color: '#6b7280',
        margin: 0
    },
    navButtons: {
        display: 'flex',
        gap: '1rem',
        alignItems: 'center'
    },
    button: {
        padding: '0.5rem 1rem',
        borderRadius: '0.5rem',
        border: 'none',
        cursor: 'pointer',
        fontWeight: '500',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        position: 'relative'
    },
    buttonPrimary: {
        backgroundColor: '#2563eb',
        color: 'white'
    },
    buttonSecondary: {
        backgroundColor: '#e5e7eb',
        color: '#374151'
    },
    buttonSecondaryHover: {
        backgroundColor: '#d1d5db'
    },
    buttonSuccess: {
        backgroundColor: '#16a34a',
        color: 'white'
    },
    buttonSuccessHover: {
        backgroundColor: '#15803d'
    },
    buttonDisabled: {
        backgroundColor: '#e5e7eb',
        color: '#9ca3af',
        cursor: 'not-allowed'
    },
    cartBadge: {
        position: 'absolute',
        top: '-8px',
        right: '-8px',
        backgroundColor: '#dc2626',
        color: 'white',
        fontSize: '0.75rem',
        borderRadius: '50%',
        width: '20px',
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    main: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1.5rem'
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        border: '1px solid #e5e7eb',
        padding: '1.5rem',
        marginBottom: '1.5rem'
    },
    customerForm: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
    },
    customerInputs: {
        display: 'flex',
        gap: '1rem',
        flex: 1
    },
    input: {
        flex: 1,
        padding: '0.75rem',
        border: '1px solid #d1d5db',
        borderRadius: '0.5rem',
        fontSize: '1rem',
        outline: 'none'
    },
    inputFocus: {
        borderColor: '#2563eb',
        boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.2)'
    },
    categoryTitle: {
        fontSize: '1.25rem',
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: '1rem',
        paddingBottom: '0.5rem',
        borderBottom: '2px solid #e5e7eb'
    },
    menuGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
    },
    menuItem: {
        border: '1px solid #e5e7eb',
        borderRadius: '0.5rem',
        padding: '1rem',
        backgroundColor: 'white',
        transition: 'all 0.2s'
    },
    menuItemHover: {
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    },
    menuItemDisabled: {
        opacity: 0.5,
        backgroundColor: '#f9fafb'
    },
    menuItemHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '1rem'
    },
    menuItemTitle: {
        fontWeight: '600',
        fontSize: '1.125rem',
        color: '#1f2937',
        margin: '0 0 0.5rem 0'
    },
    menuItemDescription: {
        color: '#6b7280',
        fontSize: '0.875rem',
        margin: '0 0 0.5rem 0'
    },
    menuItemPrice: {
        fontSize: '1.125rem',
        fontWeight: 'bold',
        color: '#16a34a',
        margin: 0
    },
    stockBadge: {
        fontSize: '0.875rem',
        padding: '0.25rem 0.5rem',
        borderRadius: '0.25rem',
        fontWeight: '500'
    },
    stockHigh: {
        backgroundColor: '#dcfce7',
        color: '#166534'
    },
    stockMedium: {
        backgroundColor: '#fef3c7',
        color: '#92400e'
    },
    stockLow: {
        backgroundColor: '#fee2e2',
        color: '#991b1b'
    },
    quantityControls: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    quantityButtons: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    },
    quantityButton: {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background-color 0.2s'
    },
    quantityButtonMinus: {
        backgroundColor: '#e5e7eb'
    },
    quantityButtonMinusHover: {
        backgroundColor: '#d1d5db'
    },
    quantityButtonPlus: {
        backgroundColor: '#2563eb',
        color: 'white'
    },
    quantityButtonPlusHover: {
        backgroundColor: '#1d4ed8'
    },
    quantityButtonDisabled: {
        opacity: 0.5,
        cursor: 'not-allowed'
    },
    subtotalText: {
        fontSize: '0.875rem',
        color: '#6b7280'
    },
    outOfStockText: {
        textAlign: 'center',
        padding: '0.5rem',
        color: '#dc2626',
        fontWeight: '600'
    },
    orderSummaryCard: {
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        border: '1px solid #e5e7eb',
        padding: '1.5rem',
        maxWidth: '600px',
        margin: '0 auto'
    },
    orderHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem'
    },
    orderTitle: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#1f2937',
        margin: 0
    },
    orderId: {
        fontSize: '1.125rem',
        fontFamily: 'monospace',
        color: '#6b7280'
    },
    timerContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.75rem',
        borderRadius: '0.5rem',
        fontFamily: 'monospace',
        fontSize: '1.125rem',
        fontWeight: '600'
    },
    timerNormal: {
        backgroundColor: '#dbeafe',
        color: '#1d4ed8'
    },
    timerUrgent: {
        backgroundColor: '#fee2e2',
        color: '#dc2626'
    },
    timerWarning: {
        animation: 'pulse 1s infinite'
    },
    orderItems: {
        marginBottom: '1.5rem'
    },
    orderItemsTitle: {
        fontWeight: '600',
        marginBottom: '0.75rem'
    },
    orderItemsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
    },
    orderItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.5rem 0',
        borderBottom: '1px solid #e5e7eb'
    },
    orderItemName: {
        fontWeight: '500'
    },
    orderItemQuantity: {
        color: '#6b7280',
        marginLeft: '0.5rem'
    },
    orderItemPrice: {
        fontWeight: '600'
    },
    orderTotal: {
        borderTop: '1px solid #e5e7eb',
        paddingTop: '1rem',
        marginBottom: '1.5rem'
    },
    orderTotalRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '1.25rem',
        fontWeight: 'bold'
    },
    orderTotalAmount: {
        color: '#16a34a'
    },
    statusBadges: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '1.5rem'
    },
    statusBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 0.75rem',
        borderRadius: '0.5rem',
        fontWeight: '600'
    },
    statusPending: {
        backgroundColor: '#fef3c7',
        color: '#92400e'
    },
    statusConfirmed: {
        backgroundColor: '#dcfce7',
        color: '#166534'
    },
    statusCancelled: {
        backgroundColor: '#fee2e2',
        color: '#991b1b'
    },
    statusPaymentPending: {
        backgroundColor: '#fed7aa',
        color: '#9a3412'
    },
    statusPaymentPaid: {
        backgroundColor: '#dcfce7',
        color: '#166534'
    },
    actionButtons: {
        display: 'flex',
        gap: '1rem'
    },
    actionButton: {
        flex: 1,
        padding: '0.75rem 1.5rem',
        borderRadius: '0.5rem',
        border: 'none',
        cursor: 'pointer',
        fontWeight: '600',
        transition: 'background-color 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem'
    },
    actionButtonPay: {
        backgroundColor: '#16a34a',
        color: 'white'
    },
    actionButtonPayHover: {
        backgroundColor: '#15803d'
    },
    actionButtonCancel: {
        backgroundColor: '#dc2626',
        color: 'white'
    },
    actionButtonCancelHover: {
        backgroundColor: '#b91c1c'
    },
    emptyState: {
        textAlign: 'center',
        padding: '2rem',
        color: '#6b7280'
    },
    emptyStateIcon: {
        width: '48px',
        height: '48px',
        margin: '0 auto 1rem',
        opacity: 0.5
    },
    checkoutItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem 0',
        borderBottom: '1px solid #e5e7eb'
    },
    checkoutItemControls: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
    },
    checkoutQuantityControls: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    },
    checkoutQuantityButton: {
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    historyItem: {
        border: '1px solid #e5e7eb',
        borderRadius: '0.5rem',
        padding: '1rem',
        backgroundColor: 'white',
        marginBottom: '0.75rem'
    },
    historyHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '0.75rem'
    },
    historyOrderId: {
        fontFamily: 'monospace',
        fontSize: '0.875rem',
        color: '#6b7280'
    },
    historyDate: {
        fontSize: '0.875rem',
        color: '#9ca3af'
    },
    historyRight: {
        textAlign: 'right'
    },
    historyItems: {
        fontSize: '0.875rem',
        color: '#6b7280'
    },
    loadingOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
    },
    loadingModal: {
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        textAlign: 'center'
    },
    loadingSpinner: {
        width: '32px',
        height: '32px',
        border: '3px solid #e5e7eb',
        borderTop: '3px solid #2563eb',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 1rem'
    }
};

// Add CSS animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;
document.head.appendChild(styleSheet);

// Mock API service (replace with actual API calls)
const API_BASE = 'http://localhost:3000/api';

const api = {
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
        // Mock order retrieval
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
        // Mock order history
        const response = await fetch(`${API_BASE}/orders?customerEmail=${encodeURIComponent(customerEmail)}`);
        if (!response.ok) throw new Error('Failed to fetch order history');
        return await response.json();
    }
};

// Timer component for countdown
const CountdownTimer = ({ expiresAt, onExpire }) => {
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        const updateTimer = () => {
            const now = new Date().getTime();
            const expiry = new Date(expiresAt).getTime();
            const difference = expiry - now;

            if (difference > 0) {
                setTimeLeft(Math.floor(difference / 1000));
            } else {
                setTimeLeft(0);
                if (onExpire) onExpire();
            }
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [expiresAt, onExpire]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const isUrgent = timeLeft < 300; // Less than 5 minutes

    return (
        <div style={{
            ...styles.timerContainer,
            ...(isUrgent ? styles.timerUrgent : styles.timerNormal),
            ...(isUrgent ? styles.timerWarning : {})
        }}>
            <Clock style={{ width: '20px', height: '20px' }} />
            <span>Time left: {formatTime(timeLeft)}</span>
            {isUrgent && <span>⚠️</span>}
        </div>
    );
};

// Menu Item Component
const MenuItem = ({ item, onAddToCart, cartItems }) => {
    const [isHovered, setIsHovered] = useState(false);
    const cartQuantity = cartItems[item._id] || 0;
    const isOutOfStock = item.stock === 0;
    const maxQuantity = item.stock;

    const getStockStyle = (stock) => {
        if (stock > 5) return styles.stockHigh;
        if (stock > 0) return styles.stockMedium;
        return styles.stockLow;
    };

    return (
        <div
            style={{
                ...styles.menuItem,
                ...(isOutOfStock ? styles.menuItemDisabled : {}),
                ...(isHovered && !isOutOfStock ? styles.menuItemHover : {})
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={styles.menuItemHeader}>
                <div style={{ flex: 1 }}>
                    {item.imageUrl && (
                        <img
                            src={item.imageUrl}
                            alt={item.name}
                            style={{ width: '100%', borderRadius: '0.5rem', marginBottom: '0.5rem', objectFit: 'cover', height: '150px' }}
                        />
                    )}
                    <h3 style={styles.menuItemTitle}>{item.name}</h3>
                    <p style={styles.menuItemDescription}>{item.description}</p>
                    <p style={styles.menuItemPrice}>${item.price}</p>
                </div>
                <div>
                    <span style={{ ...styles.stockBadge, ...getStockStyle(item.stock) }}>
                        Stock: {item.stock}
                    </span>
                </div>
            </div>

            {!isOutOfStock && (
                <div style={styles.quantityControls}>
                    <div style={styles.quantityButtons}>
                        <button
                            onClick={() => onAddToCart(item._id, -1)}
                            disabled={cartQuantity === 0}
                            style={{
                                ...styles.quantityButton,
                                ...styles.quantityButtonMinus,
                                ...(cartQuantity === 0 ? styles.quantityButtonDisabled : {})
                            }}
                            onMouseEnter={(e) => {
                                if (cartQuantity > 0) {
                                    Object.assign(e.target.style, styles.quantityButtonMinusHover);
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (cartQuantity > 0) {
                                    Object.assign(e.target.style, styles.quantityButtonMinus);
                                }
                            }}
                        >
                            <Minus style={{ width: '16px', height: '16px' }} />
                        </button>
                        <span style={{ width: '32px', textAlign: 'center', fontWeight: '600' }}>{cartQuantity}</span>
                        <button
                            onClick={() => onAddToCart(item._id, 1)}
                            disabled={cartQuantity >= maxQuantity}
                            style={{
                                ...styles.quantityButton,
                                ...styles.quantityButtonPlus,
                                ...(cartQuantity >= maxQuantity ? styles.quantityButtonDisabled : {})
                            }}
                            onMouseEnter={(e) => {
                                if (cartQuantity < maxQuantity) {
                                    Object.assign(e.target.style, styles.quantityButtonPlusHover);
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (cartQuantity < maxQuantity) {
                                    Object.assign(e.target.style, styles.quantityButtonPlus);
                                }
                            }}
                        >
                            <Plus style={{ width: '16px', height: '16px' }} />
                        </button>
                    </div>

                    {cartQuantity > 0 && (
                        <span style={styles.subtotalText}>
                            Subtotal: ${(item.price * cartQuantity).toFixed(2)}
                        </span>
                    )}
                </div>
            )}

            {isOutOfStock && (
                <div style={styles.outOfStockText}>
                    Out of Stock
                </div>
            )}
        </div>
    );
};

// Order Summary Component
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

// Order History Component
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

// Main App Component
const CanteenOrderingSystem = () => {
    const [currentView, setCurrentView] = useState('menu'); // menu, checkout, order, history
    const [menuItems, setMenuItems] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [customerInfo, setCustomerInfo] = useState({ name: '', email: '' });
    const [currentOrder, setCurrentOrder] = useState(null);
    const [orderHistory, setOrderHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    // Load menu items on component mount
    useEffect(() => {
        const loadMenu = async () => {
            setLoading(true);
            try {
                const items = await api.getMenu();
                setMenuItems(items);
            } catch (error) {
                console.error('Error loading menu:', error);
            } finally {
                setLoading(false);
            }
        };
        loadMenu();
    }, []);

    // Cart management
    const handleAddToCart = (itemId, change) => {
        setCartItems(prev => {
            const newQuantity = (prev[itemId] || 0) + change;
            if (newQuantity <= 0) {
                const { [itemId]: removed, ...rest } = prev;
                return rest;
            }
            return { ...prev, [itemId]: newQuantity };
        });
    };

    const getCartTotal = () => {
        return Object.entries(cartItems).reduce((total, [itemId, quantity]) => {
            const item = menuItems.find(i => i._id === itemId);
            return total + (item ? item.price * quantity : 0);
        }, 0);
    };

    const getCartItemCount = () => {
        return Object.values(cartItems).reduce((sum, quantity) => sum + quantity, 0);
    };

    // Order management
    const handleCreateOrder = async () => {
        if (!customerInfo.name.trim() || !customerInfo.email.trim()) {
            let missingFields = [];
            if (!customerInfo.name.trim()) missingFields.push('name');
            if (!customerInfo.email.trim()) missingFields.push('email');
            alert(`Please enter your ${missingFields.join(' and ')}`);
            return;
        }

        setLoading(true);
        try {
            const orderItems = Object.entries(cartItems).map(([itemId, quantity]) => {
                const item = menuItems.find(i => i._id === itemId);
                return {
                    menuItemId: itemId,
                    name: item.name,
                    price: item.price,
                    quantity
                };
            });

            const orderData = {
                customerName: customerInfo.name,
                customerEmail: customerInfo.email,
                items: orderItems
            };

            const order = await api.createOrder(orderData);
            setCurrentOrder(order);
            setCartItems({});
            setCurrentView('order');
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Failed to create order. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    const handlePayOrder = async (orderId) => {
        setLoading(true);
        try {
            await api.payOrder(orderId);
            const updatedOrder = await api.getOrder(orderId);
            setCurrentOrder({ ...updatedOrder, status: 'confirmed', paymentStatus: 'paid' });
            alert('Payment successful! Your order has been confirmed.');
        } catch (error) {
            console.error('Error processing payment:', error);
            alert('Payment failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            setLoading(true);
            try {
                const updatedOrder = { ...currentOrder, status: 'cancelled' };
                setCurrentOrder(updatedOrder);
                alert('Order cancelled successfully. Stock has been restored.');
            } catch (error) {
                console.error('Error cancelling order:', error);
                alert('Failed to cancel order. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    const loadOrderHistory = async () => {
        if (!customerInfo.email) {
            alert('Please enter your email to view order history');
            return;
        }

        setLoading(true);
        try {
            const history = await api.getOrderHistory(customerInfo.email);
            setOrderHistory(history.orders);
            setCurrentView('history');
        } catch (error) {
            console.error('Error loading order history:', error);
            alert('Failed to load order history');
        } finally {
            setLoading(false);
        }
    };

    // Group menu items by category
    const groupedItems = menuItems.reduce((groups, item) => {
        const category = item.category || 'Other';
        if (!groups[category]) groups[category] = [];
        groups[category].push(item);
        return groups;
    }, {});

    const getButtonStyle = (view, isActive, isDisabled = false, isSuccess = false) => {
        if (isDisabled) return { ...styles.button, ...styles.buttonDisabled };
        if (isActive) return { ...styles.button, ...styles.buttonPrimary };
        if (isSuccess) return { ...styles.button, ...styles.buttonSuccess };
        return { ...styles.button, ...styles.buttonSecondary };
    };

    return (
        <div style={styles.app}>
            {/* Header */}
            <header style={styles.header}>
                <div style={styles.headerContent}>
                    <div>
                        <h1 style={styles.headerTitle}>Canteen</h1>
                        <p style={styles.headerSubtitle}>Order your favorite meals online</p>
                    </div>

                    <div style={styles.navButtons}>
                        <button
                            onClick={() => setCurrentView('menu')}
                            style={getButtonStyle('menu', currentView === 'menu')}
                            onMouseEnter={(e) => {
                                if (currentView !== 'menu') {
                                    Object.assign(e.target.style, { ...styles.button, ...styles.buttonSecondary, ...styles.buttonSecondaryHover });
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (currentView !== 'menu') {
                                    Object.assign(e.target.style, getButtonStyle('menu', false));
                                }
                            }}
                        >
                            Menu
                        </button>

                        <button
                            onClick={() => setCurrentView('checkout')}
                            disabled={getCartItemCount() === 0}
                            style={getButtonStyle('checkout', currentView === 'checkout', getCartItemCount() === 0, getCartItemCount() > 0)}
                            onMouseEnter={(e) => {
                                if (getCartItemCount() > 0 && currentView !== 'checkout') {
                                    Object.assign(e.target.style, { ...styles.button, ...styles.buttonSuccess, ...styles.buttonSuccessHover });
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (getCartItemCount() > 0 && currentView !== 'checkout') {
                                    Object.assign(e.target.style, getButtonStyle('checkout', false, false, true));
                                }
                            }}
                        >
                            <ShoppingCart style={{ width: '16px', height: '16px' }} />
                            Cart
                            {getCartItemCount() > 0 && (
                                <span style={styles.cartBadge}>
                                    {getCartItemCount()}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={loadOrderHistory}
                            style={getButtonStyle('history', currentView === 'history')}
                            onMouseEnter={(e) => {
                                if (currentView !== 'history') {
                                    Object.assign(e.target.style, { ...styles.button, ...styles.buttonSecondary, ...styles.buttonSecondaryHover });
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (currentView !== 'history') {
                                    Object.assign(e.target.style, getButtonStyle('history', false));
                                }
                            }}
                        >
                            <History style={{ width: '16px', height: '16px' }} />
                            History
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main style={styles.main}>
                {/* Customer Info Form */}
                {(currentView === 'menu' || currentView === 'checkout') && (
                    <div style={styles.card}>
                        <div style={styles.customerForm}>
                            <User style={{ width: '20px', height: '20px', color: '#6b7280' }} />
                            <div style={styles.customerInputs}>
                                <input
                                    type="text"
                                    placeholder="Your Name *"
                                    value={customerInfo.name}
                                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                                    style={styles.input}
                                    onFocus={(e) => Object.assign(e.target.style, { ...styles.input, ...styles.inputFocus })}
                                    onBlur={(e) => Object.assign(e.target.style, styles.input)}
                                />
                                <input
                                    type="email"
                                    placeholder="Your Email"
                                    value={customerInfo.email}
                                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                                    style={styles.input}
                                    onFocus={(e) => Object.assign(e.target.style, { ...styles.input, ...styles.inputFocus })}
                                    onBlur={(e) => Object.assign(e.target.style, styles.input)}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Menu View */}
                {currentView === 'menu' && (
                    <div>
                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '2rem' }}>Loading menu...</div>
                        ) : (
                            Object.entries(groupedItems).map(([category, items]) => (
                                <div key={category} style={{ marginBottom: '2rem' }}>
                                    <h2 style={styles.categoryTitle}>
                                        {category}
                                    </h2>
                                    <div style={styles.menuGrid}>
                                        {items.map(item => (
                                            <MenuItem
                                                key={item._id}
                                                item={item}
                                                onAddToCart={handleAddToCart}
                                                cartItems={cartItems}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Checkout View */}
                {currentView === 'checkout' && (
                    <div style={styles.card}>
                        <h2 style={{ ...styles.orderTitle, marginBottom: '1.5rem' }}>Checkout</h2>

                        {getCartItemCount() === 0 ? (
                            <div style={styles.emptyState}>
                                <ShoppingCart style={styles.emptyStateIcon} />
                                <p>Your cart is empty</p>
                                <button
                                    onClick={() => setCurrentView('menu')}
                                    style={{ ...styles.button, ...styles.buttonPrimary, marginTop: '1rem' }}
                                    onMouseEnter={(e) => Object.assign(e.target.style, { ...styles.button, ...styles.buttonPrimary, backgroundColor: '#1d4ed8' })}
                                    onMouseLeave={(e) => Object.assign(e.target.style, { ...styles.button, ...styles.buttonPrimary })}
                                >
                                    Browse Menu
                                </button>
                            </div>
                        ) : (
                            <div>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    {Object.entries(cartItems).map(([itemId, quantity]) => {
                                        const item = menuItems.find(i => i._id === itemId);
                                        if (!item) return null;

                                        return (
                                            <div key={itemId} style={styles.checkoutItem}>
                                                <div>
                                                    <span style={styles.orderItemName}>{item.name}</span>
                                                    <span style={styles.orderItemQuantity}>x{quantity}</span>
                                                    <span style={{ fontSize: '0.875rem', color: '#9ca3af', marginLeft: '0.5rem' }}>(${item.price} each)</span>
                                                </div>
                                                <div style={styles.checkoutItemControls}>
                                                    <div style={styles.checkoutQuantityControls}>
                                                        <button
                                                            onClick={() => handleAddToCart(itemId, -1)}
                                                            style={{ ...styles.checkoutQuantityButton, ...styles.quantityButtonMinus }}
                                                            onMouseEnter={(e) => Object.assign(e.target.style, { ...styles.checkoutQuantityButton, ...styles.quantityButtonMinusHover })}
                                                            onMouseLeave={(e) => Object.assign(e.target.style, { ...styles.checkoutQuantityButton, ...styles.quantityButtonMinus })}
                                                        >
                                                            <Minus style={{ width: '12px', height: '12px' }} />
                                                        </button>
                                                        <span style={{ width: '32px', textAlign: 'center' }}>{quantity}</span>
                                                        <button
                                                            onClick={() => handleAddToCart(itemId, 1)}
                                                            disabled={quantity >= item.stock}
                                                            style={{
                                                                ...styles.checkoutQuantityButton,
                                                                ...styles.quantityButtonPlus,
                                                                ...(quantity >= item.stock ? styles.quantityButtonDisabled : {})
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                if (quantity < item.stock) {
                                                                    Object.assign(e.target.style, { ...styles.checkoutQuantityButton, ...styles.quantityButtonPlusHover });
                                                                }
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                if (quantity < item.stock) {
                                                                    Object.assign(e.target.style, { ...styles.checkoutQuantityButton, ...styles.quantityButtonPlus });
                                                                }
                                                            }}
                                                        >
                                                            <Plus style={{ width: '12px', height: '12px' }} />
                                                        </button>
                                                    </div>
                                                    <span style={{ ...styles.orderItemPrice, minWidth: '80px', textAlign: 'right' }}>
                                                        ${(item.price * quantity).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div style={styles.orderTotal}>
                                    <div style={styles.orderTotalRow}>
                                        <span>Total:</span>
                                        <span style={styles.orderTotalAmount}>${getCartTotal().toFixed(2)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        if (!customerInfo.name.trim() || !customerInfo.email.trim()) {
                                            alert("Please enter your name and email");
                                            return;
                                        }
                                        handleCreateOrder();
                                    }}
                                    disabled={loading}
                                    style={{
                                        ...styles.actionButton,
                                        ...styles.actionButtonPay,
                                        width: '100%',
                                        ...(loading ? styles.buttonDisabled : {})
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!loading) {
                                            Object.assign(e.target.style, { ...styles.actionButton, ...styles.actionButtonPay, ...styles.actionButtonPayHover, width: '100%' });
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!loading) {
                                            Object.assign(e.target.style, { ...styles.actionButton, ...styles.actionButtonPay, width: '100%' });
                                        }
                                    }}
                                >
                                    {loading ? 'Creating Order...' : 'Place Order'}
                                </button>

                            </div>
                        )}
                    </div>
                )}

                {/* Order View */}
                {currentView === 'order' && currentOrder && (
                    <OrderSummary
                        order={currentOrder}
                        onPay={handlePayOrder}
                        onCancel={handleCancelOrder}
                    />
                )}

                {/* History View */}
                {currentView === 'history' && (
                    <div style={styles.card}>
                        <OrderHistory orders={orderHistory} />
                    </div>
                )}
            </main>

            {/* Loading Overlay */}
            {loading && (
                <div style={styles.loadingOverlay}>
                    <div style={styles.loadingModal}>
                        <div style={styles.loadingSpinner}></div>
                        <p>Processing...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CanteenOrderingSystem;