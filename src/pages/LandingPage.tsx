import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthStore } from '../store/authStore';
import { 
  BarChart3, 
  Cpu, 
  Target, 
  MessageSquare, 
  TrendingUp, 
  FileText, 
  ArrowRight, 
  Check,
  Menu,
  X,
  Star,
  Plus,
  Rocket,
  User,
  ShieldCheck,
  Zap,
  Globe,
  Wallet,
  Github,
  Twitter,
  Linkedin,
  Instagram
} from 'lucide-react';

const CountUp = ({ end, duration = 2 }: { end: string, duration?: number }) => {
  const [count, setCount] = useState(0);
  const numericValue = parseInt(end.replace(/[^0-9]/g, ''));
  const suffix = end.replace(/[0-9]/g, '');

  useEffect(() => {
    let start = 0;
    const increment = numericValue / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= numericValue) {
        setCount(numericValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [numericValue, duration]);

  return <span>{count}{suffix}</span>;
};

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features', internal: false },
    { name: 'How It Works', href: '#how-it-works', internal: false },
    { name: 'About', href: '#about', internal: false },
    { name: 'Pricing', href: '/pricing', internal: true },
  ];

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-white font-sans selection:bg-indigo-500/30">
      {/* SECTION 1 - NAVBAR */}
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-[#0A0F1E]/80 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-indigo-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
              <Wallet size={24} className="text-white" />
            </div>
            <span className="text-xl font-black tracking-tight tracking-tighter">WealthWatch</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.internal ? (
                <Link 
                  key={link.name} 
                  to={link.href} 
                  className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ) : (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  {link.name}
                </a>
              )
            ))}
          </div>

          {/* Desktop Right Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <Link 
                to="/dashboard" 
                className="px-5 py-2.5 text-sm font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-5 py-2.5 text-sm font-bold text-white border border-gray-700 rounded-xl hover:bg-white/5 transition-all"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="px-5 py-2.5 text-sm font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#0A0F1E] border-b border-white/5 overflow-hidden"
            >
              <div className="px-6 py-8 flex flex-col gap-6">
                {navLinks.map((link) => (
                  link.internal ? (
                    <Link 
                      key={link.name} 
                      to={link.href} 
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-lg font-medium text-gray-400"
                    >
                      {link.name}
                    </Link>
                  ) : (
                    <a 
                      key={link.name} 
                      href={link.href} 
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-lg font-medium text-gray-400"
                    >
                      {link.name}
                    </a>
                  )
                ))}
                <div className="flex flex-col gap-4 pt-4 border-t border-white/5">
                  <Link to="/login" className="text-center py-3 font-bold border border-gray-700 rounded-xl">Login</Link>
                  <Link to="/signup" className="text-center py-3 font-bold bg-indigo-600 rounded-xl">Get Started</Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* SECTION 2 - HERO */}
      <section className="relative pt-44 pb-32 px-6 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-indigo-600/15 blur-[120px] rounded-full -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-500/10 blur-[100px] rounded-full -z-10"></div>
        
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tight">
                Track Your Wealth, <br />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                  Achieve Financial Freedom
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                WealthWatch gives you a complete picture of your net worth, spending habits, 
                and financial goals — all in one place.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link 
                  to={isAuthenticated ? "/dashboard" : "/signup"} 
                  className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 group"
                >
                  {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <button 
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl font-bold text-lg transition-all"
                >
                  See How It Works
                </button>
              </div>
            </motion.div>
          </div>

          <div className="flex-1 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative z-10"
            >
              {/* Mock Dashboard UI */}
              <div className="bg-[#111827] border border-white/10 rounded-[2rem] p-6 shadow-2xl overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Dashboard Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Total Net Worth</p>
                    <h3 className="text-3xl font-black text-white">₹85,42,120</h3>
                  </div>
                  <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold">
                    <TrendingUp size={14} />
                    +12.4%
                  </div>
                </div>

                {/* Dashboard Content Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-2">Assets</p>
                    <p className="text-xl font-bold">₹92.4L</p>
                    <div className="mt-2 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[80%]"></div>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-2">Liabilities</p>
                    <p className="text-xl font-bold">₹6.9L</p>
                    <div className="mt-2 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="bg-rose-500 h-full w-[20%]"></div>
                    </div>
                  </div>
                  <div className="col-span-2 bg-white/5 rounded-2xl p-4 border border-white/5">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-[10px] text-gray-500 font-bold uppercase">Monthly Growth</p>
                      <div className="flex gap-1">
                        {[40, 60, 45, 80, 55, 90].map((h, i) => (
                          <div key={i} className="w-4 bg-indigo-500/20 rounded-t" style={{ height: `${h}%` }}>
                            <div className="w-full bg-indigo-500 rounded-t absolute bottom-0" style={{ height: '40%' }}></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Insight Popup Mock */}
                <div className="absolute bottom-4 right-4 bg-indigo-600 rounded-2xl p-4 shadow-xl border border-white/10 max-w-[200px] transform translate-y-4 group-hover:translate-y-0 transition-transform">
                  <div className="flex items-center gap-2 mb-2">
                    <Cpu size={14} className="text-indigo-200" />
                    <span className="text-[10px] font-bold uppercase text-indigo-100">AI Insight</span>
                  </div>
                  <p className="text-xs text-white/90 leading-snug">
                    You can save ₹4,500 by optimizing your recurring subscriptions.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 3 - STATS BAR */}
      <section className="py-20 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div>
              <p className="text-4xl md:text-5xl font-black text-indigo-500 mb-2">
                <CountUp end="10" />Cr+
              </p>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Wealth Tracked</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-black text-white mb-2">
                <CountUp end="50" />K+
              </p>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Active Users</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-black text-indigo-500 mb-2">
                <CountUp end="99.9" />%
              </p>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Uptime</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-black text-white mb-2">
                4.8★
              </p>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">User Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 - FEATURES */}
      <section id="features" className="py-32 px-6 bg-[#0A0F1E]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black mb-6"
            >
              Everything you need to <br /> manage your money
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart3 className="text-indigo-400" />,
                title: "Smart Dashboard",
                desc: "See your complete net worth, assets and liabilities in one beautiful view."
              },
              {
                icon: <Cpu className="text-purple-400" />,
                title: "AI Financial Advisor",
                desc: "Get personalized tips powered by Groq AI and Llama 3.3 based on your actual spending."
              },
              {
                icon: <Target className="text-emerald-400" />,
                title: "Goal Tracking",
                desc: "Set financial goals and watch your progress with visual progress bars and timelines."
              },
              {
                icon: <MessageSquare className="text-blue-400" />,
                title: "Watson AI Chatbot",
                desc: "Ask anything about your finances — powered by IBM Watson Assistant."
              },
              {
                icon: <TrendingUp className="text-amber-400" />,
                title: "Investment Tracking",
                desc: "Track stocks, FDs, crypto and real estate all in one place."
              },
              {
                icon: <FileText className="text-rose-400" />,
                title: "Monthly Reports",
                desc: "Auto-generated PDF reports with AI written summary of your financial health."
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-[#111827] border border-white/5 rounded-[2rem] p-8 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 - HOW IT WORKS */}
      <section id="how-it-works" className="py-32 px-6 overflow-hidden relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-32">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black mb-6"
            >
              Get started in 3 steps
            </motion.h2>
          </div>

          <div className="relative">
            {/* Dotted Line */}
            <div className="hidden lg:block absolute top-1/2 left-32 right-32 h-0.5 border-t-2 border-dashed border-white/10 -z-10"></div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-32">
              {[
                {
                  step: "01",
                  icon: <User className="text-indigo-400" />,
                  title: "Create your account",
                  desc: "Sign up free in 30 seconds. No credit card required."
                },
                {
                  step: "02",
                  icon: <Plus className="text-emerald-400" />,
                  title: "Add your finances",
                  desc: "Add your assets, liabilities and transactions manually or via CSV import."
                },
                {
                  step: "03",
                  icon: <Rocket className="text-amber-400" />,
                  title: "Get insights",
                  desc: "AI analyzes your data and gives personalized tips to grow your wealth faster."
                }
              ].map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 }}
                  className="text-center group"
                >
                  <div className="relative inline-block mb-8">
                    <div className="h-24 w-24 rounded-[2rem] bg-[#111827] border border-white/10 flex items-center justify-center group-hover:border-indigo-500 transition-colors shadow-2xl">
                      {step.icon}
                    </div>
                    <div className="absolute -top-3 -right-3 h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-sm">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed max-w-[250px] mx-auto">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 - TESTIMONIALS */}
      <section className="py-32 px-6 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black mb-6"
            >
              Loved by thousands
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "WealthWatch helped me realize I was overspending on food by ₹8,000 every month!",
                author: "Rahul S.",
                role: "Software Engineer",
                initials: "RS"
              },
              {
                quote: "The AI advisor suggested I start a SIP — best decision ever. Already up 23% this year.",
                author: "Priya M.",
                role: "Marketing Manager",
                initials: "PM"
              },
              {
                quote: "Finally I can see all my loans and investments in one place. Game changer!",
                author: "Arjun K.",
                role: "Freelancer",
                initials: "AK"
              }
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-[#111827] border border-white/5 rounded-[2rem] p-8 relative"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-lg italic text-gray-300 mb-8 leading-relaxed">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white">
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-bold">{t.author}</p>
                    <p className="text-xs text-gray-500 font-medium">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7 - CTA BANNER */}
      <section className="py-32 px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto bg-gradient-to-br from-indigo-700 to-indigo-900 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-indigo-600/20"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
              Ready to take control <br /> of your finances?
            </h2>
            <p className="text-lg md:text-xl text-indigo-100/80 mb-12 max-w-2xl mx-auto">
              Join thousands of Indians who track their wealth with WealthWatch. 
              The future of personal finance is here.
            </p>
            <div className="flex flex-col items-center gap-6">
              <Link 
                to="/signup" 
                className="px-12 py-5 bg-white text-indigo-700 rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-2xl shadow-black/20"
              >
                Start for Free →
              </Link>
              <p className="text-sm font-bold text-indigo-200/60 uppercase tracking-widest flex items-center gap-4">
                <span>No credit card</span>
                <span className="h-1 w-1 bg-white/20 rounded-full"></span>
                <span>Free forever</span>
                <span className="h-1 w-1 bg-white/20 rounded-full"></span>
                <span>Setup in 2 mins</span>
              </p>
            </div>
          </div>

          {/* Decorative Orbs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/20 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2"></div>
        </motion.div>
      </section>

      {/* SECTION 8 - FOOTER */}
      <footer className="pt-32 pb-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
            <div className="md:col-span-5">
              <Link to="/" className="flex items-center gap-2 mb-6">
                <div className="bg-indigo-600 p-2 rounded-lg">
                  <Wallet size={20} className="text-white" />
                </div>
                <span className="text-xl font-black tracking-tight">WealthWatch</span>
              </Link>
              <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
                Your personal financial dashboard. Tracking net worth, goal planning, and AI insights 
                for the modern Indian investor.
              </p>
              <div className="flex gap-4">
                <a href="#" className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                  <Twitter size={20} />
                </a>
                <a href="#" className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                  <Linkedin size={20} />
                </a>
                <a href="#" className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                  <Github size={20} />
                </a>
                <a href="#" className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                  <Instagram size={20} />
                </a>
              </div>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-bold mb-8 uppercase tracking-widest text-xs text-gray-400">Product</h4>
              <ul className="space-y-4 text-sm text-gray-500 font-medium">
                <li><a href="#features" className="hover:text-indigo-400 transition-colors">Features</a></li>
                <li><a href="/dashboard" className="hover:text-indigo-400 transition-colors">Dashboard</a></li>
                <li><a href="/ai-advisor" className="hover:text-indigo-400 transition-colors">AI Advisor</a></li>
                <li><a href="/reports" className="hover:text-indigo-400 transition-colors">Reports</a></li>
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-bold mb-8 uppercase tracking-widest text-xs text-gray-400">Company</h4>
              <ul className="space-y-4 text-sm text-gray-500 font-medium">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Contact</a></li>
              </ul>
            </div>

            <div className="md:col-span-3">
              <h4 className="font-bold mb-8 uppercase tracking-widest text-xs text-gray-400">Legal</h4>
              <ul className="space-y-4 text-sm text-gray-500 font-medium">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Security Rules</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs text-gray-600 font-bold uppercase tracking-widest">
              © 2026 WealthWatch. Built with ❤️ in India 🇮🇳
            </p>
            <div className="flex items-center gap-6 text-[10px] font-black tracking-widest text-gray-600">
              <span className="flex items-center gap-2">
                <Globe size={12} />
                POWERED BY IBM CLOUD & AWS
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
