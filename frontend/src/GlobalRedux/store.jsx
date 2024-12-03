import { configureStore } from "@reduxjs/toolkit";
import userReducer from './Features/user/userSlice';
import getUsersReducer from './Features/user/getUsersSlice';




export const store = configureStore({
    reducer: {
      
        user: userReducer,
        getUsers:getUsersReducer
    }
});
