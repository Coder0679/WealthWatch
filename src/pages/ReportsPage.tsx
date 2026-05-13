import { useEffect, useState } from 'react';
import { useReportStore } from '../store/reportStore';
import { FileText, Download, Eye, Calendar, Sparkles, Loader2, Search, ArrowRight } from 'lucide-react';
import Layout from '../components/Layout';
import ReportSummary from '../components/ReportSummary';
import { motion } from 'framer-motion';

export default function ReportsPage() {
  const { reports, isLoading, isGenerating, fetchReports, generateReport } = useReportStore();
  const [selectedReport, setSelectedReport] = useState<any>(null);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const currentMonthName = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Monthly Reports</h1>
            <p className="text-[#94A3B8]">Deep-dive audits and AI-powered performance analysis</p>
          </div>
        </div>

        {/* Current Month Generator Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 p-8 shadow-2xl shadow-indigo-500/20">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 text-indigo-100 mb-2 font-mono text-sm uppercase tracking-widest">
                <Calendar size={14} />
                Current Active Period
              </div>
              <h2 className="text-4xl font-black text-white mb-6 uppercase italic">
                {currentMonthName}
              </h2>
              
              <div className="flex flex-wrap gap-6 mb-8">
                <div>
                  <p className="text-indigo-200 text-xs mb-1 uppercase font-bold">In-Flow</p>
                  <p className="text-xl font-bold text-white">₹85,000</p>
                </div>
                <div className="h-10 w-px bg-white/10 hidden sm:block"></div>
                <div>
                  <p className="text-indigo-200 text-xs mb-1 uppercase font-bold">Out-Flow</p>
                  <p className="text-xl font-bold text-white">₹42,500</p>
                </div>
                <div className="h-10 w-px bg-white/10 hidden sm:block"></div>
                <div>
                  <p className="text-indigo-200 text-xs mb-1 uppercase font-bold">Net Savings</p>
                  <p className="text-xl font-bold text-white">₹42,500</p>
                </div>
              </div>

              <button 
                onClick={generateReport}
                disabled={isGenerating}
                className="group relative flex items-center gap-3 px-8 py-4 bg-white text-indigo-700 rounded-2xl font-black uppercase tracking-tighter hover:bg-opacity-90 transition-all disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    📊 Generating audit...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                    Generate Monthly Audit
                    <ArrowRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
            <div className="hidden md:flex justify-end opacity-20">
               <FileText size={240} strokeWidth={1} />
            </div>
          </div>
          
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 -u-translate-y-1/2 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl italic font-black text-white select-none pointer-events-none flex items-center justify-center text-9xl">
            AUDIT
          </div>
        </div>

        {/* Previous Reports List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">Audit Archive</h3>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#475569] group-focus-within:text-indigo-400 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search audits..."
                className="pl-10 pr-4 py-2 bg-[#111827] border border-[#1F2937] rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
             {isLoading && reports.length === 0 ? (
               <div className="p-12 text-center bg-[#111827] rounded-3xl border border-dashed border-[#1F2937]">
                 <Loader2 className="animate-spin mx-auto mb-4 text-[#475569]" size={32} />
                 <p className="text-[#94A3B8]">Loading your audit history...</p>
               </div>
             ) : reports.length === 0 ? (
                <div className="p-12 text-center bg-[#111827] rounded-3xl border border-dashed border-[#1F2937]">
                  <FileText className="mx-auto mb-4 text-[#475569]" size={48} />
                  <p className="text-white font-bold mb-1">No reports generated yet</p>
                  <p className="text-sm text-[#94A3B8]">Start your first monthly audit above ☝️</p>
                </div>
             ) : (
               reports.map((report) => (
                 <motion.div 
                   key={report.reportId}
                   initial={{ opacity: 0, x: -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="flex flex-col sm:flex-row items-center justify-between p-6 bg-[#111827] hover:bg-[#161F30] border border-[#1F2937] rounded-3xl transition-all group"
                 >
                   <div className="flex items-center gap-5 mb-4 sm:mb-0">
                     <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                       <FileText size={28} />
                     </div>
                     <div>
                       <h4 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{report.monthName} Audit</h4>
                       <div className="flex items-center gap-3 mt-1 text-xs text-[#94A3B8]">
                         <span className="flex items-center gap-1">
                           <Calendar size={12} />
                           Generated on {new Date(report.generatedAt).toLocaleDateString()}
                         </span>
                         <span className="h-1 w-1 rounded-full bg-[#1F2937]"></span>
                         <span className="uppercase font-mono text-indigo-500/70">{report.reportId.slice(0, 8)}</span>
                       </div>
                     </div>
                   </div>

                   <div className="flex items-center gap-3 w-full sm:w-auto">
                     <button 
                      onClick={() => setSelectedReport(report)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-[#1F2937] hover:bg-[#2D3748] text-white rounded-xl text-sm font-bold transition-colors"
                     >
                       <Eye size={16} />
                       Summary
                     </button>
                     <a 
                      href={report.downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                     >
                       <Download size={16} />
                       PDF
                     </a>
                   </div>
                 </motion.div>
               ))
             )}
          </div>
        </div>
      </div>

      {selectedReport && (
        <ReportSummary 
          report={selectedReport} 
          onClose={() => setSelectedReport(null)} 
        />
      )}
    </Layout>
  );
}
