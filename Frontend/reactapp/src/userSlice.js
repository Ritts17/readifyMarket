// User Slice
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userId: localStorage.getItem('userId') || null,
    userName: localStorage.getItem('userName') || null,
    userRole: localStorage.getItem('userRole') || null,
    isAuthenticated: !!localStorage.getItem('userId'),
  },
  reducers: {
    setUserInfo: (state, action) => {
      state.userId = action.payload.userId;
      state.userName = action.payload.userName;
      state.userRole = action.payload.userRole;
      state.isAuthenticated = true;
      
      localStorage.setItem('userId', action.payload.userId);
      localStorage.setItem('userName', action.payload.userName);
      localStorage.setItem('userRole', action.payload.userRole);
    },
    clearUserInfo: (state) => {
      state.userId = null;
      state.userName = null;
      state.userRole = null;
      state.isAuthenticated = false;
      
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('userRole');
      localStorage.removeItem('cart');
    },
  },
});

export const { setUserInfo, clearUserInfo } = userSlice.actions;
export default userSlice.reducer