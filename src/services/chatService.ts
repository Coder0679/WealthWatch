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
  createSession: async () => {
    const response = await api.get('/session');
    return response.data;
  },
  sendMessage: async (message: string, sessionId: string) => {
    const response = await api.post('/message', { message, sessionId });
    return response.data;
  },
};
