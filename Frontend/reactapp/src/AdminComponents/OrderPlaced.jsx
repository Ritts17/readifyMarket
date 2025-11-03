import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToasts } from 'react-toast-notifications';
import { orderAPI, getImageUrl } from '../apiConfig';
import AdminNav from './AdminNav';
import './OrderPlaced.css';

const OrderPlaced = () => {
  const { addToast } = useToasts();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('Sort by Date: Ascending');
  const [currentPage, setCurrentPage] = useState(1);
  const [showBooksModal, setShowBooksModal] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const ordersPerPage = 5;

  // Fetch all orders from backend
  const { data: backendData, isLoading, isError } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: async () => {
      const response = await orderAPI.getAllOrders();
      return response.data;
    },
    retry: 1,
  });

  const orders = Array.isArray(backendData) ? backendData : [];

  // Update order status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }) => {
      const response = await orderAPI.updateOrder(orderId, { orderStatus: status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminOrders']);
      addToast('Order status updated successfully', { appearance: 'success' });
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Failed to update status';
      addToast(errorMessage, { appearance: 'error' });
    }
  });

  // Filter orders based on search term and status filter
  const filteredOrders = orders.filter(order => {
    const orderId = order._id?.toLowerCase() || '';
    const userName = order.user?.userName?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();

    const matchesSearch = orderId.includes(search) || userName.includes(search);
    const matchesStatus = statusFilter === 'All' || order.orderStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sort orders by date
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const dateA = new Date(a.orderDate || a.createdAt);
    const dateB = new Date(b.orderDate || b.createdAt);
    return sortOrder === 'Sort by Date: Ascending' ? dateA - dateB : dateB - dateA;
  });

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(sortedOrders.length / ordersPerPage);

  const handleStatusChange = (orderId, newStatus, currentStatus) => {
    // Prevent modification of cancelled orders
    if (currentStatus === 'Cancelled') {
      addToast('Cancelled orders cannot be modified', { appearance: 'warning' });
      return;
    }

    updateStatusMutation.mutate({ orderId, status: newStatus });
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
  //     <div className="orders-placed-container">
  //       <AdminNav />
  //       <div className="orders-content">
  //         <div className="loading">Loading orders...</div>
  //       </div>
  //     </div>
  //   );
  // }

  // if (isError) {
  //   return (
  //     <div className="orders-placed-container">
  //       <AdminNav />
  //       <div className="orders-content">
  //         <h1 className="page-title">Orders Placed</h1>
  //         <div style={{ textAlign: 'center', padding: '40px', color: '#dc3545' }}>
  //           Failed to load orders. Please check your connection and try again.
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }


  if (isLoading) {
    return (
      <div className="orders-placed-container">
        <AdminNav />
        <div className="orders-content">
          <div className="page-header">
            <span className='page-title'>Orders Placed</span>
          </div>

          <div className="filters-section">
            <input
              type="text"
              placeholder="Search orders"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="loading">Loading orders...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="orders-placed-container">
        <AdminNav />
        <div className="orders-content">
          <div className="page-header">
            <span className='page-title'>Orders Placed</span>
          </div>
          <div style={{ textAlign: 'center', padding: '40px', color: '#dc3545' }}>
            Failed to load orders. Please check your connection and try again.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-placed-container">
      <AdminNav />

      <div className="orders-content">
        <div className="page-header">
          <span className='page-title'>Orders Placed</span>
        </div>

        <div className="filters-section">
          <input
            type="text"
            placeholder="Search orders"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="sort-select"
          >
            <option value="All">All Orders</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="sort-select"
          >
            <option>Sort by Date: Ascending</option>
            <option>Sort by Date: Descending</option>
          </select>
        </div>

        <div className="orders-list">
          {currentOrders.length > 0 ? (
            currentOrders.map((order) => {
              console.log(order);
              return <div
                key={order._id}
                className={`order-card ${order.orderStatus === 'Cancelled' ? 'cancelled-order' : ''}`}
              >
                <div className="order-header">
                  <h3>Order ID: {order._id}</h3>
                  <span className={`status-badge ${order.orderStatus?.toLowerCase()}`}>
                    {order.orderStatus}
                  </span>
                </div>

                <div className="order-details">
                  <p><strong>Date:</strong> {formatDate(order.orderDate || order.createdAt)}</p>
                  <p><strong>Customer:</strong> {order.user?.userName || 'N/A'}</p>
                  <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
                  <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
                  <p><strong>Billing Address:</strong> {order.billingAddress}</p>
                  <p><strong>Items:</strong> {order.orderItems?.length || 0} book(s)</p>
                </div>

                {order.orderStatus === 'Cancelled' && (
                  <div style={{
                    padding: '10px',
                    backgroundColor: '#f8d7da',
                    border: '1px solid #dc3545',
                    borderRadius: '4px',
                    marginTop: '10px',
                    fontSize: '14px',
                    color: '#721c24'
                  }}>
                    This order was cancelled. Stock quantities have been restored. This order cannot be modified.
                  </div>
                )}

                <div className="order-actions">
                  <label>Update Status:</label>
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleStatusChange(order._id, e.target.value, order.orderStatus)}
                    className="status-select"
                    disabled={updateStatusMutation.isLoading || order.orderStatus === 'Cancelled'}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  {order.orderStatus === 'Cancelled' && (
                    <span style={{ color: '#dc3545', fontSize: '12px', marginLeft: '8px' }}>
                      (Cannot be modified)
                    </span>
                  )}
                </div>

                <div className="order-buttons">
                  <button
                    className="view-books-btn"
                    onClick={() => setShowBooksModal(order)}
                  >
                    View Books
                  </button>
                  <button
                    className="view-profile-btn"
                    onClick={() => setShowProfileModal(order.user)}
                  >
                    View Customer Profile
                  </button>
                </div>
              </div>
            })
          ) : (
            <div className="no-orders">
              {searchTerm || statusFilter !== 'All'
                ? 'No orders found matching your filters.'
                : 'No orders placed yet.'}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="page-btn"
            >
              Previous
            </button>
            <span className="page-info">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="page-btn"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Books Modal */}
      {showBooksModal && (
        <div className="modal-overlay" onClick={() => setShowBooksModal(null)}>
          <div className="modal-content books-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowBooksModal(null)}>×</button>
            <h3>Ordered Books</h3>
            <div className="books-list">
              {showBooksModal.orderItems && showBooksModal.orderItems.length > 0 ? (
                showBooksModal.orderItems.map((item, idx) => (
                  <div key={idx} className="book-item">
                    <img
                      src={getImageUrl(item.book?.coverImage)}
                      alt={item.book?.title || 'Book'}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/100x150?text=No+Image';
                      }}
                    />
                    <div className="book-info">
                      <strong>{item.book?.title || 'Unknown Title'}</strong>
                      <p>Category: {item.book?.category || 'N/A'}</p>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: ₹{item.price}</p>
                      <p><strong>Subtotal: ₹{item.price * item.quantity}</strong></p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No books information available</p>
              )}
            </div>
            <div className="modal-total">
              <strong>Total Amount: ₹{showBooksModal.totalAmount}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="modal-overlay" onClick={() => setShowProfileModal(null)}>
          <div className="modal-content profile-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowProfileModal(null)}>×</button>
            <h3>Customer Profile</h3>
            <div className="profile-info">
              <p><strong>Username:</strong> {showProfileModal.userName || 'N/A'}</p>
              <p><strong>Email:</strong> {showProfileModal.email || 'N/A'}</p>
              <p><strong>Mobile:</strong> {showProfileModal.mobileNumber || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPlaced;