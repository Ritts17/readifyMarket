import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartProvider } from './CartContext';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <ToastProvider autoComplete={true} placement='top-right'>
          <BrowserRouter>
            <React.StrictMode>
              <App />
            </React.StrictMode>
          </BrowserRouter>  
        </ToastProvider>
      </CartProvider>
    </QueryClientProvider>
  </Provider>
);

reportWebVitals();
