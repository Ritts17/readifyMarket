import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { userAPI } from '../apiConfig';

const PrivateRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { userId, userRole } = useSelector((state) => state.user);
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const validateAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUserId = localStorage.getItem('userId');
      const storedUserRole = localStorage.getItem('userRole');

      // If no token, redirect to login
      if (!token || !storedUserId) {
        setIsAuthenticated(false);
        setIsValidating(false);
        return;
      }

      try {
        // Validate token with backend
        const response = await userAPI.validateToken();
        
        if (response.data.valid) {
          // Update Redux store if needed
          if (!userId) {
            dispatch({
              type: 'SET_USER',
              payload: {
                userId: storedUserId,
                userName: localStorage.getItem('userName'),
                userRole: storedUserRole
              }
            });
          }
          setIsAuthenticated(true);
        } else {
          // Invalid token, clear storage
          localStorage.clear();
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Token validation failed:', error);
        localStorage.clear();
        setIsAuthenticated(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateAuth();
  }, [userId, dispatch]);

  // Show loading while validating
  if (isValidating) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  // Not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Get current user role
  const currentRole = userRole || localStorage.getItem('userRole');

  // Check if user has required role
  if (allowedRoles && !allowedRoles.includes(currentRole)) {
    // Redirect to appropriate dashboard based on role
    if (currentRole === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (currentRole === 'user') {
      return <Navigate to="/books" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  // User is authenticated and has correct role
  return children;
};

export default PrivateRoute;