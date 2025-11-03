import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';
import { useToasts } from 'react-toast-notifications';
import UserNav from './UserNav';
import './UserViewBooks.css';
import { bookAPI, reviewAPI, getImageUrl, userAPI } from '../apiConfig';

// Static fallback data for development/testing
const STATIC_BOOKS = [
  {
    _id: 'BOOK001',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    price: 349,
    category: 'Fiction',
    stockQuantity: 25,
    coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop',
    description: 'A gripping tale of racial injustice and childhood innocence'
  },
  {
    _id: 'BOOK002',
    title: '1984',
    author: 'George Orwell',
    price: 299,
    category: 'Fiction',
    stockQuantity: 30,
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop',
    description: 'A dystopian social science fiction novel and cautionary tale'
  }
];

const UserViewBooks = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToast } = useToasts();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [showReviewsModal, setShowReviewsModal] = useState(null);
  const booksPerPage = 6;

  // Check authentication
  useEffect(() => {
    const currentUser = userAPI.getCurrentUser();
    if (!currentUser.token || currentUser.userRole !== 'user') {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch books from backend
  const { data: booksData, isLoading, isError } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const response = await bookAPI.getAllBooks();
      return response.data;
    },
    retry: 1,
    staleTime: 30000,
    onError: (error) => {
      console.log('Backend not available, using static data:', error.message);
    }
  });

  // Fetch reviews for selected book
  const { data: reviewsData } = useQuery({
    queryKey: ['reviews', showReviewsModal?._id],
    queryFn: async () => {
      if (!showReviewsModal) return null;
      const response = await reviewAPI.getReviewsByBookId(showReviewsModal._id);
      return response.data;
    },
    enabled: !!showReviewsModal,
    retry: 1,
    onError: (error) => {
      console.log('Error fetching reviews:', error);
    }
  });

  // Determine which data to use
  const books = (!isError && booksData && Array.isArray(booksData)) 
    ? booksData 
    : STATIC_BOOKS;
  
  const isUsingStaticData = isError || !booksData || !Array.isArray(booksData);

  // Get reviews for modal
  const modalReviews = showReviewsModal 
    ? (reviewsData?.reviews || [])
    : [];

  // Filter books
  const filteredBooks = books.filter(book => {
    const searchLower = searchTerm.toLowerCase();
    return (
      book.title.toLowerCase().includes(searchLower) ||
      book.author.toLowerCase().includes(searchLower) ||
      book.category?.toLowerCase().includes(searchLower)
    );
  });

  // Pagination
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const handleQuantityChange = (bookId, quantity) => {
    setSelectedQuantities({
      ...selectedQuantities,
      [bookId]: parseInt(quantity)
    });
  };

  const handleAddToCart = (book) => {
    const quantity = selectedQuantities[book._id] || 1;
    
    if (quantity > book.stockQuantity) {
      addToast('Quantity exceeds available stock', { appearance: 'error' });
      return;
    }

    if (book.stockQuantity === 0) {
      addToast('This book is out of stock', { appearance: 'error' });
      return;
    }

    addToCart(book, quantity);
    addToast(`${book.title} added to cart!`, { appearance: 'success' });
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const getBookImage = (book) => {
    if (!book.coverImage) {
      return 'https://via.placeholder.com/200x280?text=Book+Cover';
    }
    
    // If it's already a full URL, use it
    if (book.coverImage.startsWith('http')) {
      return book.coverImage;
    }
    
    // Otherwise, use the helper function to construct the full URL
    return getImageUrl(book.coverImage);
  };

  return (
    <div className="user-books-container">
      <UserNav />
      
      <div className="books-content">
        <div className="page-header">
          <h1 className="page-title">📚 Browse Books</h1>
          {isUsingStaticData && (
            <div className="demo-badge" style={{ 
              background: '#ff9800', 
              color: 'white', 
              padding: '8px 16px', 
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              Demo Mode - Using Static Data
            </div>
          )}
        </div>

        <div className="search-section">
          <input
            type="text"
            placeholder="Search by title, author, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button 
              className="clear-search-btn"
              onClick={() => setSearchTerm('')}
            >
              Clear
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="loading">Loading books...</div>
        ) : (
          <>
            {currentBooks.length > 0 ? (
              <>
                <div className="books-grid">
                  {currentBooks.map((book) => (
                    <div key={book._id} className="book-card">
                      <div className="book-image-container">
                        <img 
                          src={getBookImage(book)}
                          alt={book.title} 
                          className="book-image"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/200x280?text=Book+Cover';
                          }}
                        />
                        {book.stockQuantity <= 5 && book.stockQuantity > 0 && (
                          <span className="low-stock-badge">Low Stock!</span>
                        )}
                        {book.stockQuantity === 0 && (
                          <span className="out-of-stock-badge">Out of Stock</span>
                        )}
                      </div>

                      <div className="book-info">
                        <h3 className="book-title">{book.title}</h3>
                        <p className="book-author">by {book.author}</p>
                        <p className="book-category">{book.category}</p>
                        <p className="book-price">₹{book.price.toLocaleString('en-IN')}</p>
                        
                        <p className={`stock-status ${
                          book.stockQuantity === 0 ? 'out-of-stock' : 
                          book.stockQuantity <= 5 ? 'low-stock' : 
                          'in-stock'
                        }`}>
                          {book.stockQuantity === 0 ? 'Out of Stock' :
                           book.stockQuantity <= 5 ? `Only ${book.stockQuantity} left` :
                           `In Stock: ${book.stockQuantity}`}
                        </p>
                        
                        {book.stockQuantity > 0 && (
                          <div className="quantity-section">
                            <label>Quantity:</label>
                            <select
                              value={selectedQuantities[book._id] || 1}
                              onChange={(e) => handleQuantityChange(book._id, e.target.value)}
                              className="quantity-select"
                            >
                              {[...Array(Math.min(10, book.stockQuantity))].map((_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                              ))}
                            </select>
                          </div>
                        )}

                        <button 
                          className="add-to-cart-btn"
                          onClick={() => handleAddToCart(book)}
                          disabled={book.stockQuantity === 0}
                        >
                          {book.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>

                        <div className="book-actions">
                          <button 
                            className="view-reviews-btn" 
                            onClick={() => setShowReviewsModal(book)}
                          >
                            📖 View Reviews
                          </button>
                          <button 
                            className="write-review-btn" 
                            onClick={() => navigate('/write-review', { state: { book } })}
                          >
                            ✍️ Write Review
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
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
            ) : (
              <div className="no-books">
                <p>No books found matching your search.</p>
                <button 
                  className="clear-search-btn"
                  onClick={() => setSearchTerm('')}
                >
                  Clear Search
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Reviews Modal */}
      {showReviewsModal && (
        <div className="modal-overlay" onClick={() => setShowReviewsModal(null)}>
          <div className="modal-content reviews-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowReviewsModal(null)}>×</button>
            
            <div className="modal-header">
              <div className="modal-book-info">
                <img 
                  src={getBookImage(showReviewsModal)}
                  alt={showReviewsModal.title}
                  className="modal-book-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/100x140?text=Book';
                  }}
                />
                <div>
                  <h3>{showReviewsModal.title}</h3>
                  <p className="modal-author">by {showReviewsModal.author}</p>
                </div>
              </div>
            </div>
            
            <div className="reviews-list">
              {modalReviews.length > 0 ? (
                modalReviews.map((review) => (
                  <div key={review._id} className="review-item">
                    <div className="review-header">
                      <strong className="reviewer-name">
                        {review.user?.userName || 'Anonymous'}
                      </strong>
                      <span className="review-rating">{renderStars(review.rating)}</span>
                    </div>
                    <p className="review-text">"{review.reviewText}"</p>
                    <p className="review-date">
                      {new Date(review.createdAt || review.date).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                ))
              ) : (
                <div className="no-reviews">
                  <p>No reviews yet for this book.</p>
                  <button 
                    className="write-first-review-btn"
                    onClick={() => {
                      setShowReviewsModal(null);
                      navigate('/write-review', { state: { book: showReviewsModal } });
                    }}
                  >
                    Be the first to review!
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserViewBooks;