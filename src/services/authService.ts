import axios from 'axios';

const API_URL = '/api';

export interface User {
  userId: string;
  email: string;
  name: string;
  currency: string;
  monthlyIncome: number;
  riskProfile: string;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export const authService = {
  signup: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/auth/signup`, { name, email, password });
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken: () => {
    const token = localStorage.getItem('token');
    return (token && token !== 'undefined' && token !== 'null') ? token : null;
  },
  getUser: (): User | null => {
    const userJson = localStorage.getItem('user');
    try {
      return (userJson && userJson !== 'undefined' && userJson !== 'null') ? JSON.parse(userJson) : null;
    } catch (e) {
      return null;
    }
  },
  isAuthenticated: () => {
    const token = authService.getToken();
    return !!token;
  },
};
