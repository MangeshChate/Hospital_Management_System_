import api from "@/utils/api";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//async thunks for verifyauth
export const verifyAuth = createAsyncThunk('user/verify', async () => {
  try {
    const response = await api.get(
      "users/current-user",
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': ''
        }
      }
    );

    return response.data;
  } catch (error) {
    throw new Error("Session expired");
  }
});

//async thunk for login
export const login = createAsyncThunk('user/login', async (credentials) => {
  try {
    const response = await axios.post(
      "http://localhost:8080/api/v1/users/login",
      credentials,
      {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    console.log(response.data)
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error("Invalid Credentials");
    } else {
      throw new Error("Login failed");
    }
  }
});

//async thunk for logout
export const logout = createAsyncThunk('user/logout', async () => {
  try {
    await api.post("users/logout", {}, { withCredentials: true });
  } catch (error) {
    console.error("Logout failed:", error);
  }
});


// async thunk for importing all users with a roles
export const getUsers = createAsyncThunk('user/get-all-users-with-role', async () => {
  try {
    const res = await api.get("users/get-all-users-with-role",
      {
        withCredentials: true
      }
    );

    return res.data;

  } catch (error) {
    throw new Error("Error in fetching data.")
  }

})
