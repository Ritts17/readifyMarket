import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { reviewAPI, getImageUrl } from '../apiConfig';
import UserNav from './UserNav';
import './UserMyReview.css';

const UserMyReview = () => {
  const { addToast } = useToasts();
  const queryClient = useQueryClient();
  const { userId } = useSelector((state) => state.user);
  const [deleteReviewId, setDeleteReviewId] = useState(null);
  const [showBookModal, setShowBookModal] = useState(null);

  // Fetch user's reviews
  const { data: reviewsData, isLoading, error } = useQuery({
    queryKey: ['myReviews', userId],
    queryFn: async () => {
      const response = await reviewAPI.getReviewsByUserId(userId);
      return response.data;
    },
    enabled: !!userId
  });

  // Delete review mutation
  const deleteMutation = useMutation({
    mutationFn: async (reviewId) => {
      return await reviewAPI.deleteReview(reviewId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['myReviews']);
      addToast('Review deleted successfully', { appearance: 'success' });
      setDeleteReviewId(null);
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Failed to delete review';
      addToast(errorMessage, { appearance: 'error' });
    }
  });

  const reviews = reviewsData?.reviews || [];

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const handleDelete = () => {
    deleteMutation.mutate(deleteReviewId);
  };

  // if (isLoading) {
  //   return (
  //     <div className="my-reviews-container">
  //       <UserNav />
  //       <div className="reviews-content">
  //         <div className="loading-message">Loading your reviews...</div>
  //       </div>
  //     </div>
  //   );
  // }

  // if (error) {
  //   return (
  //     <div className="my-reviews-container">
  //       <UserNav />
  //       <div className="reviews-content">
  //         <div className="error-message">
  //           Failed to load reviews. Please try again later.
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }


  if (isLoading) {
    return (
      <div className="my-reviews-container">
        <UserNav />
        <div className="reviews-content">
          <h1 className="page-title">My Book Reviews</h1>
          <div className="loading-message">Loading your reviews...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-reviews-container">
        <UserNav />
        <div className="reviews-content">
          <h1 className="page-title">My Book Reviews</h1>
          <div className="error-message">
            Failed to load reviews. Please try again later.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-reviews-container">
      <UserNav />

      <div className="reviews-content">
        <h1 className="page-title">My Book Reviews</h1>

        <div className="reviews-list">
          {reviews.length === 0 ? (
            <div className="no-reviews">
              <p>You haven't written any reviews yet.</p>
              <p>Start reviewing books you've read!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="review-card">
                <div className="review-header">
                  {review.book?.coverImage && (
                    <img
                      src={getImageUrl(review.book.coverImage)}
                      alt={review.book.title}
                      className="review-book-thumbnail"
                    />
                  )}
                  <div className="review-header-info">
                    <h3>{review.book?.title || 'Book Not Found'}</h3>
                    <div className="rating">
                      Rating: {renderStars(review.rating)}
                    </div>
                    <p className="review-date">
                      <strong>Date:</strong> {new Date(review.createdAt || review.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <p className="review-text">{review.reviewText}</p>

                <div className="review-actions">
                  {review.book && (
                    <button
                      className="view-book-btn"
                      onClick={() => setShowBookModal(review.book)}
                    >
                      View Book
                    </button>
                  )}
                  <button
                    className="delete-btn"
                    onClick={() => setDeleteReviewId(review._id)}
                    disabled={deleteMutation.isLoading}
                  >
                    {deleteMutation.isLoading && deleteReviewId === review._id
                      ? 'Deleting...'
                      : 'Delete Review'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showBookModal && (
        <div className="modal-overlay" onClick={() => setShowBookModal(null)}>
          <div className="modal-content book-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowBookModal(null)}>×</button>
            {showBookModal.coverImage && (
              <img
                src={getImageUrl(showBookModal.coverImage)}
                alt={showBookModal.title}
                className="book-modal-image"
              />
            )}
            <h3>{showBookModal.title}</h3>
            {showBookModal.author && (
              <p><strong>Author:</strong> {showBookModal.author}</p>
            )}
            <p><strong>Price:</strong> ₹{showBookModal.price}</p>
            <p><strong>Category:</strong> {showBookModal.category}</p>
            {showBookModal.description && (
              <p className="book-description">{showBookModal.description}</p>
            )}
          </div>
        </div>
      )}

      {deleteReviewId && (
        <div className="modal-overlay" onClick={() => setDeleteReviewId(null)}>
          <div className="modal-content confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Review?</h3>
            <p>Are you sure you want to delete this review? This action cannot be undone.</p>
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setDeleteReviewId(null)}
                disabled={deleteMutation.isLoading}
              >
                Cancel
              </button>
              <button
                className="btn-confirm"
                onClick={handleDelete}
                disabled={deleteMutation.isLoading}
              >
                {deleteMutation.isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMyReview;