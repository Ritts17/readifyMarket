import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import {bookAPI} from '../apiConfig';
import AdminNav from './AdminNav';
import './BookForm.css';

const BookForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToasts();
  const editBook = location.state?.book;

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    stockQuantity: '',
    category: '',
    description: '',
    coverImage: null
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editBook) {
      setFormData({
        title: editBook.title,
        author: editBook.author,
        price: editBook.price,
        stockQuantity: editBook.stockQuantity,
        category: editBook.category,
        description: editBook.description,
        coverImage: null
      });
      setImagePreview(editBook.coverImage);
    }
  }, [editBook]);

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Book title is required';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }

    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a valid number';
    }

    if (!formData.stockQuantity) {
      newErrors.stockQuantity = 'Stock Quantity is required';
    } else if (isNaN(formData.stockQuantity) || Number(formData.stockQuantity) < 0) {
      newErrors.stockQuantity = 'Stock Quantity must be a valid number';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!editBook && !formData.coverImage) {
      newErrors.coverImage = 'Cover Image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        coverImage: file
      });
      setImagePreview(URL.createObjectURL(file));
      if (errors.coverImage) {
        setErrors({
          ...errors,
          coverImage: ''
        });
      }
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validate()) {
    return;
  }

  setIsSubmitting(true);

  try {
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title.trim());
    formDataToSend.append('author', formData.author.trim());
    formDataToSend.append('description', formData.description.trim());
    formDataToSend.append('price', formData.price);
    formDataToSend.append('stockQuantity', formData.stockQuantity);
    formDataToSend.append('category', formData.category);
    
    // Only append coverImage if it's a File object (new upload)
    if (formData.coverImage && formData.coverImage instanceof File) {
      formDataToSend.append('coverImage', formData.coverImage);
    }
    // For edit mode without new image, don't append anything
    // The backend will keep the existing image

    let response;
    if (editBook) {
      response = await bookAPI.updateBook(editBook._id, formDataToSend);
    } else {
      response = await bookAPI.addBook(formDataToSend);
    }

    if (response.data) {
      setShowSuccessModal(true);
    }
  } catch (error) {
    console.error('Submit error:', error);
    const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
    addToast(errorMessage, { appearance: 'error' });
  } finally {
    setIsSubmitting(false);
  }
};

  const handleModalClose = () => {
    setShowSuccessModal(false);
    navigate('/admin/view-books');
  };

  return (
    <div className="book-form-container">
      <AdminNav />
      
      <div className="book-form-content">
        <div className="book-form-wrapper">
          <h1 className="form-title">{editBook ? 'Edit Book' : 'Add New Book'}</h1>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Book Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={errors.title ? 'error-input' : ''}
                disabled={isSubmitting}
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label>Author *</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className={errors.author ? 'error-input' : ''}
                disabled={isSubmitting}
              />
              {errors.author && <span className="error-message">{errors.author}</span>}
            </div>

            <div className="form-group">
              <label>Price *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={errors.price ? 'error-input' : ''}
                disabled={isSubmitting}
              />
              {errors.price && <span className="error-message">{errors.price}</span>}
            </div>

            <div className="form-group">
              <label>Stock Quantity *</label>
              <input
                type="number"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleChange}
                className={errors.stockQuantity ? 'error-input' : ''}
                disabled={isSubmitting}
              />
              {errors.stockQuantity && <span className="error-message">{errors.stockQuantity}</span>}
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={errors.category ? 'error-input' : ''}
                disabled={isSubmitting}
              >
                <option value="">Select Category</option>
                <option value="Fiction">Fiction</option>
                <option value="Non-fiction">Non-fiction</option>
                <option value="Science">Science</option>
                <option value="Thriller">Thriller</option>
                <option value="Romance">Romance</option>
                <option value="Fantasy">Fantasy</option>
                <option value="Comics">Comics</option>
                <option value="Children">Children</option>
              </select>
              {errors.category && <span className="error-message">{errors.category}</span>}
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className={errors.description ? 'error-input' : ''}
                disabled={isSubmitting}
              />
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>

            <div className="form-group">
              <label>Cover Image *</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className={errors.coverImage ? 'error-input' : ''}
                disabled={isSubmitting}
              />
              {errors.coverImage && <span className="error-message">{errors.coverImage}</span>}
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Cover preview" />
                </div>
              )}
            </div>

            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : (editBook ? 'Update Book' : 'Add Book')}
            </button>
          </form>
        </div>
      </div>

      {showSuccessModal && (
        <div className="modal-overlay" onClick={handleModalClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editBook ? 'Book Updated Successfully!' : 'Book Added Successfully!'}</h3>
            <button className="modal-button" onClick={handleModalClose}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookForm;