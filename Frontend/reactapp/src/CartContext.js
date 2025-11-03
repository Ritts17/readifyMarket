import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItemIndex = state.findIndex(
        item => item._id === action.payload._id
      );
      
      if (existingItemIndex >= 0) {
        const updatedCart = [...state];
        updatedCart[existingItemIndex].quantity += action.payload.quantity;
        return updatedCart;
      }
      
      return [...state, action.payload];
    }
    
    case 'REMOVE_FROM_CART':
      return state.filter(item => item._id !== action.payload);
    
    case 'UPDATE_QUANTITY':
      return state.map(item =>
        item._id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
    
    case 'CLEAR_CART':
      return [];
    
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, [], () => {
    const localData = localStorage.getItem('cart');
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (book, quantity = 1) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: { ...book, quantity }
    });
  };

  const removeFromCart = (bookId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: bookId });
  };

  const updateQuantity = (bookId, quantity) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { id: bookId, quantity }
    });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};