import React, { useState } from 'react';
import Modal from './Modal';
import { useFinancialStore } from '../store/financialStore';
import { useDashboardStore } from '../store/dashboardStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const AddGoalModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    category: 'other' as const,
  });
  const [loading, setLoading] = useState(false);
  const { addGoal } = useFinancialStore();
  const { fetchSummary } = useDashboardStore();

  const categories = [
    { value: 'home', label: '🏠 Home', color: 'border-blue-500' },
    { value: 'travel', label: '✈️ Travel', color: 'border-green-500' },
    { value: 'education', label: '🎓 Education', color: 'border-purple-500' },
    { value: 'vehicle', label: '🚗 Vehicle', color: 'border-orange-500' },
    { value: 'emergency', label: '🆘 Emergency', color: 'border-red-500' },
    { value: 'other', label: '⭐ Other', color: 'border-gray-500' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addGoal({
        ...formData,
        targetAmount: Number(formData.targetAmount),
        currentAmount: Number(formData.currentAmount),
      });
      fetchSummary();
      onClose();
      setFormData({ title: '', targetAmount: '', currentAmount: '', deadline: '', category: 'other' });
    } catch (error: any) {
      console.error('Failed to save goal:', error);
      alert(`Failed to save goal: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Financial Goal">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Goal Title</label>
          <input
            type="text"
            required
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. New House"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
            <select
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value as any })}
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Deadline</label>
            <input
              type="date"
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.deadline}
              onChange={e => setFormData({ ...formData, deadline: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Target Amount (₹)</label>
            <input
              type="number"
              required
              min="1"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.targetAmount}
              onChange={e => setFormData({ ...formData, targetAmount: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Current Savings (₹)</label>
            <input
              type="number"
              required
              min="0"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.currentAmount}
              onChange={e => setFormData({ ...formData, currentAmount: e.target.value })}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Create Goal'}
        </button>
      </form>
    </Modal>
  );
};

export default AddGoalModal;
