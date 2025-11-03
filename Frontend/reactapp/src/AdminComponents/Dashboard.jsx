import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import AdminNav from './AdminNav';
import './Dashboard.css';
import { userAPI, bookAPI, orderAPI, reviewAPI } from '../apiConfig';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    totalOrders: 0,
    totalReviews: 0
  });
  const [users, setUsers] = useState([]);

  // Check authentication and role
  useEffect(() => {
    const currentUser = userAPI.getCurrentUser();
    if (!currentUser.token || currentUser.userRole !== 'admin') {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch all users directly
  const { data: usersData } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await userAPI.getAllUsers();
      return response.data;
    },
    retry: 1,
    onError: (error) => {
      console.error('Error fetching users:', error);
    }
  });

  // Fetch all books
  const { data: booksData } = useQuery({
    queryKey: ['books'],
    queryFn: async () => {
      const response = await bookAPI.getAllBooks();
      return response.data;
    },
    retry: 1,
    onError: (error) => {
      console.error('Error fetching books:', error);
    }
  });

  // Fetch all orders
  const { data: ordersData } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await orderAPI.getAllOrders();
      return response.data;
    },
    retry: 1,
    onError: (error) => {
      console.error('Error fetching orders:', error);
    }
  });

  // Fetch all reviews
  const { data: reviewsData } = useQuery({
    queryKey: ['allReviews'],
    queryFn: async () => {
      const response = await reviewAPI.getAllReviews();
      return response.data;
    },
    retry: 1,
    onError: (error) => {
      console.error('Error fetching reviews:', error);
    }
  });

  // Update stats when data is fetched
  useEffect(() => {
    const newStats = {
      totalUsers: 0,
      totalBooks: 0,
      totalOrders: 0,
      totalReviews: 0
    };

    // Count books
    if (booksData && Array.isArray(booksData)) {
      newStats.totalBooks = booksData.length;
    }

    // Count orders
    if (ordersData && Array.isArray(ordersData)) {
      newStats.totalOrders = ordersData.length;
    }

    // Count and display users
    if (usersData && Array.isArray(usersData)) {
      newStats.totalUsers = usersData.length;
      setUsers(usersData);
    }

    // Count reviews - handle both array and object with reviews property
    if (reviewsData) {
      if (Array.isArray(reviewsData)) {
        newStats.totalReviews = reviewsData.length;
      } else if (reviewsData.reviews && Array.isArray(reviewsData.reviews)) {
        newStats.totalReviews = reviewsData.reviews.length;
      }
    }

    setStats(newStats);
  }, [usersData, booksData, ordersData, reviewsData]);

  return (
    <div className="dashboard-container">
      <AdminNav />
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>📚 Readify Market - Admin Dashboard</h1>
        </div>

        <div className="stats-grid">
          <div className="stat-card blue">
            <h3>Total Users</h3>
            <p className="stat-number">{stats.totalUsers}</p>
          </div>

          <div className="stat-card green">
            <h3>Total Books</h3>
            <p className="stat-number">{stats.totalBooks}</p>
          </div>

          <div className="stat-card orange">
            <h3>Total Orders</h3>
            <p className="stat-number">{stats.totalOrders}</p>
          </div>

          <div className="stat-card purple">
            <h3>Total Reviews</h3>
            <p className="stat-number">{stats.totalReviews}</p>
          </div>
        </div>

        <div className="users-section">
          <h2>Users List</h2>
          <div className="users-table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Mobile Number</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.userName}</td>
                      <td>{user.email}</td>
                      <td>{user.mobileNumber}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center' }}>
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;