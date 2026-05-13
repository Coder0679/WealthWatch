import axios from 'axios';

const api = axios.create({
  baseURL: '/api/goals',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const goalService = {
  getGoals: async () => {
    const response = await api.get('/');
    return response.data;
  },
  addGoal: async (goal: any) => {
    const response = await api.post('/', goal);
    return response.data;
  },
  updateGoal: async (id: string, currentAmount: number) => {
    const response = await api.put(`/${id}`, { currentAmount });
    return response.data;
  },
  deleteGoal: async (id: string) => {
    const response = await api.delete(`/${id}`);
    return response.data;
  },
};
