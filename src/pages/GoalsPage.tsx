import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Target, TrendingUp, Calendar, Trash2, CheckCircle2 } from 'lucide-react';
import { useFinancialStore, Goal } from '../store/financialStore';
import AddGoalModal from '../components/AddGoalModal';
import AddMoneyModal from '../components/AddMoneyModal';

interface GoalCardProps {
  goal: Goal & { estimatedCompletionDate?: string };
  isCompleted?: boolean;
  onAddMoney: (goal: any) => void;
  onDelete: (id: string) => void;
  calculateProgress: (current: number, target: number) => number;
  getCategoryTheme: (category: string) => any;
}

const GoalCard: React.FC<GoalCardProps> = ({ 
  goal, 
  isCompleted = false, 
  onAddMoney, 
  onDelete, 
  calculateProgress, 
  getCategoryTheme 
}) => {
  const theme = getCategoryTheme(goal.category);
  const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
  const deadline = new Date(goal.deadline);
  const estimatedDate = goal.estimatedCompletionDate ? new Date(goal.estimatedCompletionDate) : null;
  
  const isOverdue = !isCompleted && deadline < new Date();
  const isEstimatedLate = !isCompleted && estimatedDate && estimatedDate > deadline;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-slate-900 border-2 rounded-2xl p-6 transition-shadow hover:shadow-xl relative overflow-hidden ${
        isCompleted ? 'border-emerald-500/20' : `border-indigo-500/20`
      }`}
    >
      <div className="absolute top-0 right-0 p-4">
        <span className="text-2xl">{theme.emoji}</span>
      </div>

      <div className="flex flex-col h-full">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
            {goal.title}
            {isCompleted && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
          </h3>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-gray-400">
               <Calendar className={`w-3.5 h-3.5 ${isOverdue ? 'text-red-500' : ''}`} />
               <span className={isOverdue ? 'text-red-500 font-medium' : ''}>
                 Target: {deadline.toLocaleDateString()}
               </span>
            </div>
            {!isCompleted && estimatedDate && (
              <div className="flex items-center gap-2 text-xs">
                <TrendingUp className={`w-3.5 h-3.5 ${isEstimatedLate ? 'text-red-400' : 'text-emerald-400'}`} />
                <span className={isEstimatedLate ? 'text-red-400' : 'text-emerald-400'}>
                  Est. Finish: {estimatedDate.toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-medium text-gray-400">Progress</span>
              <span className={`text-lg font-bold ${isCompleted ? 'text-emerald-400' : `text-indigo-400`}`}>
                {progress}%
              </span>
            </div>
            <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className={`h-full ${isCompleted ? 'bg-emerald-500' : `bg-indigo-500`}`}
              />
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className="text-white font-medium">₹{goal.currentAmount.toLocaleString()}</span>
              <span className="text-gray-500">₹{goal.targetAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          {!isCompleted && (
            <button
              onClick={() => onAddMoney(goal)}
              className={`flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2`}
            >
              <Plus className="w-4 h-4" /> Add Money
            </button>
          )}
          <button
            onClick={() => onDelete(goal.id)}
            className="p-2 rounded-lg border border-slate-700 text-gray-400 hover:text-red-500 hover:border-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const GoalsPage: React.FC = () => {
  const { goals, fetchGoals, deleteGoal } = useFinancialStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMoneyModalOpen, setIsMoneyModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  useEffect(() => {
    fetchGoals();
  }, []);

  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const getCategoryTheme = (category: string) => {
    const themes = {
      home: { emoji: '🏠', color: 'indigo' },
      travel: { emoji: '✈️', color: 'emerald' },
      education: { emoji: '🎓', color: 'purple' },
      vehicle: { emoji: '🚗', color: 'orange' },
      emergency: { emoji: '🆘', color: 'red' },
      other: { emoji: '⭐', color: 'gray' },
    };
    return themes[category as keyof typeof themes] || themes.other;
  };

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Target className="text-indigo-500 w-8 h-8" />
            Financial Goals
          </h1>
          <p className="text-gray-400 mt-1">Plan and save for your future dreams.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all hover:scale-105 shadow-lg shadow-indigo-600/20"
        >
          <Plus className="w-5 h-5" />
          Create New Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 rounded-xl">
               <TrendingUp className="text-indigo-500 w-6 h-6" />
            </div>
            <div>
               <p className="text-gray-400 text-sm">Active Goals</p>
               <p className="text-2xl font-bold text-white">{activeGoals.length}</p>
            </div>
         </div>
         <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl">
               <CheckCircle2 className="text-emerald-500 w-6 h-6" />
            </div>
            <div>
               <p className="text-gray-400 text-sm">Completed</p>
               <p className="text-2xl font-bold text-white">{completedGoals.length}</p>
            </div>
         </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
           Ongoing Goals
        </h2>
        {activeGoals.length === 0 ? (
          <div className="text-center py-20 bg-slate-900 rounded-3xl border border-dashed border-slate-800">
            <Target className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl text-gray-400">No active goals yet</h3>
            <p className="text-gray-600 mt-2">Start your journey by creating your first goal.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeGoals.map(goal => (
              <GoalCard 
                key={goal.id} 
                goal={goal} 
                onAddMoney={(g) => { setSelectedGoal(g); setIsMoneyModalOpen(true); }}
                onDelete={deleteGoal}
                calculateProgress={calculateProgress}
                getCategoryTheme={getCategoryTheme}
              />
            ))}
          </div>
        )}
      </div>

      {completedGoals.length > 0 && (
        <div className="pt-8 border-t border-slate-800">
          <h2 className="text-xl font-bold text-gray-400 mb-6 font-mono tracking-widest uppercase">
            Achieved Goals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-80">
            {completedGoals.map(goal => (
              <GoalCard 
                key={goal.id} 
                goal={goal} 
                isCompleted 
                onAddMoney={() => {}} 
                onDelete={deleteGoal}
                calculateProgress={calculateProgress}
                getCategoryTheme={getCategoryTheme}
              />
            ))}
          </div>
        </div>
      )}

      <AddGoalModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <AddMoneyModal isOpen={isMoneyModalOpen} onClose={() => setIsMoneyModalOpen(false)} goal={selectedGoal} />
    </div>
  );
};

export default GoalsPage;
