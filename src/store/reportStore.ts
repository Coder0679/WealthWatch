import { create } from 'zustand';
import axios from 'axios';

interface Report {
  reportId: string;
  monthName: string;
  monthKey: string;
  generatedAt: string;
  downloadUrl: string;
}

interface ReportStore {
  reports: Report[];
  isLoading: boolean;
  isGenerating: boolean;
  fetchReports: () => Promise<void>;
  generateReport: () => Promise<void>;
}

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const useReportStore = create<ReportStore>((set) => ({
  reports: [],
  isLoading: false,
  isGenerating: false,
  fetchReports: async () => {
    set({ isLoading: true });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/reports`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ reports: response.data, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      set({ isLoading: false });
    }
  },
  generateReport: async () => {
    set({ isGenerating: true });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/reports/generate`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set((state) => ({ 
        reports: [response.data.report, ...state.reports],
        isGenerating: false 
      }));
    } catch (error) {
      console.error('Failed to generate report:', error);
      set({ isGenerating: false });
    }
  },
}));
