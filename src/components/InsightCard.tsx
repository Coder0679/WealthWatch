import React from 'react';
import { motion } from 'motion/react';
import { 
  AlertCircle, 
  TrendingUp, 
  Wallet, 
  ShieldCheck, 
  Target,
  ArrowUpRight
} from 'lucide-react';
import { Insight } from '../services/aiService';

const CATEGORY_ICONS = {
  saving: <Wallet className="text-blue-400" />,
  investing: <TrendingUp className="text-emerald-400" />,
  debt: <AlertCircle className="text-rose-400" />,
  budgeting: <Target className="text-purple-400" />,
  emergency: <ShieldCheck className="text-orange-400" />,
};

const PRIORITY_COLORS = {
  high: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

interface InsightCardProps extends Insight {
  key?: React.Key;
}

export default function InsightCard({ title, description, priority, category }: InsightCardProps) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className={`bg-[#111827] border border-[#1F2937] p-6 rounded-3xl relative overflow-hidden group transition-all`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="h-12 w-12 rounded-2xl bg-[#0A0F1E] border border-[#1F2937] flex items-center justify-center">
          {CATEGORY_ICONS[category]}
        </div>
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${PRIORITY_COLORS[priority]}`}>
          {priority} Priority
        </span>
      </div>

      <div>
        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          {title}
        </h3>
        <p className="text-[#94A3B8] text-sm leading-relaxed mb-6">
          {description}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-[#1F2937]">
          <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">{category}</span>
          <button className="text-indigo-400 text-xs font-bold hover:underline flex items-center gap-1">
            Action Plan <ArrowUpRight size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
