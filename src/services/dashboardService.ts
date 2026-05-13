import axios from 'axios';
import { authService } from './authService';

const API_URL = '/api';

export interface SummaryData {
  netWorth: number;
  totalAssets: number;
  totalLiabilities: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySavings: number;
  netWorthChange: number;
  netWorthChangePercent: number;
  activeGoals: number;
}

export interface ChartsData {
  netWorthHistory: { month: string; value: number }[];
  spendingByCategory: { category: string; amount: number }[];
  incomeVsExpense: { month: string; income: number; expense: number }[];
  assetAllocation: { type: string; value: number; percentage: number }[];
}

const getAuthHeader = () => ({
  headers: { Authorization: `Bearer ${authService.getToken()}` }
});

export const dashboardService = {
  getSummary: async (): Promise<SummaryData> => {
    const response = await axios.get(`${API_URL}/dashboard/summary`, getAuthHeader());
    return response.data;
  },
  getCharts: async (): Promise<ChartsData> => {
    const response = await axios.get(`${API_URL}/dashboard/charts`, getAuthHeader());
    return response.data;
  },
};
