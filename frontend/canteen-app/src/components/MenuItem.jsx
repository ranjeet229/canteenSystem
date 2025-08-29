import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { styles } from '../styles/styles';

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
                            src={item.image}
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

export default MenuItem;