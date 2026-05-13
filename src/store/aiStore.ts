import { create } from 'zustand';
import { aiService, Insight } from '../services/aiService';
import { useDashboardStore } from './dashboardStore';
import { useFinancialStore } from './financialStore';

interface AIState {
  insights: Insight[] | null;
  healthScore: number;
  monthlySummary: string;
  isLoading: boolean;
  lastUpdated: string | null;
  fetchInsights: () => Promise<void>;
  fetchSummary: () => Promise<void>;
  calculateHealthScore: () => void;
}

export const useAIStore = create<AIState>((set, get) => ({
  insights: null,
  healthScore: 0,
  monthlySummary: '',
  isLoading: false,
  lastUpdated: null,

  fetchInsights: async () => {
    set({ isLoading: true });
    try {
      const data = await aiService.getInsights();
      set({ 
        insights: data, 
        isLoading: false, 
        lastUpdated: new Date().toISOString() 
      });
      get().calculateHealthScore();
    } catch {
      set({ isLoading: false });
    }
  },

  fetchSummary: async () => {
    try {
      const data = await aiService.getMonthlySummary();
      set({ monthlySummary: data.summary });
    } catch {}
  },

  calculateHealthScore: () => {
    const dashboardStore = useDashboardStore.getState();
    const financialStore = useFinancialStore.getState();
    
    let score = 0;
    
    // Savings rate > 20%
    const income = dashboardStore.summary?.monthlyIncome || 0;
    const expenses = dashboardStore.summary?.monthlyExpenses || 0;
    if (income > 0 && ((income - expenses) / income) > 0.2) score += 20;

    // Emergency fund exists (Bank > 3x expenses)
    const bankAssets = financialStore.assets.filter(a => a.type === 'bank').reduce((sum, a) => sum + a.currentValue, 0);
    if (bankAssets > (expenses * 3)) score += 20;

    // No high interest debt (Credit card balance < 5000)
    const ccDebt = financialStore.liabilities.filter(l => l.type === 'credit_card').reduce((sum, l) => sum + l.remainingAmount, 0);
    if (ccDebt < 5000) score += 20;

    // Diversified assets (At least 3 types)
    const assetTypes = new Set(financialStore.assets.map(a => a.type)).size;
    if (assetTypes >= 3) score += 20;

    // Expenses < 70% income
    if (income > 0 && (expenses / income) < 0.7) score += 20;

    set({ healthScore: score });
  }
}));
