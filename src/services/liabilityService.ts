import axios from 'axios';
import { authService } from './authService';

const API_URL = '/api/liabilities';
const getAuthHeader = () => ({ headers: { Authorization: `Bearer ${authService.getToken()}` } });

export interface Liability {
  id: string;
  name: string;
  type: string;
  totalAmount: number;
  remainingAmount: number;
  interestRate: number;
  emiAmount: number;
  dueDate: string;
}

export const liabilityService = {
  getLiabilities: async (): Promise<Liability[]> => {
    const response = await axios.get(API_URL, getAuthHeader());
    return response.data;
  },
  addLiability: async (data: any): Promise<Liability> => {
    const response = await axios.post(API_URL, data, getAuthHeader());
    return response.data;
  },
  deleteLiability: async (id: string) => {
    await axios.delete(`${API_URL}/${id}`, getAuthHeader());
  }
};
