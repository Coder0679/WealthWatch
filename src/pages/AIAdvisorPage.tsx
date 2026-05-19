import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import { useAIStore } from '../store/aiStore';
import { useDashboardStore } from '../store/dashboardStore';
import { useFinancialStore } from '../store/financialStore';
import HealthScoreCard from '../components/HealthScoreCard';
import InsightCard from '../components/InsightCard';
import { Sparkles, Loader2, RefreshCw, MessageSquareQuote } from 'lucide-react';
import MonthlyNarrativeTts from '../components/MonthlyNarrativeTts';


export default function AIAdvisorPage() {
  const { insights, healthScore, monthlySummary, isLoading, fetchInsights, fetchSummary, fetchMonthlyNarrativeTts, calculateHealthScore } = useAIStore();

  const { summary, fetchSummary: fetchDashboardSummary } = useDashboardStore();
  const { fetchAssets, fetchLiabilities } = useFinancialStore();

  useEffect(() => {
    // Ensure we have current data to work with
    const init = async () => {
      await Promise.all([
        fetchDashboardSummary(),
        fetchAssets(),
        fetchLiabilities()
      ]);
      calculateHealthScore();
    };
    init();
  }, [fetchDashboardSummary, fetchAssets, fetchLiabilities, calculateHealthScore]);

  return (
    <Layout>
      <div className="p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="text-indigo-400" size={24} />
                <h1 className="text-3xl font-black tracking-tight text-white">AI Financial Advisor</h1>
              </div>
              <p className="text-[#94A3B8]">Personalized wealth optimization powered by Groq & Llama 3.3</p>
            </div>
            <button 
              onClick={() => { fetchInsights(); fetchSummary(); }}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <RefreshCw size={20} />}
              <span>{insights ? 'Refresh Insights' : 'Get AI Insights'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Health Score & Summary */}
            <div className="lg:col-span-4 space-y-8">
              <HealthScoreCard score={healthScore} />
              
              <div className="bg-[#111827] border border-[#1F2937] p-8 rounded-3xl relative overflow-hidden">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquareQuote className="text-indigo-400" size={20} />
                  <h3 className="text-lg font-bold text-white">Monthly Narrative</h3>
                </div>
                {monthlySummary ? (
                  <p className="text-[#94A3B8] text-sm leading-relaxed italic">
                    "{monthlySummary}"
                  </p>
                ) : (
                  <p className="text-[#94A3B8] text-sm italic">
                    Click refresh to generate your personal monthly summary.
                  </p>
                )}

                {/* TTS Controls */}
                <MonthlyNarrativeTts
                  summaryText={monthlySummary}
                  fetchTts={fetchMonthlyNarrativeTts}
                />
              </div>

            </div>

            {/* Right: Insights */}
            <div className="lg:col-span-8">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-1">Recommended Actions</h3>
                <p className="text-sm text-[#94A3B8]">High-impact moves to improve your financial stance</p>
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-[400px] bg-[#111827] border border-[#1F2937] rounded-3xl border-dashed">
                  <Loader2 className="animate-spin text-indigo-500 mb-4" size={48} />
                  <p className="text-white font-bold animate-pulse">🤖 Analyzing your portfolio...</p>
                  <p className="text-[#94A3B8] text-sm mt-2">Checking transactions, assets, and liabilities</p>
                </div>
              ) : insights ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {insights.map((insight, idx) => (
                    <InsightCard key={idx} title={insight.title} description={insight.description} priority={insight.priority} category={insight.category} />
                  ))}
                  {insights.length === 0 && (
                     <div className="col-span-full py-20 text-center">
                        <p className="text-[#94A3B8]">No insights generated yet. Try again in a moment.</p>
                     </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] bg-[#111827] border border-[#1F2937] rounded-3xl border-dashed">
                  <div className="h-16 w-16 bg-indigo-500/10 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="text-indigo-400" size={32} />
                  </div>
                  <h3 className="text-white font-bold text-lg">No Analysis Found</h3>
                  <p className="text-[#94A3B8] text-center max-w-sm mt-2 mb-8">
                    Kickstart your financial optimization by running a live AI analysis of your current numbers.
                  </p>
                  <button 
                    onClick={() => { fetchInsights(); fetchSummary(); }}
                    className="px-6 py-2 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-xl font-bold hover:bg-indigo-600 hover:text-white transition-all"
                  >
                    Run First Analysis
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
