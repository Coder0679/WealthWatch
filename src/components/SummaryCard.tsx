import React, { ReactNode } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  change: number;
  changeLabel: string;
  variant: 'purple' | 'emerald' | 'rose' | 'blue';
}

const variants = {
  purple: {
    gradient: 'from-indigo-600/20 to-purple-600/5',
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-400',
    glow: 'glow-purple',
    border: 'border-purple-500/20'
  },
  emerald: {
    gradient: 'from-emerald-600/20 to-teal-600/5',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-400',
    glow: 'glow-emerald',
    border: 'border-emerald-500/20'
  },
  rose: {
    gradient: 'from-rose-600/20 to-orange-600/5',
    iconBg: 'bg-rose-500/10',
    iconColor: 'text-rose-400',
    glow: 'glow-rose',
    border: 'border-rose-500/20'
  },
  blue: {
    gradient: 'from-blue-600/20 to-cyan-600/5',
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-400',
    glow: 'glow-blue',
    border: 'border-blue-500/20'
  }
};

export default function SummaryCard({ title, value, icon, change, changeLabel, variant }: SummaryCardProps) {
  const isPositive = change >= 0;
  const config = variants[variant];
  
  return (
    <div className={`relative overflow-hidden bg-[#111827] p-6 rounded-2xl border ${config.border} ${config.glow} transition-transform hover:scale-[1.02] duration-300`}>
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${config.gradient} blur-3xl -mr-16 -mt-16 opacity-50`}></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className={`p-4 ${config.iconBg} ${config.iconColor} rounded-2xl shadow-inner`}>
            {React.cloneElement(icon as React.ReactElement, { size: 28 })}
          </div>
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
            {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            {Math.abs(change)}%
          </div>
        </div>
        
        <div>
          <h3 className="text-[#94A3B8] font-medium text-sm mb-1 uppercase tracking-wider">{title}</h3>
          <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
          <div className="flex items-center gap-2 mt-4 text-xs font-medium text-[#94A3B8]">
             <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
             {changeLabel}
          </div>
        </div>
      </div>
    </div>
  );
}
