import React, { useEffect, useState } from 'react';
import { useFinancialStore } from '../store/financialStore';
import Layout from '../components/Layout';
import { 
  Plus, 
  AlertTriangle, 
  CreditCard, 
  HelpCircle,
  Calendar,
  IndianRupee,
  Trash2
} from 'lucide-react';
import AddLiabilityModal from '../components/AddLiabilityModal';

export default function LiabilitiesPage() {
  const { liabilities, isLoading, fetchLiabilities, deleteLiability } = useFinancialStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchLiabilities();
  }, [fetchLiabilities]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalRemaining = liabilities.reduce((sum, l) => sum + l.remainingAmount, 0);
  const totalMonthlyEMI = liabilities.reduce((sum, l) => sum + (l.emiAmount || 0), 0);

  return (
    <Layout>
      <div className="p-4 md:p-8 space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-[#94A3B8] font-bold uppercase tracking-widest text-[10px] mb-1">Total Outstanding</p>
                <h1 className="text-3xl sm:text-4xl font-black text-rose-500 break-words">{formatCurrency(totalRemaining)}</h1>
              </div>
              <div className="bg-[#111827] border border-[#1F2937] px-4 py-2 rounded-xl inline-block">
                <p className="text-[#94A3B8] font-bold uppercase tracking-widest text-[9px] mb-1">Monthly EMI commitment</p>
                <p className="text-xl font-bold text-white">{formatCurrency(totalMonthlyEMI)}</p>
              </div>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-700 rounded-2xl font-bold transition-all shadow-lg shadow-rose-500/20 active:scale-95"
            >
              <Plus size={20} />
              <span>Add Liability</span>
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {liabilities.map((liab) => {
              const paidAmount = liab.totalAmount - liab.remainingAmount;
              const progress = (paidAmount / liab.totalAmount) * 100;
              const isDueSoon = new Date(liab.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

              return (
                <div key={liab.id} className="bg-[#111827] border border-[#1F2937] p-5 sm:p-8 rounded-[2rem] relative overflow-hidden group hover:border-rose-500/20 transition-colors">
                  <div className="flex justify-between items-start gap-4 mb-8">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${liab.type === 'credit_card' ? 'bg-orange-500/10 text-orange-400' : 'bg-blue-500/10 text-blue-400'}`}>
                        {liab.type === 'credit_card' ? <CreditCard size={32} /> : <IndianRupee size={32} />}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xl sm:text-2xl font-bold text-white break-words">{liab.name}</h3>
                        <p className="text-sm text-[#94A3B8] capitalize">{liab.type.replace('_', ' ')} • {liab.interestRate}% Int.</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        if(confirm('Delete this liability?')) {
                          deleteLiability(liab.id);
                        }
                      }}
                      className="p-2 text-gray-700 hover:text-rose-500 transition-colors md:opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1">Total Loan</p>
                        <p className="text-xl font-bold text-white">{formatCurrency(liab.totalAmount)}</p>
                      </div>
                      <div className="sm:text-right">
                        <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-1">Remaining</p>
                        <p className="text-xl font-bold text-rose-400">{formatCurrency(liab.remainingAmount)}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                       <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-[#94A3B8]">
                         <span>Repayment Progress</span>
                         <span>{progress.toFixed(0)}%</span>
                       </div>
                       <div className="h-3 w-full bg-[#0A0F1E] rounded-full overflow-hidden border border-[#1F2937]">
                         <div 
                           className="h-full bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-1000"
                           style={{ width: `${progress}%` }}
                         ></div>
                       </div>
                    </div>

                    <div className="pt-6 border-t border-[#1F2937] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Calendar size={18} className={isDueSoon ? 'text-rose-400' : 'text-[#94A3B8]'} />
                        <div>
                          <p className={`text-xs font-bold ${isDueSoon ? 'text-rose-400' : 'text-[#94A3B8]'}`}>Next Due Date</p>
                          <p className="text-sm font-bold text-white">{liab.dueDate}</p>
                        </div>
                      </div>
                      {liab.emiAmount > 0 && (
                        <div className="bg-[#0A0F1E] px-4 py-2 rounded-xl border border-indigo-500/20">
                          <p className="text-[9px] font-bold text-indigo-400 uppercase leading-none mb-1">Monthly EMI</p>
                          <p className="text-base font-black text-white">{formatCurrency(liab.emiAmount)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {liabilities.length === 0 && !isLoading && (
            <div className="py-20 text-center bg-[#111827] border border-[#1F2937] rounded-3xl">
              <div className="h-20 w-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <HelpCircle className="text-indigo-400" size={40} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No debt recorded?</h3>
              <p className="text-[#94A3B8] mb-6">Either you are debt-free (congrats!) or you haven't added your loans yet.</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-3 bg-indigo-600 rounded-2xl font-bold hover:bg-indigo-700 transition-all"
              >
                Track a Liability
              </button>
            </div>
          )}
        </div>
      </div>

      <AddLiabilityModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Layout>
  );
}
