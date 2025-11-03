import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useCart } from '../CartContext';
import { useToasts } from 'react-toast-notifications';
import { orderAPI } from '../apiConfig';
import UserNav from './UserNav';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { addToast } = useToasts();
  const { userId } = useSelector((state) => state.user);
  const { cart, clearCart, getCartTotal } = useCart();
  const [shippingAddress, setShippingAddress] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!shippingAddress.trim() || !billingAddress.trim()) {
      addToast('Please fill in both addresses', { appearance: 'error' });
      return;
    }

    if (!cart || cart.length === 0) {
      addToast('Your cart is empty', { appearance: 'error' });
      return;
    }

    setIsLoading(true);

    try {
      // Transform cart items to match backend expected format
      const orderItems = cart.map(item => ({
        bookId: item._id,
        quantity: item.quantity
      }));

      const orderData = {
        orderItems,
        user: userId,
        shippingAddress,
        billingAddress
      };

      console.log('Sending order data:', orderData);

      const response = await orderAPI.addOrder(orderData);

      console.log('Order response:', response.data);

      if (response.status === 201) {
        setShowSuccessModal(true);
        clearCart();
        addToast(response.data.message || 'Order placed successfully!', { 
          appearance: 'success' 
        });
      }
    } catch (error) {
      console.error('Order placement error:', error);
      
      const errorMessage = error.response?.data?.message || 'Failed to place order';
      addToast(errorMessage, { appearance: 'error' });
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        addToast('Please login to place an order', { appearance: 'warning' });
        navigate('/login');
      } else if (error.response?.status === 400) {
        addToast(errorMessage, { appearance: 'error' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate('/books');
  };

  return (
    <div className="checkout-container">
      <UserNav />
      
      <div className="checkout-content">
        <h1 className="page-title">Order Confirmation</h1>

        <div className="checkout-grid">
          <div className="invoice-section">
            <h2>Invoice</h2>
            <div className="invoice-items">
              {cart.map((item) => (
                <div key={item._id} className="invoice-item">
                  <strong>{item.title}</strong>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: ₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
            <div className="invoice-total">
              <strong>Total Amount: ₹{getCartTotal()}</strong>
            </div>
          </div>

          <div className="address-section">
            <h2>Enter Shipping Details</h2>
            <form onSubmit={handlePlaceOrder}>
              <div className="form-group">
                <label>Shipping Address:</label>
                <textarea
                  rows="3"
                  placeholder="Enter shipping address"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label>Billing Address:</label>
                <textarea
                  rows="3"
                  placeholder="Enter billing address"
                  value={billingAddress}
                  onChange={(e) => setBillingAddress(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <button 
                type="submit" 
                className="place-order-btn"
                disabled={isLoading || cart.length === 0}
              >
                {isLoading ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <div className="modal-overlay" onClick={handleModalClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>🎉 Order placed successfully!</h3>
            <button className="modal-button" onClick={handleModalClose}>
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;