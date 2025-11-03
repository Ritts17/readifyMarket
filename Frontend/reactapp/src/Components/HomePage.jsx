import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import AdminNav from '../AdminComponents/AdminNav';
import UserNav from '../UserComponents/UserNav';
import './HomePage.css';
import bgImg from '../assets/images/Cover.jpg';

const HomePage = () => {
  // Get userRole from Redux or localStorage as fallback
  const userRoleFromRedux = useSelector((state) => state.user.userRole);
  const userRole = userRoleFromRedux || localStorage.getItem('userRole');

  // Debug: Log the user role to console
  useEffect(() => {
    console.log('HomePage - User Role:', userRole);
    console.log('HomePage - Role from Redux:', userRoleFromRedux);
    console.log('HomePage - Role from localStorage:', localStorage.getItem('userRole'));
  }, [userRole, userRoleFromRedux]);

  // Check if user is admin (case-insensitive)
  const isAdmin = userRole?.toLowerCase() === 'admin';

  console.log('Is Admin?', isAdmin);

  return (
    <div className="homepage-container">
      {/* Use lowercase comparison */}
      {isAdmin ? <AdminNav /> : <UserNav />}
      
      <div className="homepage-content">
        <div className="hero-section">
          <img 
            src={bgImg}
            alt="Bookshelf" 
            className="hero-image"
          />
          <div className="hero-overlay">
            <h1 className="hero-title">Readify Market</h1>
            <p className="hero-subtitle">
              Welcome to <strong>Readify Market</strong>, your one-stop destination for premium books across genres. 
              Explore a wide range of Fiction, Non-fiction, Science, Comics, Romance, Thriller, Fantasy, and Children's books. 
              Whether you're a casual reader or a book enthusiast, find your next favorite read here. 
              Start exploring today and enrich your reading journey!
            </p>
          </div>
        </div>

        <div className="contact-section">
          <h2 className="contact-heading">Contact Us</h2>
          <div className="contact-card">
            <div className="contact-item">
              <strong>Phone:</strong> +91 98765 43210
            </div>
            <div className="contact-item">
              <strong>Email:</strong> support@readifymarket.com
            </div>
            <div className="contact-item">
              <strong>Address:</strong> 123 Book Lane, Literature City, IN
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;