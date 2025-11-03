import { Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from 'react-toast-notifications';
import { CartProvider } from './CartContext';
import store from './store';
import PrivateRoute from './Components/PrivateRoute';

// Components
import Login from './Components/Login';
import Signup from './Components/Signup';
import ForgotPassword from './Components/ForgotPassword';
import HomePage from './Components/HomePage';
import ErrorPage from './Components/ErrorPage';

// Admin Components
import Dashboard from './AdminComponents/Dashboard';
import BookForm from './AdminComponents/BookForm';
import AdminViewBooks from './AdminComponents/AdminViewBooks';
import OrderPlaced from './AdminComponents/OrderPlaced';
import AdminViewReviews from './AdminComponents/AdminViewReviews';

// User Components
import UserViewBooks from './UserComponents/UserViewBooks';
import Checkout from './UserComponents/Checkout';
import UserViewOrders from './UserComponents/UserViewOrders';
import UserReview from './UserComponents/UserReview';
import UserMyReview from './UserComponents/UserMyReview';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ToastProvider placement="top-right" autoDismiss autoDismissTimeout={3000}>
          <CartProvider>
            <Routes>
              {/* Public Routes - Accessible to everyone */}
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Protected Home Route - Accessible to both user and admin */}
              <Route 
                path="/home" 
                element={
                  <PrivateRoute allowedRoles={['user', 'admin']}>
                    <HomePage />
                  </PrivateRoute>
                } 
              />

              {/* Admin Routes - Only accessible to admin role */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <PrivateRoute allowedRoles={['admin']}>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin/books/add" 
                element={
                  <PrivateRoute allowedRoles={['admin']}>
                    <BookForm />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin/books/edit/:id" 
                element={
                  <PrivateRoute allowedRoles={['admin']}>
                    <BookForm />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin/view-books" 
                element={
                  <PrivateRoute allowedRoles={['admin']}>
                    <AdminViewBooks />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin/orders" 
                element={
                  <PrivateRoute allowedRoles={['admin']}>
                    <OrderPlaced />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin/reviews" 
                element={
                  <PrivateRoute allowedRoles={['admin']}>
                    <AdminViewReviews />
                  </PrivateRoute>
                } 
              />

              {/* User Routes - Only accessible to user role */}
              <Route 
                path="/books" 
                element={
                  <PrivateRoute allowedRoles={['user']}>
                    <UserViewBooks />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/checkout" 
                element={
                  <PrivateRoute allowedRoles={['user']}>
                    <Checkout />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/my-orders" 
                element={
                  <PrivateRoute allowedRoles={['user']}>
                    <UserViewOrders />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/write-review" 
                element={
                  <PrivateRoute allowedRoles={['user']}>
                    <UserReview />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/my-reviews" 
                element={
                  <PrivateRoute allowedRoles={['user']}>
                    <UserMyReview />
                  </PrivateRoute>
                } 
              />

              {/* Error Routes */}
              <Route path="/error" element={<ErrorPage />} />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </CartProvider>
        </ToastProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;