import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  LogIn, 
  Loader2, 
  Check, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Wallet,
  BarChart3,
  ShieldCheck,
  Cpu,
  Star,
  Info
} from 'lucide-react';
import { motion } from 'motion/react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();

  const handleAppIDLogin = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/appid/auth-url');
      if (!response.ok) throw new Error('Failed to get AppID auth URL');
      const { url } = await response.json();

      const width = 600;
      const height = 700;
      const left = window.innerWidth / 2 - width / 2;
      const top = window.innerHeight / 2 - height / 2;
      
      const authWindow = window.open(
        url,
        'appid_login',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      if (!authWindow) {
        alert('Please allow popups for this site to sign in with Google.');
        return;
      }

      const handleMessage = async (event: MessageEvent) => {
        if (!event.origin.endsWith('.run.app') && !event.origin.includes('localhost')) return;
        
        if (event.data?.type === 'AUTH_SUCCESS' && event.data?.token) {
          // fallback to regular login method using token if store does not expose loginWithToken
          await login(event.data.token, event.data.token);
          window.removeEventListener('message', handleMessage);
          navigate('/dashboard');
        }
      };

      window.addEventListener('message', handleMessage);
      
      const checkWindow = setInterval(() => {
        if (authWindow.closed) {
          clearInterval(checkWindow);
          window.removeEventListener('message', handleMessage);
        }
      }, 1000);
    } catch (err) {
      console.error('App ID login failed:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {}
  };

  const features = [
    {
      icon: <BarChart3 size={18} className="text-indigo-400" />,
      title: "Real-time Analytics",
      desc: "Live insights into your financial health"
    },
    {
      icon: <ShieldCheck size={18} className="text-blue-400" />,
      title: "Bank-level Security",
      desc: "256-bit encryption & OAuth 2.0"
    },
    {
      icon: <Cpu size={18} className="text-purple-400" />,
      title: "AI-Powered Insights",
      desc: "Personalized recommendations from Llama 3.3"
    }
  ];

  return (
    <div className="flex min-h-screen bg-[#0A0F1E] font-sans selection:bg-indigo-500/30">
      {/* Left Side - Marketing Content */}
      <div className="hidden lg:flex flex-col w-[45%] bg-[#15192C] p-16 relative overflow-hidden border-r border-white/5">
        {/* Decorative Gradients */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-40 -right-24 w-80 h-80 bg-emerald-600/5 blur-[80px] rounded-full"></div>

        <Link to="/" className="flex items-center gap-2 mb-20 relative z-10 transition-transform hover:scale-105 inline-flex w-fit">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Wallet size={24} className="text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-white">WealthWatch</span>
        </Link>

        <div className="relative z-10 flex-grow">
          <h1 className="text-5xl font-black text-white mb-8 leading-[1.1] tracking-tight">
            Take control of your <br />
            <span className="text-indigo-400">financial future.</span>
          </h1>
          <p className="text-gray-400 text-lg mb-12 max-w-md leading-relaxed">
            Join 50,000+ users who manage their wealth intelligently with AI-powered insights.
          </p>

          <div className="space-y-8 mb-20">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-4 group"
              >
                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-indigo-500/30 transition-colors">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">{feature.title}</h4>
                  <p className="text-sm text-gray-500 font-medium">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="relative z-10 flex items-center justify-between border-t border-white/5 pt-12">
          <div>
            <p className="text-2xl font-black text-white">50K+</p>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Active Users</p>
          </div>
          <div>
            <p className="text-2xl font-black text-white">$2.8B</p>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Assets Tracked</p>
          </div>
          <div>
            <p className="text-2xl font-black text-white">4.9★</p>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">User Rating</p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 lg:px-20">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Welcome back</h2>
            <p className="text-gray-500 font-medium">Sign in to your WealthWatch account</p>
          </div>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleAppIDLogin}
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white/5 border border-white/5 px-6 py-4 text-sm font-bold text-white hover:bg-white/10 transition-all shadow-xl hover:shadow-indigo-500/5 group mb-8"
          >
            <img src="https://lh3.googleusercontent.com/COxitqSgS1P-B89Ppe8SsmD6-8C3I2qmN79K1Xm60GvGK0D4m_V9nI1Zv5p_Vv-Fv-I" className="w-5 h-5" alt="Google" />
            <span>Continue with Google</span>
          </motion.button>

          <div className="relative mb-8 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <span className="relative bg-[#0A0F1E] px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              or sign in with email
            </span>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 mb-2 tracking-widest uppercase">Email address</label>
                <input
                  type="email"
                  required
                  className="block w-full rounded-2xl bg-white/5 border border-white/5 px-5 py-4 text-white placeholder-gray-600 focus:border-indigo-500/50 focus:bg-indigo-500/5 focus:outline-none transition-all"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase">Password</label>
                  <a href="#" className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest">Forgot password?</a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="block w-full rounded-2xl bg-white/5 border border-white/5 px-5 py-4 pr-14 text-white placeholder-gray-600 focus:border-indigo-500/50 focus:bg-indigo-500/5 focus:outline-none transition-all"
                    placeholder="••••••••"
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

            <div className="flex items-center gap-3">
              <button 
                type="button"
                onClick={() => setKeepSignedIn(!keepSignedIn)}
                className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${
                  keepSignedIn ? 'bg-indigo-600 border-indigo-600' : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                {keepSignedIn && <Check size={12} className="text-white" />}
              </button>
              <span className="text-sm font-medium text-gray-500">Keep me signed in</span>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-rose-400 text-sm bg-rose-500/10 p-4 rounded-xl border border-rose-500/20 font-medium"
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
                  Sign in
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-sm font-medium text-gray-500">
            Don't have an account?{' '}
            <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-bold ml-1 inline-flex items-center gap-1 group">
              Create account
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </p>

          <div className="mt-10 p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex items-center gap-3">
            <Info size={16} className="text-indigo-400 shrink-0" />
            <p className="text-[11px] text-gray-500 font-medium">
              <span className="text-white font-bold">Demo mode:</span> credentials pre-filled. Click "Sign in" to explore.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

