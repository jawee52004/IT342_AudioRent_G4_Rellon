// src/api.ts
import axios from "axios";

// Replace with your backend URL
const API_URL = "http://localhost:8080/api"; 

export interface User {
  username: string;
  password: string;
  email?: string; // optional for login
}

// Register user
export const registerUser = async (user: User) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, user);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Registration failed" };
  }
};

// Login user
export const loginUser = async (user: User) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, user);
    return response.data; // expect token or user info
  } catch (error: any) {
    throw error.response?.data || { message: "Login failed" };
  }
};