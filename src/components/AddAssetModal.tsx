import React, { useState } from 'react';
import Modal from './Modal';
import { useFinancialStore } from '../store/financialStore';

import { useDashboardStore } from '../store/dashboardStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddAssetModal({ isOpen, onClose }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'bank',
    currentValue: '',
    purchaseValue: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const { addAsset } = useFinancialStore();
  const { fetchSummary, fetchCharts } = useDashboardStore();

  const types = [
    { value: 'bank', label: 'Bank Account' },
    { value: 'stock', label: 'Stocks/Mutual Funds' },
    { value: 'crypto', label: 'Cryptocurrency' },
    { value: 'real_estate', label: 'Real Estate' },
    { value: 'fd', label: 'Fixed Deposits' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addAsset({
        ...formData,
        currentValue: Number(formData.currentValue),
        purchaseValue: Number(formData.purchaseValue)
      });
      fetchSummary();
      fetchCharts();
      onClose();
    } catch (error: any) {
      console.error('Failed to save asset:', error);
      alert(`Failed to save asset: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Asset">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-bold text-[#94A3B8] uppercase ml-1">Asset Name</label>
          <input
            required
            className="w-full mt-1.5 bg-[#0A0F1E] border border-[#1F2937] rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
            placeholder="e.g. HDFC Salary Account"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs font-bold text-[#94A3B8] uppercase ml-1">Asset Type</label>
          <select
            className="w-full mt-1.5 bg-[#0A0F1E] border border-[#1F2937] rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            {types.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-[#94A3B8] uppercase ml-1">Current Value (₹)</label>
            <input
              type="number"
              required
              className="w-full mt-1.5 bg-[#0A0F1E] border border-[#1F2937] rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
              value={formData.currentValue}
              onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-[#94A3B8] uppercase ml-1">Purchase Value (₹)</label>
            <input
              type="number"
              required
              className="w-full mt-1.5 bg-[#0A0F1E] border border-[#1F2937] rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
              value={formData.purchaseValue}
              onChange={(e) => setFormData({ ...formData, purchaseValue: e.target.value })}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/20 transition-all mt-4"
        >
          {loading ? 'Creating...' : 'Create Asset'}
        </button>
      </form>
    </Modal>
  );
}
