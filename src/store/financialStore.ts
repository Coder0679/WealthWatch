import { create } from 'zustand';
import { transactionService, Transaction } from '../services/transactionService';
import { assetService, Asset } from '../services/assetService';
import { liabilityService, Liability } from '../services/liabilityService';
import { goalService } from '../services/goalService';

export interface Goal {
  id: string;
  goalId: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: "emergency" | "travel" | "home" | "vehicle" | "education" | "other";
  status: 'active' | 'completed';
}

interface FinancialState {
  transactions: Transaction[];
  assets: Asset[];
  liabilities: Liability[];
  goals: Goal[];
  isLoading: boolean;
  fetchTransactions: (filters?: any) => Promise<void>;
  addTransaction: (data: any) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  fetchAssets: () => Promise<void>;
  addAsset: (data: any) => Promise<void>;
  deleteAsset: (id: string) => Promise<void>;
  fetchLiabilities: () => Promise<void>;
  addLiability: (data: any) => Promise<void>;
  deleteLiability: (id: string) => Promise<void>;
  fetchGoals: () => Promise<void>;
  addGoal: (data: any) => Promise<void>;
  updateGoal: (id: string, amount: number) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
}

export const useFinancialStore = create<FinancialState>((set, get) => ({
  transactions: [],
  assets: [],
  liabilities: [],
  goals: [],
  isLoading: false,

  fetchTransactions: async (filters) => {
    set({ isLoading: true });
    try {
      const data = await transactionService.getTransactions(filters);
      set({ transactions: data, isLoading: false });
    } catch { set({ isLoading: false }); }
  },
  addTransaction: async (data) => {
    await transactionService.addTransaction(data);
    await get().fetchTransactions();
  },
  deleteTransaction: async (id) => {
    await transactionService.deleteTransaction(id);
    await get().fetchTransactions();
  },

  fetchAssets: async () => {
    set({ isLoading: true });
    try {
      const data = await assetService.getAssets();
      set({ assets: data, isLoading: false });
    } catch { set({ isLoading: false }); }
  },
  addAsset: async (data) => {
    await assetService.addAsset(data);
    await get().fetchAssets();
  },
  deleteAsset: async (id) => {
    await assetService.deleteAsset(id);
    await get().fetchAssets();
  },

  fetchLiabilities: async () => {
    set({ isLoading: true });
    try {
      const data = await liabilityService.getLiabilities();
      set({ liabilities: data, isLoading: false });
    } catch { set({ isLoading: false }); }
  },
  addLiability: async (data) => {
    await liabilityService.addLiability(data);
    await get().fetchLiabilities();
  },
  deleteLiability: async (id) => {
    await liabilityService.deleteLiability(id);
    await get().fetchLiabilities();
  },
  fetchGoals: async () => {
    set({ isLoading: true });
    try {
      const data = await goalService.getGoals();
      set({ goals: data, isLoading: false });
    } catch { set({ isLoading: false }); }
  },
  addGoal: async (data) => {
    await goalService.addGoal(data);
    await get().fetchGoals();
  },
  updateGoal: async (id, amount) => {
    await goalService.updateGoal(id, amount);
    await get().fetchGoals();
  },
  deleteGoal: async (id) => {
    await goalService.deleteGoal(id);
    await get().fetchGoals();
  },
}));
