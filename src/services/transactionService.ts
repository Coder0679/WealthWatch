import axios from 'axios';
import { authService } from './authService';

const API_URL = '/api/transactions';
const getAuthHeader = () => ({ headers: { Authorization: `Bearer ${authService.getToken()}` } });

export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  note: string;
  isRecurring?: boolean;
  recurringFrequency?: string;
}

export const transactionService = {
  getTransactions: async (filters: any = {}): Promise<Transaction[]> => {
    const response = await axios.get(API_URL, { ...getAuthHeader(), params: filters });
    return response.data;
  },
  addTransaction: async (data: any): Promise<Transaction> => {
    const response = await axios.post(API_URL, data, getAuthHeader());
    return response.data;
  },
  updateTransaction: async (id: string, data: any) => {
    await axios.put(`${API_URL}/${id}`, data, getAuthHeader());
  },
  deleteTransaction: async (id: string) => {
    await axios.delete(`${API_URL}/${id}`, getAuthHeader());
  }
};
