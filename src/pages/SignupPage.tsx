import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  UserPlus, 
  Loader2, 
  Check, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Wallet,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { signup, isLoading, error } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(name, email, password);
      navigate('/dashboard');
    } catch (err) {}
  };

  const features = [
    "Unlimited transaction tracking",
    "AI-powered financial insights",
    "Goal & budget management",
    "Advanced analytics & reports",
    "Assets & liabilities tracker",
    "Export to CSV & PDF"
  ];

  return (
    <div className="flex min-h-screen bg-[#0A0F1E] font-sans selection:bg-indigo-500/30">
      {/* Left Side - Marketing & Features */}
      <div className="hidden lg:flex flex-col w-[45%] bg-[#15192C] p-16 relative overflow-hidden">
        {/* Subtle Gradient Orbs */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-40 -right-24 w-80 h-80 bg-purple-600/10 blur-[80px] rounded-full"></div>

        <Link to="/" className="flex items-center gap-2 mb-20 relative z-10 transition-transform hover:scale-105 inline-flex w-fit">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Wallet size={24} className="text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-white">WealthWatch</span>
        </Link>

        <div className="relative z-10">
          <h1 className="text-5xl font-black text-white mb-8 leading-[1.1] tracking-tight">
            Start your wealth <br />
            <span className="text-indigo-400">journey today.</span>
          </h1>
          <p className="text-gray-400 text-lg mb-12 max-w-md leading-relaxed">
            Get everything you need to manage, track, and grow your finances intelligently.
          </p>

          <div className="space-y-6 mb-16">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-4 group"
              >
                <div className="h-6 w-6 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                  <Check size={14} className="text-emerald-500" />
                </div>
                <span className="text-gray-300 font-medium">{feature}</span>
              </motion.div>
            ))}
          </div>

          <div className="bg-[#1E253E] border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex gap-4 items-start relative z-10">
              <div className="h-12 w-12 rounded-2xl bg-indigo-600/20 flex items-center justify-center">
                <Sparkles size={24} className="text-indigo-400" />
              </div>
              <div>
                <h4 className="font-bold text-white text-lg mb-1">Free to start</h4>
                <p className="text-xs text-indigo-300/60 font-bold uppercase tracking-widest mb-4">No credit card required</p>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Start with a free account and upgrade anytime for AI features and advanced analytics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 lg:px-20 relative">
        <div className="w-full max-w-md">
          {/* Progress Indicator */}
          <div className="flex items-center gap-4 mb-16">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-xs">1</div>
              <div className="h-[2px] w-48 bg-gray-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-indigo-600/20 h-full"></div>
              </div>
              <div className="h-8 w-8 rounded-full bg-gray-800 text-gray-500 flex items-center justify-center font-black text-xs">2</div>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Create your account</h2>
            <p className="text-gray-500 font-medium">Start tracking your finances in minutes</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 tracking-wide uppercase text-[10px]">Full Name</label>
                <div className="relative group">
                  <input
                    type="text"
                    required
                    className="block w-full rounded-2xl bg-white/5 border border-white/5 px-5 py-4 text-white placeholder-gray-600 focus:border-indigo-500/50 focus:bg-indigo-500/5 focus:outline-none transition-all"
                    placeholder="Alex Morgan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 tracking-wide uppercase text-[10px]">Email address</label>
                <input
                  type="email"
                  required
                  className="block w-full rounded-2xl bg-white/5 border border-white/5 px-5 py-4 text-white placeholder-gray-600 focus:border-indigo-500/50 focus:bg-indigo-500/5 focus:outline-none transition-all"
                  placeholder="alex@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-400 mb-2 tracking-wide uppercase text-[10px]">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="block w-full rounded-2xl bg-white/5 border border-white/5 px-5 py-4 pr-14 text-white placeholder-gray-600 focus:border-indigo-500/50 focus:bg-indigo-500/5 focus:outline-none transition-all"
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-rose-400 text-sm bg-rose-500/10 p-4 rounded-2xl border border-rose-500/20 font-medium"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-indigo-600 px-6 py-5 text-lg font-black text-white hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  Continue
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-sm font-medium text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-bold ml-1 inline-flex items-center gap-1 group">
              Sign in
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
