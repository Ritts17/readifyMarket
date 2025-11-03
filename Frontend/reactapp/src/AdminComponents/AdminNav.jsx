import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearUserInfo } from '../userSlice';
import { useToasts } from 'react-toast-notifications';
import { userAPI } from '../apiConfig';
import './AdminNav.css';

const AdminNav = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const { userName } = useSelector((state) => state.user);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showBooksDropdown, setShowBooksDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowBooksDropdown(false);
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
      
      addToast('Logged out successfully', { appearance: 'success' });
      
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      dispatch(clearUserInfo());
      addToast('Logged out successfully', { appearance: 'success' });
      navigate('/login');
    }
  };

  const toggleBooksDropdown = () => {
    setShowBooksDropdown(!showBooksDropdown);
  };

  return (
    <>
      <nav className="admin-nav">
        <div className="nav-brand">
          <Link to="/home">Readify Market</Link>
        </div>

        <div className="nav-user-info">
          <span className="nav-username">{userName} / Admin</span>
        </div>

        <ul className="nav-menu">
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/admin/dashboard">Dashboard</Link></li>
          <li className="dropdown" ref={dropdownRef}>
            <span 
              className="dropdown-trigger" 
              onClick={toggleBooksDropdown}
            >
              Books {showBooksDropdown ? '▲' : '▼'}
            </span>
            {showBooksDropdown && (
              <ul className="dropdown-menu">
                <li>
                  <Link 
                    to="/admin/books/add"
                    onClick={() => setShowBooksDropdown(false)}
                  >
                    Add Book
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/admin/view-books"
                    onClick={() => setShowBooksDropdown(false)}
                  >
                    View Books
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li><Link to="/admin/orders">Orders</Link></li>
          <li><Link to="/admin/reviews">Reviews</Link></li>
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
    </>
  );
};

export default AdminNav;