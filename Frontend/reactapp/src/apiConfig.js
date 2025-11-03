import axios from 'axios';

// const API_BASE_URL = 'https://8080-fcfcafbbdbbffc333241492cbbfcbccfceone.premiumproject.examly.io/api';
const API_BASE_URL = 'http://localhost:8080/api';
const BASE_URL = 'http://localhost:8080';

// Helper function to get full image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  return `${BASE_URL}${imagePath}`;
};

// Handle test environment where axios.create might not be available
const api = typeof axios.create === 'function' 
  ? axios.create({
      baseURL: API_BASE_URL,
      // headers: {
      //   'Content-Type': 'application/json',
      // },
      withCredentials: true,
    })
  : axios;

// Only set up interceptors if they exist
if (api.interceptors) {
  // Request interceptor to add token if available
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor for error handling
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      // Only redirect to login for actual authentication failures
      if (error.response?.status === 401) {
        const errorMessage = error.response?.data?.message || '';
        const requestUrl = error.config?.url || '';
        
        console.log('401 Error Details:', {
          url: requestUrl,
          message: errorMessage
        });
        
        // Don't logout if it's just an authorization issue (wrong role)
        // Only logout for actual token problems
        if (
          errorMessage.toLowerCase().includes('token') ||
          errorMessage.toLowerCase().includes('expired') ||
          errorMessage.toLowerCase().includes('invalid') ||
          errorMessage.toLowerCase().includes('authenticated')
        ) {
          console.log('Token issue - logging out');
          clearUserData();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
      }
      return Promise.reject(error);
    }
  );
}

// Helper function to clear all user data
const clearUserData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
  localStorage.removeItem('userRole');
};

// ==================== USER APIs ====================
export const userAPI = {
  signup: (userData) => api.post('/users/signup', userData),
  
  login: async (credentials) => {
    const response = await api.post('/users/login', credentials);
    
    if (response.data) {
      const { token, userId, userName, role } = response.data;
      
      if (token) {
        localStorage.setItem('token', token);
      }
      
      localStorage.setItem('userId', userId);
      localStorage.setItem('userName', userName);
      localStorage.setItem('userRole', role);
      
      console.log('User data stored in localStorage:', {
        userId,
        userName,
        role
      });
    }
    
    return response;
  },
  
  logout: async () => {
    try {
      await api.post('/users/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      clearUserData();
      console.log('User logged out, localStorage cleared');
    }
  },
  
  validateToken: () => api.get('/users/validate-token'),
  verifyEmail: (email) => api.post('/users/verify-email', { email }),
  resetPassword: (email, newPassword) => api.post('/users/reset-password', { email, newPassword }),
  
  // Fetch all users (admin only)
  getAllUsers: () => api.get('/users/getAllUsers'),
  
  getCurrentUser: () => {
    return {
      userId: localStorage.getItem('userId'),
      userName: localStorage.getItem('userName'),
      userRole: localStorage.getItem('userRole'),
      token: localStorage.getItem('token')
    };
  }
};

// ==================== BOOK APIs ====================
export const bookAPI = {
  getAllBooks: () => api.get('/book/getAllBooks'),
  getBookById: (id) => api.get(`/book/getBookById/${id}`),
  
  addBook: (bookData) => {
    return api.post('/book/addBook', bookData);
  },
  
  updateBook: (id, bookData) => {
    return api.put(`/book/updateBook/${id}`, bookData);
  },
  
  deleteBook: (id) => api.delete(`/book/deleteBook/${id}`),
};

// ==================== ORDER APIs ====================
export const orderAPI = {
  addOrder: (orderData) => api.post('/order/addOrder', orderData),
  getAllOrders: () => api.get('/order/getAllOrders'),
  getOrderById: (id) => api.get(`/order/getOrderById/${id}`),
  getOrdersByUserId: (userId) => api.get(`/order/getOrdersByUserId/${userId}`),
  updateOrder: (id, orderData) => api.put(`/order/updateOrder/${id}`, orderData),
  deleteOrder: (id) => api.delete(`/order/deleteOrder/${id}`),
};

// ==================== REVIEW APIs ====================
export const reviewAPI = {
  addReview: (reviewData) => api.post('/review/addReview', reviewData),
  deleteReview: (id) => api.delete(`/review/deleteReview/${id}`),
  getReviewsByBookId: (bookId) => api.get(`/review/getReviewsByBookId/${bookId}`),
  getReviewsByUserId: (userId) => api.get(`/review/getReviewsByUserId/${userId}`),
  getAllReviews: () => api.get(`/review/getAllReviews`),
};

export default api;