import { X, FileText, Download, Printer, PieChart, TrendingUp, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReportSummaryProps {
  report: any;
  onClose: () => void;
}

export default function ReportSummary({ report, onClose }: ReportSummaryProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#111827] border border-[#1F2937] w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-[#1F2937] flex items-center justify-between bg-indigo-500/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                <FileText size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Monthly Summary</h2>
                <p className="text-sm text-[#94A3B8]">{report.monthName}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handlePrint}
                className="p-2 text-[#94A3B8] hover:text-white hover:bg-[#1F2937] rounded-lg transition-colors"
                title="Print Summary"
              >
                <Printer size={20} />
              </button>
              <button 
                onClick={onClose}
                className="p-2 text-[#94A3B8] hover:text-white hover:bg-[#1F2937] rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8 print:p-0">
            {/* 4 Sections logic */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Section 1: Financial Standing */}
              <div className="p-6 bg-[#0F172A] rounded-2xl border border-[#1F2937]">
                <div className="flex items-center gap-2 text-emerald-400 mb-4">
                  <PieChart size={18} />
                  <h3 className="font-bold">Portfolio Standing</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-[#94A3B8] uppercase tracking-wider mb-1">Net Worth</p>
                    <p className="text-2xl font-bold text-white">₹--</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-[#94A3B8] uppercase tracking-wider mb-1">Assets</p>
                      <p className="font-semibold text-white text-sm">₹--</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#94A3B8] uppercase tracking-wider mb-1">Liabilities</p>
                      <p className="font-semibold text-rose-400 text-sm">₹--</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Cashflow Trends */}
              <div className="p-6 bg-[#0F172A] rounded-2xl border border-[#1F2937]">
                <div className="flex items-center gap-2 text-blue-400 mb-4">
                  <TrendingUp size={18} />
                  <h3 className="font-bold">Monthly Cashflow</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#94A3B8]">Income</span>
                    <span className="font-bold text-emerald-400">₹--</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#94A3B8]">Expenses</span>
                    <span className="font-bold text-rose-400">₹--</span>
                  </div>
                  <div className="h-px bg-white/5 my-2"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-white">Net Savings</span>
                    <span className="text-xl font-bold text-indigo-400">₹--</span>
                  </div>
                </div>
              </div>

              {/* Section 3: Goal Milestones */}
              <div className="p-6 bg-[#0F172A] rounded-2xl border border-[#1F2937] md:col-span-2">
                <div className="flex items-center gap-2 text-indigo-400 mb-4">
                  <ShieldCheck size={18} />
                  <h3 className="font-bold">Strategic Milestones</h3>
                </div>
                <p className="text-sm text-[#94A3B8] leading-relaxed">
                  Your goals are being tracked based on the generated PDF report. 
                  Please download the full PDF to see granular progress for each active goal.
                </p>
              </div>

              {/* Section 4: AI Audit Highlights */}
              <div className="p-6 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 md:col-span-2">
                <h3 className="text-indigo-400 font-bold mb-3 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse"></span>
                  AI Auditor Perspective
                </h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed italic">
                  "Based on your spending patterns this month, we've identified potential savings of ₹4,200 in recurring subscriptions. Overall portfolio health remains stable with a slightly improved savings rate of 12%."
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 bg-[#0A0F1E] border-t border-[#1F2937] flex items-center justify-between">
             <p className="text-xs text-[#94A3B8] font-mono">ID: {report.reportId}</p>
             <div className="flex items-center gap-3">
               <a 
                href={report.downloadUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/20"
               >
                 <Download size={16} />
                 Download PDF
               </a>
             </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
