import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  Wallet, 
  Menu, 
  X, 
  Twitter, 
  Linkedin, 
  Github, 
  Instagram,
  Globe,
  ArrowRight
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function PricingPage() {
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
    { name: 'Features', href: '/#features' },
    { name: 'How It Works', href: '/#how-it-works' },
    { name: 'About', href: '/#about' },
    { name: 'Pricing', href: '/pricing' },
  ];

  const pricingTiers = [
    {
      name: "Free",
      description: "Perfect for getting started",
      price: "0",
      period: "/forever",
      features: [
        "100 transactions/month",
        "Basic analytics",
        "2 financial goals",
        "Standard support"
      ],
      buttonText: "Start Free",
      buttonLink: "/signup",
      highlighted: false
    },
    {
      name: "Pro",
      description: "For serious wealth builders",
      price: "19",
      period: "/per month",
      features: [
        "Unlimited transactions",
        "AI Advisor (Llama 3.3)",
        "Unlimited goals & budgets",
        "Advanced analytics",
        "CSV/PDF exports",
        "Priority support",
        "Multi-currency"
      ],
      buttonText: "Start Free Trial",
      buttonLink: "/signup",
      highlighted: true,
      badge: "Most Popular"
    },
    {
      name: "Team",
      description: "For families & small teams",
      price: "49",
      period: "/per month",
      features: [
        "Everything in Pro",
        "Up to 5 users",
        "Shared dashboards",
        "Family goal planning",
        "Dedicated support",
        "Custom integrations"
      ],
      buttonText: "Contact Sales",
      buttonLink: "#contact",
      highlighted: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-white font-sans selection:bg-indigo-500/30">
      {/* NAVBAR */}
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
            <span className="text-xl font-black tracking-tight">WealthWatch</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className={`text-sm font-medium transition-colors ${link.name === 'Pricing' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
              >
                {link.name}
              </a>
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
                  Get Started Free
                </Link>
              </>
            )}
          </div>

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
                  <a 
                    key={link.name} 
                    href={link.href} 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-medium text-gray-400"
                  >
                    {link.name}
                  </a>
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

      {/* PRICING SECTION */}
      <section className="pt-44 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-black mb-6"
            >
              Simple, transparent pricing
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-400"
            >
              No hidden fees. No commitment. Cancel anytime.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {pricingTiers.map((tier, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className={`flex flex-col bg-[#111827] border ${
                  tier.highlighted ? 'border-indigo-500 shadow-2xl shadow-indigo-500/10' : 'border-white/5'
                } rounded-[2rem] p-8 relative flex-1`}
              >
                {tier.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600/10 border border-indigo-500 text-indigo-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                    {tier.badge}
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-2xl font-black mb-1">{tier.name}</h3>
                  <p className="text-gray-400 text-sm font-medium">{tier.description}</p>
                </div>

                <div className="mb-8 flex items-baseline gap-1">
                  <span className="text-5xl font-black">${tier.price}</span>
                  <span className="text-gray-500 font-bold">{tier.period}</span>
                </div>

                <ul className="space-y-4 mb-10 flex-grow">
                  {tier.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3">
                      <div className="mt-1 h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                        <Check size={12} className="text-emerald-500" />
                      </div>
                      <span className="text-sm text-gray-300 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={tier.buttonLink}
                  className={`w-full py-4 rounded-2xl font-black text-center transition-all ${
                    tier.highlighted 
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/20' 
                      : 'bg-white/5 border border-white/10 hover:bg-white/10 text-white'
                  }`}
                >
                  {tier.buttonText}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
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
                <li><a href="/#features" className="hover:text-indigo-400 transition-colors">Features</a></li>
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
