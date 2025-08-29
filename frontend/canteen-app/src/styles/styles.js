 export const styles = {
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