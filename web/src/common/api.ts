import ApiService from "./ApiService";

const api = ApiService.getInstance().getAxiosInstance();

export interface User {
  username: string;
  password: string;
  email?: string;
  fullName?: string;
  role?: string;
}

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
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Login failed" };
  }
};

export default api;