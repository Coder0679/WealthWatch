import axios from 'axios';
import { authService } from './authService';

const API_URL = '/api/ai';
const getAuthHeader = () => ({ headers: { Authorization: `Bearer ${authService.getToken()}` } });

export interface Insight {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'saving' | 'investing' | 'debt' | 'budgeting' | 'emergency';
}

export const aiService = {
  getInsights: async (): Promise<Insight[]> => {
    const response = await axios.post(`${API_URL}/insights`, {}, getAuthHeader());
    return response.data;
  },
  getMonthlySummary: async (): Promise<{ summary: string }> => {
    const response = await axios.get(`${API_URL}/monthly-summary`, getAuthHeader());
    return response.data;
  },
  getMonthlyNarrativeTts: async (): Promise<{ summary: string; audioBase64: string; audioMime: string }> => {
    const response = await axios.post(`${API_URL}/monthly-narrative-tts`, {}, getAuthHeader());
    return response.data;
  }
};
