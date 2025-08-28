import React, { useState, useEffect, useCallback } from 'react';
import { ShoppingCart, Clock, CheckCircle, XCircle, Plus, Minus, User, History } from 'lucide-react';

// Mock API service (replace with actual API calls)
const API_BASE = 'http://localhost:3000/api';

const api = {
  getMenu: async () => {
    return [
      { _id: '1', name: 'Burger', description: 'Delicious beef burger', price: 12.99, stock: 5, category: 'Main Course', image: 'burger.jpg' },
      { _id: '2', name: 'Pizza', description: 'Margherita pizza', price: 15.99, stock: 0, category: 'Main Course', image: 'pizza.jpg' },
      { _id: '3', name: 'Sandwich', description: 'Club sandwich', price: 8.99, stock: 3, category: 'Light Meal', image: 'sandwich.jpg' },
      { _id: '4', name: 'Coffee', description: 'Fresh brewed coffee', price: 3.99, stock: 10, category: 'Beverages', image: 'coffee.jpg' },
      { _id: '5', name: 'Salad', description: 'Fresh garden salad', price: 9.99, stock: 7, category: 'Healthy Options', image: 'salad.jpg' }
    ];
  },
  
  createOrder: async (orderData) => {
    // Mock order creation
    return {
      orderId: 'ORD' + Date.now(),
      ...orderData,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      totalAmount: orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };
  },
  
  getOrder: async (orderId) => {
    // Mock order retrieval
    return {
      orderId: orderId,
      customerName: 'John Doe',
      status: 'pending',
      paymentStatus: 'pending',
      totalAmount: 25.98,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      items: [
        { name: 'Burger', price: 12.99, quantity: 1 },
        { name: 'Burger', price: 12.99, quantity: 1 }
      ]
    };
  },
  
  payOrder: async (orderId) => {
    return { message: 'Payment successful', orderId };
  },
  
  getOrderHistory: async (customerEmail) => {
    // Mock order history
    return {
      orders: [
        {
          orderId: 'ORD123456',
          totalAmount: 25.98,
          status: 'completed',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          items: [{ name: 'Burger', quantity: 2 }]
        },
        {
          orderId: 'ORD123457',
          totalAmount: 15.99,
          status: 'cancelled',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          items: [{ name: 'Pizza', quantity: 1 }]
        }
      ],
      total: 2
    };
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
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg font-mono text-lg ${
      isUrgent ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
    }`}>
      <Clock className="w-5 h-5" />
      <span>Time left: {formatTime(timeLeft)}</span>
      {isUrgent && <span className="animate-pulse">⚠️</span>}
    </div>
  );
};

// Menu Item Component
const MenuItem = ({ item, onAddToCart, cartItems }) => {
  const cartQuantity = cartItems[item._id] || 0;
  const isOutOfStock = item.stock === 0;
  const maxQuantity = item.stock;

  return (
    <div className={`border rounded-lg p-4 transition-all ${
      isOutOfStock ? 'opacity-50 bg-gray-50' : 'hover:shadow-md bg-white'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
          <p className="text-gray-600 text-sm mb-2">{item.description}</p>
          <p className="text-lg font-bold text-green-600">${item.price}</p>
        </div>
        <div className="text-right">
          <span className={`text-sm px-2 py-1 rounded ${
            item.stock > 5 ? 'bg-green-100 text-green-700' :
            item.stock > 0 ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            Stock: {item.stock}
          </span>
        </div>
      </div>
      
      {!isOutOfStock && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onAddToCart(item._id, -1)}
              disabled={cartQuantity === 0}
              className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-semibold">{cartQuantity}</span>
            <button
              onClick={() => onAddToCart(item._id, 1)}
              disabled={cartQuantity >= maxQuantity}
              className="w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white flex items-center justify-center"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          {cartQuantity > 0 && (
            <span className="text-sm text-gray-600">
              Subtotal: ${(item.price * cartQuantity).toFixed(2)}
            </span>
          )}
        </div>
      )}
      
      {isOutOfStock && (
        <div className="text-center py-2">
          <span className="text-red-600 font-semibold">Out of Stock</span>
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

  return (
    <div className="bg-white rounded-lg border p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Order Summary</h2>
        <span className="text-lg font-mono text-gray-600">#{order.orderId}</span>
      </div>
      
      {order.status === 'pending' && (
        <div className="mb-6">
          <CountdownTimer expiresAt={order.expiresAt} onExpire={handleExpire} />
          <p className="text-sm text-gray-600 mt-2">
            Complete payment within the time limit or your order will be automatically cancelled
          </p>
        </div>
      )}
      
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Order Items:</h3>
        <div className="space-y-2">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b">
              <div>
                <span className="font-medium">{item.name}</span>
                <span className="text-gray-600 ml-2">x{item.quantity}</span>
              </div>
              <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="border-t pt-4 mb-6">
        <div className="flex justify-between items-center text-xl font-bold">
          <span>Total Amount:</span>
          <span className="text-green-600">${order.totalAmount.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 mb-6">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
          order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
          order.status === 'confirmed' ? 'bg-green-100 text-green-700' :
          order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          {order.status === 'pending' && <Clock className="w-4 h-4" />}
          {order.status === 'confirmed' && <CheckCircle className="w-4 h-4" />}
          {order.status === 'cancelled' && <XCircle className="w-4 h-4" />}
          <span className="capitalize font-semibold">{order.status}</span>
        </div>
        
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
          order.paymentStatus === 'pending' ? 'bg-orange-100 text-orange-700' :
          order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
          'bg-red-100 text-red-700'
        }`}>
          <span className="capitalize font-semibold">Payment: {order.paymentStatus}</span>
        </div>
      </div>
      
      {order.status === 'pending' && (
        <div className="flex gap-4">
          <button
            onClick={() => onPay(order.orderId)}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Complete Payment
          </button>
          <button
            onClick={() => onCancel(order.orderId)}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <XCircle className="w-5 h-5" />
            Cancel Order
          </button>
        </div>
      )}
    </div>
  );
};

// Order History Component
const OrderHistory = ({ orders }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <History className="w-6 h-6" />
        Order History
      </h2>
      
      {orders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No previous orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.orderId} className="border rounded-lg p-4 bg-white">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="font-mono text-sm text-gray-600">#{order.orderId}</span>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()} at{' '}
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded text-sm ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <p className="font-bold text-lg text-green-600 mt-1">
                    ${order.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
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
    if (!customerInfo.name.trim()) {
      alert('Please enter your name');
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
    if (confirm('Are you sure you want to cancel this order?')) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">🍽️ Campus Canteen</h1>
              <p className="text-gray-600">Order your favorite meals online</p>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentView('menu')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'menu' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Menu
              </button>
              
              <button
                onClick={() => setCurrentView('checkout')}
                disabled={getCartItemCount() === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors relative ${
                  currentView === 'checkout' ? 'bg-blue-600 text-white' : 
                  getCartItemCount() > 0 ? 'bg-green-600 text-white hover:bg-green-700' : 
                  'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                Cart
                {getCartItemCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getCartItemCount()}
                  </span>
                )}
              </button>
              
              <button
                onClick={loadOrderHistory}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'history' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <History className="w-4 h-4" />
                History
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Customer Info Form */}
        {(currentView === 'menu' || currentView === 'checkout') && (
          <div className="bg-white rounded-lg border p-4 mb-6">
            <div className="flex items-center gap-4">
              <User className="w-5 h-5 text-gray-600" />
              <div className="flex gap-4 flex-1">
                <input
                  type="text"
                  placeholder="Your Name *"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="email"
                  placeholder="Your Email (optional)"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Menu View */}
        {currentView === 'menu' && (
          <div>
            {loading ? (
              <div className="text-center py-8">Loading menu...</div>
            ) : (
              Object.entries(groupedItems).map(([category, items]) => (
                <div key={category} className="mb-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
                    {category}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h2>
            
            {getCartItemCount() === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Your cart is empty</p>
                <button
                  onClick={() => setCurrentView('menu')}
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              <div>
                <div className="space-y-4 mb-6">
                  {Object.entries(cartItems).map(([itemId, quantity]) => {
                    const item = menuItems.find(i => i._id === itemId);
                    if (!item) return null;
                    
                    return (
                      <div key={itemId} className="flex justify-between items-center py-3 border-b">
                        <div>
                          <span className="font-medium">{item.name}</span>
                          <span className="text-gray-600 ml-2">x{quantity}</span>
                          <span className="text-sm text-gray-500 ml-2">(${item.price} each)</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleAddToCart(itemId, -1)}
                              className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center">{quantity}</span>
                            <button
                              onClick={() => handleAddToCart(itemId, 1)}
                              disabled={quantity >= item.stock}
                              className="w-6 h-6 rounded-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white flex items-center justify-center"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="font-semibold min-w-20 text-right">
                            ${(item.price * quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Total:</span>
                    <span className="text-green-600">${getCartTotal().toFixed(2)}</span>
                  </div>
                </div>
                
                <button
                  onClick={handleCreateOrder}
                  disabled={loading || !customerInfo.name.trim()}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-semibold transition-colors"
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
          <div className="bg-white rounded-lg border p-6">
            <OrderHistory orders={orderHistory} />
          </div>
        )}
      </main>
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Processing...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CanteenOrderingSystem;