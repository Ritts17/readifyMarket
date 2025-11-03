import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import { userAPI } from '../apiConfig';
import { setUserInfo } from '../userSlice';
import './Login.css';
import bgImg from '../assets/images/Cover.jpg';
import logo from '../assets/images/Cover.jpg';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/;

  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      // Use the API config to make the login request
      const response = await userAPI.login(formData);

      if (response.data) {
        const { userId, userName, role, token, message } = response.data;

        // ✅ Check if the response indicates invalid credentials
        if (message === "Invalid credentials" || message === "User not found") {
          addToast(message, { appearance: 'error' });
          setLoading(false);
          return;
        }

        // ✅ Check if token exists - if not, it's an error
        if (!token) {
          addToast('Login failed. Please check your credentials.', { appearance: 'error' });
          setLoading(false);
          return;
        }

        // ✅ Only proceed if we have valid user data
        if (userId && userName && role) {
          // Store user info in Redux
          dispatch(setUserInfo({
            userId: userId,
            userName: userName,
            userRole: role,
          }));

          // Store additional info in localStorage if needed
          localStorage.setItem('userId', userId);
          localStorage.setItem('userName', userName);
          localStorage.setItem('userRole', role);

          // Token is already stored by the API config
          addToast('Login successful!', { appearance: 'success' });

          // Navigate based on role
          if (role === 'admin') {
            navigate('/home');
          } else {
            navigate('/home');
          }
        } else {
          addToast('Login failed. Invalid response from server.', { appearance: 'error' });
        }
      }
    } catch (error) {
      // Handle errors from the API
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Login failed. Please check your credentials.';
      
      addToast(errorMessage, { appearance: 'error' });
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-image-section">
        <img src={bgImg} alt="Books" />
      </div>

      <div className="login-form-section">
        <div className="login-form-wrapper">
          <img src={logo} alt="Readify Market Logo" className="login-logo" />
          <h1 className="login-brand">Readify Market</h1>
          <h2 className="login-heading">Login</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error-input' : ''}
                disabled={loading}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'error-input' : ''}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="forgot-password-link">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="signup-link">
              Don't have an account? <Link to="/signup">Signup</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;