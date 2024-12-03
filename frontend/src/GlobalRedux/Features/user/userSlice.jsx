import { login, logout, verifyAuth } from "@/GlobalRedux/Thunks/userThunks";

import {  createSlice } from "@reduxjs/toolkit";

  // Create user slice
const userSlice = createSlice({
    name: 'user',
    initialState: {
      userInfo: null,
      isLoggedIn: false,
      status: 'idle',
      error: null
    },
    reducers: {
      clearUserState: (state) => {
        state.userInfo = null;
        state.isLoggedIn = false;
        state.status = 'idle';
        state.error = null;
      }
    },
    extraReducers: (builder) => {
      builder
        // login cases
        .addCase(login.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(login.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.userInfo = action.payload;
          state.isLoggedIn = true;
        })
        .addCase(login.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
          state.isLoggedIn = false;

        })
  
        // verifyAuth cases
        .addCase(verifyAuth.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(verifyAuth.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.userInfo = action.payload;
          state.isLoggedIn = true;
        })
        .addCase(verifyAuth.rejected, (state) => {
          state.status = 'idle';
          state.userInfo = null;
          state.isLoggedIn = false;
          state.error = "Session expired";
        })
  
        // logout cases
        .addCase(logout.fulfilled, (state) => {
          state.userInfo = null;
          state.isLoggedIn = false;
          state.status = 'idle';
          state.error = null;
        });
    }
  });
  
  export const { clearUserState } = userSlice.actions; 
  export default userSlice.reducer;
  