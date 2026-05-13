import React from 'react';
import { motion } from 'motion/react';

interface Props {
  score: number;
}

export default function HealthScoreCard({ score }: Props) {
  const getColor = (s: number) => {
    if (s < 40) return 'text-rose-500';
    if (s < 70) return 'text-yellow-500';
    return 'text-emerald-500';
  };

  const getLabel = (s: number) => {
    if (s < 40) return 'Poor';
    if (s < 70) return 'Fair';
    if (s < 90) return 'Good';
    return 'Excellent';
  };

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-[#111827] border border-[#1F2937] p-8 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden">
      <div className="relative h-48 w-48 flex items-center justify-center">
        <svg className="h-full w-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="45"
            className="stroke-[#0A0F1E] fill-none"
            strokeWidth="10"
          />
          <motion.circle
            cx="50%"
            cy="50%"
            r="45"
            className={`fill-none ${getColor(score).replace('text-', 'stroke-')}`}
            strokeWidth="10"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`text-5xl font-black ${getColor(score)}`}
          >
            {score}
          </motion.span>
          <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mt-1">Health Score</span>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <p className={`text-xl font-bold ${getColor(score)}`}>{getLabel(score)}</p>
        <p className="text-sm text-[#94A3B8] mt-1">Based on diversification, savings, and debt</p>
      </div>
    </div>
  );
}
