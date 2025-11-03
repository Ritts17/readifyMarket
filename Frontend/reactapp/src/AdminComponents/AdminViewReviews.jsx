import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminNav from './AdminNav';
import { reviewAPI } from '../apiConfig';
import './AdminViewReviews.css';

const AdminViewReviews = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('Sort by Date: Descending');
  const [currentPage, setCurrentPage] = useState(1);
  const [showBookModal, setShowBookModal] = useState(null);
  const [showUserModal, setShowUserModal] = useState(null);
  const reviewsPerPage = 5;

  // Fetch reviews from backend using apiConfig
  const { data: reviewsData, isError, isLoading, error } = useQuery({
    queryKey: ['adminReviews'],
    queryFn: async () => {
      const response = await reviewAPI.getAllReviews();
      return response.data;
    },
    retry: 2,
    staleTime: 30000,
  });

  const reviews = reviewsData?.reviews || [];

  // Normalize data structure (handle both userId/bookId and user/book naming)
  const normalizedReviews = reviews.map(review => {
    const userInfo = review.user || review.userId;
    const bookInfo = review.book || review.bookId;
    
    return {
      ...review,
      userId: userInfo,
      bookId: bookInfo,
      user: userInfo,
      book: bookInfo
    };
  });

  // Filter reviews
  const filteredReviews = normalizedReviews.filter(review => {
    const searchLower = searchTerm.toLowerCase();
    return (
      review.bookId?.title?.toLowerCase().includes(searchLower) ||
      review.userId?.userName?.toLowerCase().includes(searchLower) ||
      review.bookId?.author?.toLowerCase().includes(searchLower) ||
      review.reviewText?.toLowerCase().includes(searchLower)
    );
  });

  // Sort reviews
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === 'Sort by Date: Ascending' ? dateA - dateB : dateB - dateA;
  });

  // Pagination
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = sortedReviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(sortedReviews.length / reviewsPerPage);

  // Render star rating
  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="admin-reviews-container">
      <AdminNav />
      
      <div className="reviews-content">
        <div className="page-header">
          <h1 className="page-title">View Reviews</h1>
        </div>

        <div className="filters-section">
          <input
            type="text"
            placeholder="Search reviews"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="sort-select"
          >
            <option>Sort by Date: Ascending</option>
            <option>Sort by Date: Descending</option>
          </select>
        </div>

        {isLoading ? (
          <div className="loading-state">Loading reviews...</div>
        ) : isError ? (
          <div className="error-state">
            <p>Failed to load reviews from backend.</p>
            <p className="error-message">{error?.message || 'Please try again later.'}</p>
          </div>
        ) : (
          <>
            <div className="reviews-list">
              {currentReviews.length > 0 ? (
                currentReviews.map((review) => (
                  <div key={review._id} className="review-card">
                    <div className="review-header">
                      <div className="review-title-section">
                        <h3>{review.bookId?.title || 'Unknown Book'}</h3>
                        <p className="review-author">by {review.bookId?.author || 'Unknown Author'}</p>
                      </div>
                      <div className="rating">{renderStars(review.rating)}</div>
                    </div>

                    <div className="review-meta">
                      <span className="reviewer">
                        Reviewed by <strong>{review.userId?.userName || 'Anonymous'}</strong>
                      </span>
                      <span className="review-date">{formatDate(review.createdAt)}</span>
                    </div>

                    <p className="review-text">"{review.reviewText}"</p>
                    
                    <div className="review-buttons">
                      <button 
                        className="view-book-btn" 
                        onClick={() => setShowBookModal(review.bookId)}
                      >
                        View Book Details
                      </button>
                      <button 
                        className="view-user-btn" 
                        onClick={() => setShowUserModal(review.userId)}
                      >
                        View User Profile
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-reviews">
                  <p>
                    {searchTerm 
                      ? 'No reviews found matching your search.' 
                      : 'No reviews available yet.'}
                  </p>
                  {searchTerm && (
                    <button 
                      className="clear-search-btn" 
                      onClick={() => setSearchTerm('')}
                    >
                      Clear Search
                    </button>
                  )}
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
                <span className="page-info">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="page-btn"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Book Details Modal */}
      {showBookModal && (
        <div className="modal-overlay" onClick={() => setShowBookModal(null)}>
          <div className="modal-content book-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowBookModal(null)}>×</button>
            <h3>Book Details</h3>
            <div className="book-modal-content">
              <img 
                src={showBookModal.coverImage} 
                alt={showBookModal.title} 
                className="book-modal-image"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/200x280?text=Book+Cover';
                }}
              />
              <div className="book-modal-details">
                <div className="detail-row">
                  <span className="detail-label">Title:</span>
                  <span>{showBookModal.title}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Author:</span>
                  <span>{showBookModal.author}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Category:</span>
                  <span>{showBookModal.category}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Price:</span>
                  <span className="price">₹{showBookModal.price?.toLocaleString('en-IN')}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Book ID:</span>
                  <span className="book-id">{showBookModal._id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Profile Modal */}
      {showUserModal && (
        <div className="modal-overlay" onClick={() => setShowUserModal(null)}>
          <div className="modal-content user-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowUserModal(null)}>×</button>
            <h3>User Profile</h3>
            <div className="user-modal-details">
              <div className="detail-row">
                <span className="detail-label">Username:</span>
                <span>{showUserModal.userName}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span>{showUserModal.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Mobile Number:</span>
                <span>{showUserModal.mobileNumber}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">User ID:</span>
                <span className="user-id">{showUserModal._id}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminViewReviews;