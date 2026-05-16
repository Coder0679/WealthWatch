import axios from 'axios';

const api = axios.create({
  baseURL: '/api/chat',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const chatService = {
  sendMessage: async (message: string) => {
    const response = await api.post('/message', { message });
    return response.data;
  },
};
