import React, { useState, useEffect } from 'react';
import { ShoppingCart, History, User, Plus, Minus } from 'lucide-react';
import { styles } from '../styles/styles';
import { api } from '../api';
import MenuItem from './MenuItem';
import OrderSummary from './OrderSummary';
import OrderHistory from './OrderHistory';

const CanteenOrderingSystem = () => {
    const [currentView, setCurrentView] = useState('menu');
    const [menuItems, setMenuItems] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [customerInfo, setCustomerInfo] = useState({ name: '', email: '' });
    const [currentOrder, setCurrentOrder] = useState(null);
    const [orderHistory, setOrderHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const isFirstVisit = localStorage.getItem("isFirstVisit");

        if (!isFirstVisit) {
            // for the first visit it clear everything 
            localStorage.removeItem("customerInfo");
            localStorage.removeItem("cartItems");
            localStorage.setItem("isFirstVisit", "true");
        } else {
            // restore the data that i have saved before
            const savedCustomer = localStorage.getItem("customerInfo");
            const savedCart = localStorage.getItem("cartItems");

            if (savedCustomer) {
                setCustomerInfo(JSON.parse(savedCustomer));
            }
            if (savedCart) {
                setCartItems(JSON.parse(savedCart));
            }
        }
    }, []);

    // this function runs after restore your data
    useEffect(() => {
        if (customerInfo.name || customerInfo.email) {
            localStorage.setItem("customerInfo", JSON.stringify(customerInfo));
        }
    }, [customerInfo]);

    useEffect(() => {
        if (Object.keys(cartItems).length > 0) {
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
        }
    }, [cartItems]);
    //......................................................>>> for save data

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

    // this insure that your email is in correct format ...>>
    const isValidGmail = (email) => {
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        return gmailRegex.test(email.trim());
    };

    const handleCreateOrder = async () => {
        if (!customerInfo.name.trim() || !customerInfo.email.trim()) {
            let missingFields = [];
            if (!customerInfo.name.trim()) missingFields.push('name');
            if (!customerInfo.email.trim()) missingFields.push('email');
            alert(`Please enter your ${missingFields.join(' and ')}`);
            return;
        }

        if (!isValidGmail(customerInfo.email)) {
            alert("Please enter a valid Gmail address");
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

        if(!isValidGmail(customerInfo.email)){
            alert("Please enter a valid Gmail address");
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

            <main style={styles.main}>
                {/* customer Infom form */}
                {(currentView === 'menu' || currentView === 'checkout') && (
                    <div style={styles.card}>
                        <div style={styles.customerForm}>
                            <User style={{ width: '20px', height: '20px', color: '#6b7280' }} />
                            <div style={styles.customerInputs}>
                                <input
                                    type="text"
                                    placeholder="Your Name"
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
                                    pattern="[a-zA-Z0-9._%+-]+@gmail\.com"
                                    title="Please enter a valid Gmail address"
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