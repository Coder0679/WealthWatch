import React, { useState } from 'react';
import Modal from './Modal';
import { useFinancialStore } from '../store/financialStore';
import { useDashboardStore } from '../store/dashboardStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddTransactionModal({ isOpen, onClose }: Props) {
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    note: '',
    isRecurring: false,
    recurringFrequency: 'monthly'
  });
  const [loading, setLoading] = useState(false);
  const { addTransaction } = useFinancialStore();
  const { fetchSummary, fetchCharts } = useDashboardStore();

  const categories = {
    income: ['Salary', 'Freelance', 'Business', 'Investment', 'Other'],
    expense: ['Food', 'Travel', 'Shopping', 'Bills', 'EMI', 'Medical', 'Entertainment', 'Other']
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addTransaction({
        ...formData,
        amount: Number(formData.amount)
      });
      fetchSummary();
      fetchCharts();
      onClose();
    } catch (error: any) {
      console.error('Failed to save transaction:', error);
      alert(`Failed to save transaction: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Transaction">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-2 sm:gap-4 bg-[#0A0F1E] p-1 rounded-2xl border border-[#1F2937]">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, type: 'income', category: 'Salary' })}
            className={`py-2 rounded-xl text-sm font-bold transition-all ${formData.type === 'income' ? 'bg-emerald-600 text-white shadow-lg' : 'text-[#94A3B8]'}`}
          >
            Income
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, type: 'expense', category: 'Food' })}
            className={`py-2 rounded-xl text-sm font-bold transition-all ${formData.type === 'expense' ? 'bg-rose-600 text-white shadow-lg' : 'text-[#94A3B8]'}`}
          >
            Expense
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#94A3B8] uppercase ml-1">Amount (₹)</label>
            <input
              type="number"
              required
              placeholder="0.00"
              className="w-full mt-1.5 bg-[#0A0F1E] border border-[#1F2937] rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-colors"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#94A3B8] uppercase ml-1">Category</label>
              <select
                className="w-full mt-1.5 bg-[#0A0F1E] border border-[#1F2937] rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-colors"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories[formData.type as 'income' | 'expense'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-[#94A3B8] uppercase ml-1">Date</label>
              <input
                type="date"
                className="w-full mt-1.5 bg-[#0A0F1E] border border-[#1F2937] rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-colors"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#94A3B8] uppercase ml-1">Note (Optional)</label>
            <input
              className="w-full mt-1.5 bg-[#0A0F1E] border border-[#1F2937] rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-colors"
              placeholder="What was this for?"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Save Transaction'}
        </button>
      </form>
    </Modal>
  );
}
