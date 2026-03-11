import axios from "axios";

// Base URL for all requests
const API_BASE_URL = "http://localhost:8080"; 

// 1. Create a "Smart" instance of axios
const api = axios.create({
  baseURL: API_BASE_URL,
});

// 2. Add the "Interceptor" to attach the token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface User {
  username: string;
  password: string;
  email?: string;
  fullName?: string; // Matching your backend field
  role?: string;
}

// 3. Updated functions using the 'api' instance
export const registerUser = async (user: User) => {
  try {
    const response = await api.post(`/auth/register`, user);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Registration failed" };
  }
};

export const loginUser = async (credentials: any) => {
  try {
    const response = await api.post(`/auth/login`, credentials);
    return response.data; // This now carries the token
  } catch (error: any) {
    throw error.response?.data || { message: "Login failed" };
  }
};

export default api;