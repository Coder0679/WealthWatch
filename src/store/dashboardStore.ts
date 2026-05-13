import { create } from 'zustand';
import { dashboardService, SummaryData, ChartsData } from '../services/dashboardService';

interface DashboardState {
  summary: SummaryData | null;
  charts: ChartsData | null;
  isLoading: boolean;
  fetchSummary: () => Promise<void>;
  fetchCharts: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  summary: null,
  charts: null,
  isLoading: false,
  fetchSummary: async () => {
    set({ isLoading: true });
    try {
      const data = await dashboardService.getSummary();
      set({ summary: data, isLoading: false });
    } catch { set({ isLoading: false }); }
  },
  fetchCharts: async () => {
    set({ isLoading: true });
    try {
      const data = await dashboardService.getCharts();
      set({ charts: data, isLoading: false });
    } catch { set({ isLoading: false }); }
  },
}));
