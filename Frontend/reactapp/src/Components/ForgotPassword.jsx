import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications';
import { userAPI } from '../apiConfig';
import './ForgotPassword.css';
import bgImg from '../assets/images/Cover.jpg';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { addToast } = useToasts();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;

  const validateEmail = () => {
    if (!email) {
      setErrors({ email: 'Email is required' });
      return false;
    }
    if (!emailRegex.test(email)) {
      setErrors({ email: 'Please enter a valid email' });
      return false;
    }
    return true;
  };

  const validatePasswords = () => {
    const newErrors = {};
    
    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (!validateEmail()) {
      return;
    }

    setLoading(true);

    try {
      const response = await userAPI.verifyEmail(email);
      
      if (response.data) {
        const { message } = response.data;
        
        // Check if email verification was successful
        if (message === "Email verified" || message === "User found") {
          setIsVerified(true);
          addToast('Email verified successfully!', { appearance: 'success' });
        } else if (message === "User not found" || message === "Email not found") {
          addToast('Email not found in our records', { appearance: 'error' });
        } else {
          // Handle any other message
          addToast(message || 'Email verification failed', { appearance: 'error' });
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Email verification failed. Please try again.';
      addToast(errorMessage, { appearance: 'error' });
      console.error('Verify email error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!validatePasswords()) {
      return;
    }

    setLoading(true);

    try {
      const response = await userAPI.resetPassword(email, newPassword);
      
      if (response.data) {
        const { message } = response.data;
        
        if (message === "Password reset successful" || message === "Success") {
          addToast('Password reset successfully!', { appearance: 'success' });
          setTimeout(() => navigate('/login'), 1500);
        } else {
          addToast(message || 'Password reset failed', { appearance: 'error' });
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Password reset failed. Please try again.';
      addToast(errorMessage, { appearance: 'error' });
      console.error('Reset password error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-password-left">
          <img src={bgImg} alt="Logo" className="fp-logo" />
          <h1 className="fp-heading">Forgot Password</h1>
          <p className="fp-subtitle">Enter your email to reset your password.</p>

          <form onSubmit={isVerified ? handleResetPassword : handleVerify}>
            <div className="fp-form-group">
              <label>Email *</label>
              <div className="email-input-wrapper">
                <input
                  type="text"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors({});
                  }}
                  disabled={isVerified || loading}
                  className={errors.email ? 'error-input' : ''}
                />
                {!isVerified && (
                  <button 
                    type="submit" 
                    className="verify-button"
                    disabled={loading}
                  >
                    {loading ? 'Verifying...' : 'Verify'}
                  </button>
                )}
              </div>
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            {isVerified && (
              <>
                <div className="fp-form-group">
                  <label>New Password *</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setErrors({ ...errors, newPassword: '' });
                    }}
                    disabled={loading}
                    className={errors.newPassword ? 'error-input' : ''}
                  />
                  {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
                </div>

                <div className="fp-form-group">
                  <label>Confirm New Password *</label>
                  <input
                    type="password"
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setErrors({ ...errors, confirmPassword: '' });
                    }}
                    disabled={loading}
                    className={errors.confirmPassword ? 'error-input' : ''}
                  />
                  {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                </div>

                <button 
                  type="submit" 
                  className="reset-button"
                  disabled={loading}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </>
            )}
          </form>

          <div className="fp-login-link">
            Remembered your password? <Link to="/login">Login</Link>
          </div>
        </div>

        <div className="forgot-password-right">
          <img src={bgImg} alt="Forgot Password" />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;