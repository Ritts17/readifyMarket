import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { orderAPI, getImageUrl } from '../apiConfig';
import UserNav from './UserNav';
import './UserViewOrders.css';

const UserViewOrders = () => {
  const { addToast } = useToasts();
  const queryClient = useQueryClient();
  const { userId } = useSelector((state) => state.user);
  const [showItemsModal, setShowItemsModal] = useState(null);
  const [showTrackingModal, setShowTrackingModal] = useState(null);
  const [cancelOrderId, setCancelOrderId] = useState(null);

  // Fetch user orders from backend
  const { data: ordersData, isLoading, isError } = useQuery({
    queryKey: ['userOrders', userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error('User ID not found');
      }
      const response = await orderAPI.getOrdersByUserId(userId);
      return response.data;
    },
    enabled: !!userId,
    retry: 1,
  });

  // Cancel order mutation - Updates status instead of deleting
  const cancelMutation = useMutation({
    mutationFn: async (orderId) => {
      const response = await orderAPI.updateOrder(orderId, { orderStatus: 'Cancelled' });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userOrders']);
      addToast('Order cancelled successfully', { appearance: 'success' });
      setCancelOrderId(null);
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Failed to cancel order';
      addToast(errorMessage, { appearance: 'error' });
    }
  });

  const orders = Array.isArray(ordersData) ? ordersData : [];

  const getStatusSteps = (currentStatus) => {
    // Special handling for cancelled orders
    if (currentStatus === 'Cancelled') {
      return [
        { name: 'Pending', completed: true },
        { name: 'Cancelled', completed: true }
      ];
    }

    const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    const currentIndex = steps.findIndex(step => step === currentStatus);
    return steps.map((step, index) => ({
      name: step,
      completed: index <= currentIndex
    }));
  };

  const handleCancelOrder = () => {
    if (cancelOrderId) {
      cancelMutation.mutate(cancelOrderId);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // if (isLoading) {
  //   return (
  //     <div className="user-orders-container">
  //       <UserNav />
  //       <div className="orders-content">
  //         <div style={{ textAlign: 'center', padding: '40px' }}>Loading orders...</div>
  //       </div>
  //     </div>
  //   );
  // }


  if (isLoading) {
    return (
      <div className="user-orders-container">
        <UserNav />
        <div className="orders-content">
          <h1 className="page-title">Order History</h1>
          <div style={{ textAlign: 'center', padding: '40px' }}>Loading orders...</div>
        </div>
      </div>
    );
  }


  if (isError) {
    return (
      <div className="user-orders-container">
        <UserNav />
        <div className="orders-content">
          <h1 className="page-title">Order History</h1>
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            Failed to load orders. Please try again later.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-orders-container">
      <UserNav />

      <div className="orders-content">
        <h1 className="page-title">Order History</h1>

        <div className="orders-list">
          {orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              No orders found. Start shopping to place your first order!
            </div>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <h3>Order ID: {order._id}</h3>
                  <span className={`status-badge ${order.orderStatus?.toLowerCase()}`}>
                    {order.orderStatus}
                  </span>
                </div>

                <div className="order-details">
                  <p><strong>Date:</strong> {formatDate(order.orderDate || order.createdAt)}</p>
                  <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
                  <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
                  <p><strong>Billing Address:</strong> {order.billingAddress}</p>
                  <p><strong>Items:</strong> {order.orderItems?.length || 0} book(s)</p>
                </div>

                {order.orderStatus === 'Cancelled' && (
                  <div style={{
                    padding: '10px',
                    backgroundColor: '#fff3cd',
                    border: '1px solid #ffc107',
                    borderRadius: '4px',
                    marginTop: '10px',
                    fontSize: '14px'
                  }}>
                    This order was cancelled. The order history is kept for your records.
                  </div>
                )}

                <div className="books-preview">
                  {order.orderItems && order.orderItems.length > 0 ? (
                    order.orderItems.slice(0, 2).map((item, idx) => (
                      <div key={idx} className="book-preview-item">
                        <strong>Book:</strong> {item.book?.title || 'N/A'}
                        <strong> Qty:</strong> {item.quantity}
                      </div>
                    ))
                  ) : (
                    <p>No items found</p>
                  )}
                  {order.orderItems && order.orderItems.length > 2 && (
                    <div className="book-preview-item">
                      + {order.orderItems.length - 2} more items
                    </div>
                  )}
                </div>

                <div className="order-actions">
                  <button className="track-btn" onClick={() => setShowTrackingModal(order)}>
                    Track Order
                  </button>
                  <button className="view-items-btn" onClick={() => setShowItemsModal(order)}>
                    View Items
                  </button>
                  {order.orderStatus === 'Pending' && (
                    <button
                      className="cancel-btn"
                      onClick={() => setCancelOrderId(order._id)}
                      disabled={cancelMutation.isLoading}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Items Modal */}
      {showItemsModal && (
        <div className="modal-overlay" onClick={() => setShowItemsModal(null)}>
          <div className="modal-content items-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowItemsModal(null)}>×</button>
            <h3>Order Items</h3>
            <div className="items-list">
              {showItemsModal.orderItems && showItemsModal.orderItems.length > 0 ? (
                showItemsModal.orderItems.map((item, idx) => (
                  <div key={idx} className="item-card">
                    <img
                      src={getImageUrl(item.book?.coverImage)}
                      alt={item.book?.title || 'Book'}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/100x150?text=No+Image';
                      }}
                    />
                    <div className="item-details">
                      <strong>{item.book?.title || 'Unknown Title'}</strong>
                      <p><strong>Category:</strong> {item.book?.category || 'N/A'}</p>
                      <p><strong>Quantity:</strong> {item.quantity}</p>
                      <p><strong>Price:</strong> ₹{item.price}</p>
                      <p><strong>Subtotal:</strong> ₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No items information available</p>
              )}
            </div>
            <div className="modal-total">
              <strong>Total Amount: ₹{showItemsModal.totalAmount}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Tracking Modal */}
      {showTrackingModal && (
        <div className="modal-overlay" onClick={() => setShowTrackingModal(null)}>
          <div className="modal-content tracking-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowTrackingModal(null)}>×</button>
            <h3>Order Tracking</h3>
            <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>
              Order ID: {showTrackingModal._id}
            </p>
            <div className="tracking-progress">
              {getStatusSteps(showTrackingModal.orderStatus).map((step, idx) => (
                <div key={idx} className={`tracking-step ${step.completed ? 'completed' : ''}`}>
                  <div className="step-circle">{step.completed ? '✓' : idx + 1}</div>
                  <div className="step-label">{step.name}</div>
                  {idx < getStatusSteps(showTrackingModal.orderStatus).length - 1 && (
                    <div className={`step-line ${step.completed ? 'completed' : ''}`}></div>
                  )}
                </div>
              ))}
            </div>
            <p style={{ textAlign: 'center', marginTop: '20px', fontWeight: 'bold' }}>
              Current Status: {showTrackingModal.orderStatus}
            </p>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelOrderId && (
        <div className="modal-overlay" onClick={() => setCancelOrderId(null)}>
          <div className="modal-content confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Cancel Order?</h3>
            <p>Are you sure you want to cancel this order?</p>
            <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
              Note: The order will be marked as cancelled but will remain in your order history.
            </p>
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setCancelOrderId(null)}
                disabled={cancelMutation.isLoading}
              >
                No, Keep Order
              </button>
              <button
                className="btn-confirm"
                onClick={handleCancelOrder}
                disabled={cancelMutation.isLoading}
              >
                {cancelMutation.isLoading ? 'Cancelling...' : 'Yes, Cancel Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserViewOrders;