import React from 'react';
import Razorpay from 'react-razorpay';

const PaymentGateway = ({ order, onSuccess, onClose }) => {
  const handlePaymentSuccess = (paymentId) => {
    console.log('Payment Successful', paymentId);
    onSuccess(paymentId);
  };

  const handlePaymentClose = () => {
    console.log('Payment closed');
    onClose();
  };

  return (
    <Razorpay
      key={order.id}
      currency="USD"
      amount={order.amount * 100}
      name="Canteen Ordering System"
      description={`Order #${order.id}`}
      image="/logo.png"
      prefill={{
        name: order.customerName,
        email: order.customerEmail,
        contact: '+1234567890'
      }}
      notes={{
        orderId: order.id
      }}
      handler={handlePaymentSuccess}
      onClose={handlePaymentClose}
      theme={{
        color: '#3399cc'
      }}
    >
      <button>Pay Now</button>
    </Razorpay>
  );
};

export default PaymentGateway;