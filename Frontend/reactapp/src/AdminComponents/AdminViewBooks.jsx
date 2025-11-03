import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import { bookAPI, getImageUrl } from '../apiConfig';
import AdminNav from './AdminNav';
import './AdminViewBooks.css';

const AdminViewBooks = () => {
  const navigate = useNavigate();
  const { addToast } = useToasts();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteBookId, setDeleteBookId] = useState(null);
  const booksPerPage = 5;

  const { data: books, isLoading, isError, error } = useQuery({
    queryKey: ['adminBooks'],
    queryFn: async () => {
      const response = await bookAPI.getAllBooks();
      return response.data;
    },
    retry: 1,
    initialData: []
  });

  const deleteMutation = useMutation({
    mutationFn: async (bookId) => {
      const response = await bookAPI.deleteBook(bookId);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['adminBooks']);
      addToast('Book deleted successfully', { appearance: 'success' });
      setDeleteBookId(null);
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Failed to delete book';
      addToast(errorMessage, { appearance: 'error' });
    }
  });

  // Ensure books is always an array
  const booksArray = Array.isArray(books) ? books : [];

  const filteredBooks = booksArray.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || book.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const handleEdit = (book) => {
    // Fixed: Use correct route and pass book via state
    navigate('/admin/books/add', { state: { book } });
  };

  const handleDelete = (bookId) => {
    setDeleteBookId(bookId);
  };

  const confirmDelete = () => {
    deleteMutation.mutate(deleteBookId);
  };

  if (isLoading) {
    return (
      <div className="admin-view-books-container">
        <AdminNav />
        <div className="admin-books-content">
          <div className="loading">Loading books...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="admin-view-books-container">
        <AdminNav />
        <div className="admin-books-content">
          <div className="error-message">
            Error loading books: {error?.response?.data?.message || error?.message || 'Unknown error'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-view-books-container">
      <AdminNav />
      
      <div className="admin-books-content">
        <h1 className="page-title">📚 Manage Books</h1>

        <div className="filters-section">
          <input
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="category-filter"
          >
            <option value="">All Categories</option>
            <option value="Fiction">Fiction</option>
            <option value="Non-fiction">Non-fiction</option>
            <option value="Science">Science</option>
            <option value="Thriller">Thriller</option>
            <option value="Romance">Romance</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Comics">Comics</option>
            <option value="Children">Children</option>
          </select>
        </div>

        <div className="books-grid">
          {currentBooks.length > 0 ? (
            currentBooks.map((book) => (
              <div key={book._id} className="book-card">
                {/* Fixed: Use getImageUrl helper to prepend backend URL */}
                <img 
                  src={getImageUrl(book.coverImage)} 
                  alt={book.title} 
                  className="book-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/200x300?text=No+Image';
                  }}
                />
                <div className="book-details">
                  <h3>{book.title}</h3>
                  <p className="book-description">{book.description}</p>
                  <p><strong>Author:</strong> {book.author}</p>
                  <p><strong>Price:</strong> ₹{book.price}</p>
                  <p><strong>Stock:</strong> {book.stockQuantity}</p>
                  <p><strong>Category:</strong> {book.category}</p>
                  <div className="book-actions">
                    <button className="edit-btn" onClick={() => handleEdit(book)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(book._id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-books">No books found matching your criteria.</div>
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

      {deleteBookId && (
        <div className="modal-overlay" onClick={() => setDeleteBookId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Are you sure you want to delete this book?</h3>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setDeleteBookId(null)}>Cancel</button>
              <button 
                className="btn-confirm" 
                onClick={confirmDelete}
                disabled={deleteMutation.isLoading}
              >
                {deleteMutation.isLoading ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminViewBooks;