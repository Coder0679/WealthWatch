import { useEffect } from 'react';
import { useDashboardStore } from '../store/dashboardStore';
import { Wallet, TrendingUp, TrendingDown, IndianRupee, Loader2 } from 'lucide-react';
import Layout from '../components/Layout';
import SummaryCard from '../components/SummaryCard';
import NetWorthChart from '../components/NetWorthChart';
import SpendingChart from '../components/SpendingChart';
import IncomeExpenseChart from '../components/IncomeExpenseChart';
import AssetAllocationChart from '../components/AssetAllocationChart';

export default function DashboardPage() {
  const { summary, charts, isLoading, fetchSummary, fetchCharts } = useDashboardStore();

  useEffect(() => {
    fetchSummary();
    fetchCharts();
  }, [fetchSummary, fetchCharts]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading && !summary) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0F1E] text-white">
        <Loader2 className="animate-spin mb-4 text-indigo-500" size={48} />
        <p className="text-[#94A3B8] font-medium animate-pulse">Analyzing your portofolio...</p>
      </div>
    );
  }

  return (
    <Layout>
      <div className="p-4 md:p-8 space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          {/* Top Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1">Financial Command Center</h1>
              <p className="text-sm sm:text-base text-[#94A3B8]">Your wealth performance at a glance</p>
            </div>
            <div className="grid grid-cols-2 items-center gap-2 bg-[#111827] border border-[#1F2937] p-1 rounded-xl w-full sm:w-auto">
               <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium shadow-lg shadow-indigo-500/20">Summary</button>
               <button className="px-4 py-2 text-[#94A3B8] hover:text-white rounded-lg text-sm font-medium transition-colors">Detailed</button>
            </div>
          </div>

          {/* KPI Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <SummaryCard 
              title="Net Worth" 
              value={formatCurrency(summary?.netWorth || 0)} 
              icon={<Wallet />} 
              change={2.5} 
              changeLabel="↑ 12% vs last year" 
              variant="purple" 
            />
            <SummaryCard 
              title="Total Assets" 
              value={formatCurrency(summary?.totalAssets || 0)} 
              icon={<TrendingUp />} 
              change={5.0} 
              changeLabel="Market growth impact" 
              variant="emerald" 
            />
            <SummaryCard 
              title="Total Liabilities" 
              value={formatCurrency(summary?.totalLiabilities || 0)} 
              icon={<TrendingDown />} 
              change={-1.5} 
              changeLabel="Debt reduction active" 
              variant="rose" 
            />
            <SummaryCard 
              title="Monthly Savings" 
              value={formatCurrency(summary?.monthlySavings || 0)} 
              icon={<IndianRupee />} 
              change={10} 
              changeLabel="85% of monthly goal" 
              variant="blue" 
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            <div className="lg:col-span-8 bg-[#111827] p-5 sm:p-8 rounded-3xl border border-[#1F2937] hover:border-indigo-500/20 transition-colors group overflow-hidden">
              <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8">
                <div className="min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-1">Net Worth Progression</h3>
                  <p className="text-sm text-[#94A3B8]">Growth trajectory over the last 6 months</p>
                </div>
                <div className="h-10 w-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                  <TrendingUp size={20} />
                </div>
              </div>
              {charts && <NetWorthChart data={charts.netWorthHistory} />}
            </div>

            <div className="lg:col-span-4 bg-[#111827] p-5 sm:p-8 rounded-3xl border border-[#1F2937] hover:border-emerald-500/20 transition-colors overflow-hidden">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-1">Asset Allocation</h3>
              <p className="text-sm text-[#94A3B8] mb-6 sm:mb-8">Current portfolio distribution</p>
              {charts && <AssetAllocationChart data={charts.assetAllocation} />}
            </div>

            <div className="lg:col-span-6 bg-[#111827] p-5 sm:p-8 rounded-3xl border border-[#1F2937] hover:border-blue-500/20 transition-colors overflow-hidden">
               <h3 className="text-lg sm:text-xl font-bold text-white mb-1">Income vs Expense</h3>
               <p className="text-sm text-[#94A3B8] mb-6 sm:mb-8">Monthly cashflow analysis</p>
              {charts && <IncomeExpenseChart data={charts.incomeVsExpense} />}
            </div>

            <div className="lg:col-span-6 bg-[#111827] p-5 sm:p-8 rounded-3xl border border-[#1F2937] hover:border-purple-500/20 transition-colors overflow-hidden">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-1">Spending Categories</h3>
              <p className="text-sm text-[#94A3B8] mb-6 sm:mb-8">Top expense areas this month</p>
              {charts && <SpendingChart data={charts.spendingByCategory} />}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
