import React, { useState } from 'react';
import Modal from './Modal';
import { useFinancialStore } from '../store/financialStore';

import { useDashboardStore } from '../store/dashboardStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddLiabilityModal({ isOpen, onClose }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'loan',
    totalAmount: '',
    remainingAmount: '',
    interestRate: '',
    emiAmount: '',
    dueDate: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const { addLiability } = useFinancialStore();
  const { fetchSummary, fetchCharts } = useDashboardStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addLiability({
        ...formData,
        totalAmount: Number(formData.totalAmount),
        remainingAmount: Number(formData.remainingAmount),
        interestRate: Number(formData.interestRate),
        emiAmount: Number(formData.emiAmount)
      });
      fetchSummary();
      fetchCharts();
      onClose();
    } catch (error: any) {
      console.error('Failed to save liability:', error);
      alert(`Failed to save liability: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Liability">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-[#94A3B8] uppercase ml-1">Liability Name</label>
          <input
            required
            className="w-full mt-1.5 bg-[#0A0F1E] border border-[#1F2937] rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
            placeholder="e.g. Home Loan"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-[#94A3B8] uppercase ml-1">Type</label>
            <select
              className="w-full mt-1.5 bg-[#0A0F1E] border border-[#1F2937] rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="loan">Loan</option>
              <option value="credit_card">Credit Card</option>
              <option value="emi">EMI</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-[#94A3B8] uppercase ml-1">EMI Amount (₹)</label>
            <input
              type="number"
              className="w-full mt-1.5 bg-[#0A0F1E] border border-[#1F2937] rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
              value={formData.emiAmount}
              onChange={(e) => setFormData({ ...formData, emiAmount: e.target.value })}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-[#94A3B8] uppercase ml-1">Total Loan Amount</label>
            <input
              type="number"
              required
              className="w-full mt-1.5 bg-[#0A0F1E] border border-[#1F2937] rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
              value={formData.totalAmount}
              onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-[#94A3B8] uppercase ml-1">Remaining Amount</label>
            <input
              type="number"
              required
              className="w-full mt-1.5 bg-[#0A0F1E] border border-[#1F2937] rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
              value={formData.remainingAmount}
              onChange={(e) => setFormData({ ...formData, remainingAmount: e.target.value })}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl shadow-lg shadow-rose-500/20 transition-all mt-4"
        >
          {loading ? 'Saving...' : 'Save Liability'}
        </button>
      </form>
    </Modal>
  );
}
