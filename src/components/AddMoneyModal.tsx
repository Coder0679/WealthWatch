import React, { useState } from 'react';
import Modal from './Modal';
import { useFinancialStore, Goal } from '../store/financialStore';
import { useDashboardStore } from '../store/dashboardStore';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal | null;
}

const AddMoneyModal: React.FC<Props> = ({ isOpen, onClose, goal }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { updateGoal, addTransaction } = useFinancialStore();
  const { fetchSummary } = useDashboardStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal || !amount) return;
    
    setLoading(true);
    try {
      const addVal = Number(amount);
      const newTotal = goal.currentAmount + addVal;
      
      // 1. Update Goal
      await updateGoal(goal.id, newTotal);
      
      // 2. Add Transaction (Savings)
      await addTransaction({
        amount: addVal,
        category: 'Savings',
        type: 'expense',
        date: new Date().toISOString().split('T')[0],
        note: `Saved for goal: ${goal.title}`
      });

      fetchSummary();
      onClose();
      setAmount('');
    } catch (error: any) {
      console.error('Failed to add money:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Add Savings to ${goal?.title}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Amount to Add (₹)</label>
          <input
            type="number"
            required
            min="1"
            autoFocus
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-2">
            This will be recorded as a 'Savings' expense in your transactions.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Confirm Contribution'}
        </button>
      </form>
    </Modal>
  );
};

export default AddMoneyModal;
