import React, { useEffect, useState } from 'react';
import { useFinancialStore } from '../store/financialStore';
import Layout from '../components/Layout';
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Trash2, 
  Calendar,
  IndianRupee,
  Utensils,
  Plane,
  ShoppingBag,
  CreditCard,
  Zap,
  MoreHorizontal
} from 'lucide-react';
import AddTransactionModal from '../components/AddTransactionModal';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Salary: <IndianRupee className="text-emerald-400" />,
  Food: <Utensils className="text-orange-400" />,
  Travel: <Plane className="text-blue-400" />,
  Shopping: <ShoppingBag className="text-purple-400" />,
  EMI: <CreditCard className="text-rose-400" />,
  Bills: <Zap className="text-yellow-400" />,
  Other: <MoreHorizontal className="text-gray-400" />,
};

export default function TransactionsPage() {
  const { transactions, isLoading, fetchTransactions, deleteTransaction } = useFinancialStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState({ type: '', category: '', month: '' });

  useEffect(() => {
    fetchTransactions(filter);
  }, [fetchTransactions, filter]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <Layout>
      <div className="p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Transactions</h1>
              <p className="text-[#94A3B8]">Track and manage your daily cashflow</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
            >
              <Plus size={20} />
              <span>Add New</span>
            </button>
          </div>

          {/* Quick Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <ArrowUpCircle size={28} />
              </div>
              <div>
                <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Total Income</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(totalIncome)}</p>
              </div>
            </div>
            <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400">
                <ArrowDownCircle size={28} />
              </div>
              <div>
                <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Total Expense</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(totalExpense)}</p>
              </div>
            </div>
            <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <IndianRupee size={28} />
              </div>
              <div>
                <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Monthly Balance</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(totalIncome - totalExpense)}</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-[#111827] border border-[#1F2937] p-4 rounded-2xl mb-6 flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
              <input 
                type="text" 
                placeholder="Search transactions..." 
                className="w-full bg-[#0A0F1E] border border-[#1F2937] rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:border-indigo-500 outline-none"
              />
            </div>
            <select 
              className="bg-[#0A0F1E] border border-[#1F2937] rounded-xl px-4 py-2 text-sm text-white"
              onChange={(e) => setFilter({ ...filter, type: e.target.value })}
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <select 
              className="bg-[#0A0F1E] border border-[#1F2937] rounded-xl px-4 py-2 text-sm text-white"
              onChange={(e) => setFilter({ ...filter, category: e.target.value })}
            >
              <option value="">All Categories</option>
              <option value="Salary">Salary</option>
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="EMI">EMI</option>
            </select>
          </div>

          {/* List */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#1F2937]/50">
                    <th className="px-6 py-4 text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Transaction</th>
                    <th className="px-6 py-4 text-xs font-bold text-[#94A3B8] uppercase tracking-wider text-center">Category</th>
                    <th className="px-6 py-4 text-xs font-bold text-[#94A3B8] uppercase tracking-wider text-center">Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-[#94A3B8] uppercase tracking-wider text-right">Amount</th>
                    <th className="px-6 py-4 text-xs font-bold text-[#94A3B8] uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F2937]">
                  {transactions.map((txn) => (
                    <tr key={txn.id} className="hover:bg-[#1C2533] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-[#0A0F1E] flex items-center justify-center p-2">
                            {CATEGORY_ICONS[txn.category] || CATEGORY_ICONS['Other']}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{txn.note || txn.category}</p>
                            <p className="text-xs text-[#94A3B8]">{txn.type === 'income' ? 'Cash In' : 'Cash Out'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 rounded-full bg-[#0A0F1E] border border-[#1F2937] text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">
                          {txn.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2 text-xs text-[#94A3B8]">
                          <Calendar size={14} />
                          {new Date(txn.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className={`text-sm font-bold ${txn.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => {
                            if(confirm('Are you sure you want to delete this transaction?')) {
                              deleteTransaction(txn.id);
                            }
                          }}
                          className="p-2 text-[#94A3B8] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all md:opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-[#94A3B8]">
                        No transactions found matching your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Layout>
  );
}
