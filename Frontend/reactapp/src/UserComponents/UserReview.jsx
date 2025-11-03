import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { reviewAPI } from '../apiConfig';
import UserNav from './UserNav';
import './UserReview.css';

const UserReview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToasts();
  const { userId } = useSelector((state) => state.user);
  const book = location.state?.book || {
    _id: 'temp-book-id-123',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    price: 299,
    category: 'Fiction'
  };

  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!book) {
    return (
      <div className="user-review-container">
        <UserNav />
        <div className="review-content">
          <div className="review-form-wrapper">
            <h1 className="form-title">📚 Share Your Thoughts</h1>
            <h2 className="book-title">No book selected</h2>
            <p>Please select a book to review.</p>
          </div>
        </div>
      </div>
    );
  }

  const emojis = [
    { value: 1, emoji: '😡', label: 'Angry' },
    { value: 2, emoji: '😔', label: 'Sad' },
    { value: 3, emoji: '😐', label: 'Neutral' },
    { value: 4, emoji: '😊', label: 'Happy' },
    { value: 5, emoji: '😍', label: 'Love' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!book) {
      addToast('No book selected', { appearance: 'error' });
      return;
    }

    if (!reviewText.trim()) {
      addToast('Please write a review', { appearance: 'error' });
      return;
    }

    if (rating === 0) {
      addToast('Please select a rating', { appearance: 'error' });
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewData = {
        user: userId,
        book: book._id,
        reviewText: reviewText.trim(),
        rating
      };

      const response = await reviewAPI.addReview(reviewData);

      if (response.status === 201) {
        addToast('Review submitted successfully!', { appearance: 'success' });
        setReviewText('');
        setRating(0);
        navigate('/books');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      const errorMessage = error.response?.data?.message || 'Failed to submit review';
      addToast(errorMessage, { appearance: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="user-review-container">
      <UserNav />

      <div className="review-content">
        <div className="review-form-wrapper">
          <h1 className="form-title">📚 Share Your Thoughts</h1>
          <h2 className="book-title">{book.title}</h2>
          <p className="book-author">by {book.author}</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <textarea
                rows="6"
                placeholder="Write your review here..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="review-textarea"
                disabled={isSubmitting}
              />
            </div>

            <div className="rating-section">
              <div className="emoji-ratings">
                {emojis.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    className={`emoji-btn ${rating === item.value ? 'selected' : ''}`}
                    onClick={() => setRating(item.value)}
                    disabled={isSubmitting}
                    title={item.label}
                  >
                    <span className="emoji">{item.emoji}</span>
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              className="submit-review-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserReview;