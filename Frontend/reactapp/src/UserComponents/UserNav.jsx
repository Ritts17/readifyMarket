import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearUserInfo } from '../userSlice';
import { useCart } from '../CartContext';
import { useToasts } from 'react-toast-notifications';
import './UserNav.css';
import { userAPI } from '../apiConfig';

const UserNav = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const { userName } = useSelector((state) => state.user);
  
  let cart = [];
  let clearCart = () => {};
  
  try {
    const cartContext = useCart();
    cart = cartContext.cart;
    clearCart = cartContext.clearCart;
  } catch (error) {
    console.warn('CartProvider not available, cart features disabled');
  }
  
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showBooksDropdown, setShowBooksDropdown] = useState(false);
  const [showReviewDropdown, setShowReviewDropdown] = useState(false);
  
  const booksDropdownRef = useRef(null);
  const reviewDropdownRef = useRef(null);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (booksDropdownRef.current && !booksDropdownRef.current.contains(event.target)) {
        setShowBooksDropdown(false);
      }
      if (reviewDropdownRef.current && !reviewDropdownRef.current.contains(event.target)) {
        setShowReviewDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await userAPI.logout();
      dispatch(clearUserInfo());
      
      clearCart();
      
      addToast('Logged out successfully', { appearance: 'success' });
      
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      dispatch(clearUserInfo());
      clearCart();
      addToast('Logged out successfully', { appearance: 'success' });
      navigate('/login');
    }
  };

  const handleCheckout = () => {
    setShowCartModal(false);
    navigate('/checkout');
  };

  const handleClearCart = () => {
    clearCart();
    addToast('Cart cleared', { appearance: 'info' });
  };

  const toggleBooksDropdown = () => {
    setShowBooksDropdown(!showBooksDropdown);
    setShowReviewDropdown(false); // Close other dropdown
  };

  const toggleReviewDropdown = () => {
    setShowReviewDropdown(!showReviewDropdown);
    setShowBooksDropdown(false); // Close other dropdown
  };

  return (
    <>
      <nav className="user-nav">
        <div className="nav-brand">
          <Link to="/home">Readify Market</Link>
        </div>

        <div className="nav-user-info">
          <span className="nav-username">{userName} / User</span>
        </div>

        <ul className="nav-menu">
          <li><Link to="/home">Home</Link></li>

          <li className="dropdown" ref={booksDropdownRef}>
            <span 
              className="dropdown-trigger"
              onClick={toggleBooksDropdown}
            >
              <span>Books</span> <span>{showBooksDropdown ? '▲' : '▼'}</span>
            </span>
            {showBooksDropdown && (
              <ul className="dropdown-menu">
                <li>
                  <Link 
                    to="/books"
                    onClick={() => setShowBooksDropdown(false)}
                  >
                    View Books
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/my-orders"
                    onClick={() => setShowBooksDropdown(false)}
                  >
                    My Orders
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li className="dropdown" ref={reviewDropdownRef}>
            <span 
              className="dropdown-trigger"
              onClick={toggleReviewDropdown}
            >
              <span>Review</span> <span>{showReviewDropdown ? '▲' : '▼'}</span>
            </span>
            {showReviewDropdown && (
              <ul className="dropdown-menu">
                <li>
                  <Link 
                    to="/my-reviews"
                    onClick={() => setShowReviewDropdown(false)}
                  >
                    My Reviews
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li>
            <button
              className="cart-button"
              onClick={() => setShowCartModal(true)}
            >
              🛒
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          </li>

          <li>
            <button
              className="logout-button"
              onClick={() => setShowLogoutModal(true)}
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowLogoutModal(false)}>
                Cancel
              </button>
              <button className="btn-confirm" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {showCartModal && (
        <div className="cart-overlay" onClick={() => setShowCartModal(false)}>
          <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cart-header">
              <h3>Your Cart</h3>
              <button className="close-btn" onClick={() => setShowCartModal(false)}>×</button>
            </div>

            <div className="cart-body">
              {cart.length === 0 ? (
                <p className="empty-cart">Your cart is empty.</p>
              ) : (
                <>
                  {cart.map((item) => (
                    <div key={item._id} className="cart-item">
                      <strong>{item.title}</strong>
                      <p>Quantity: {item.quantity}</p>
                    </div>
                  ))}
                </>
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-footer">
                <button className="clear-cart-btn" onClick={handleClearCart}>
                  Clear Cart
                </button>
                <button className="checkout-btn" onClick={handleCheckout}>
                  Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UserNav;