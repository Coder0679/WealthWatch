export const mockTransactions = [
  { id: '1', amount: 50000, type: 'income', category: 'Salary', date: '2026-05-01', note: 'Monthly Salary', userId: 'user_123' },
  { id: '2', amount: 2500, type: 'expense', category: 'Food', date: '2026-05-02', note: 'Zomato', userId: 'user_123' },
  { id: '3', amount: 15000, type: 'expense', category: 'EMI', date: '2026-05-03', note: 'Car Loan', userId: 'user_123' },
];

export const mockAssets = [
  { id: 'a1', name: 'HDFC Bank', type: 'bank', currentValue: 250000, purchaseValue: 250000, purchaseDate: '2024-01-01', userId: 'user_123' },
  { id: 'a2', name: 'Reliance Stocks', type: 'stock', currentValue: 150000, purchaseValue: 120000, purchaseDate: '2024-06-01', userId: 'user_123' },
];

export const mockLiabilities = [
  { id: 'l1', name: 'Education Loan', type: 'loan', totalAmount: 500000, remainingAmount: 420000, interestRate: 8.5, emiAmount: 12000, dueDate: '2026-05-15', userId: 'user_123' },
  { id: 'l2', name: 'ICICI Credit Card', type: 'credit_card', totalAmount: 50000, remainingAmount: 15000, interestRate: 36, emiAmount: 0, dueDate: '2026-05-20', userId: 'user_123' },
];

export interface SimulationStore {
  transactions: any[];
  assets: any[];
  liabilities: any[];
  goals: any[];
  reports: any[];
}

export let store: SimulationStore = {
  transactions: [...mockTransactions],
  assets: [...mockAssets],
  liabilities: [...mockLiabilities],
  goals: [] as any[],
  reports: [] as any[],
};

export const resetStore = () => {
  store.transactions = [...mockTransactions];
  store.assets = [...mockAssets];
  store.liabilities = [...mockLiabilities];
  store.goals = [];
  store.reports = [];
};
