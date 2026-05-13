import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Zap, 
  BarChart3, 
  PieChart, 
  Target, 
  ArrowRight, 
  CheckCircle2, 
  ChevronRight,
  TrendingUp,
  Cpu,
  Globe,
  FileText
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0F1E] text-white overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#111827]/80 backdrop-blur-lg border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="font-bold text-xl">W</span>
            </div>
            <span className="font-bold text-xl tracking-tight">WealthWatch</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#94A3B8]">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
            <a href="#security" className="hover:text-white transition-colors">Security</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium hover:text-indigo-400 transition-colors">Log in</Link>
            <Link to="/signup" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/20">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full -z-10"></div>
        <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-purple-600/5 blur-[100px] rounded-full -z-10"></div>

        <div className="max-w-7xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6">
              <Zap size={14} className="fill-current" />
              Powered by IBM Watson & AWS
            </span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-[#94A3B8] bg-clip-text text-transparent">
              Command Your Wealth <br />
              With Precision Intelligence
            </h1>
            <p className="text-lg md:text-xl text-[#94A3B8] max-w-2xl mx-auto mb-10 leading-relaxed">
              WealthWatch is the next-generation financial command center. Real-time auditing, AI-powered insights, and institutional-grade security for your personal portfolio.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-indigo-500/25 flex items-center justify-center gap-2">
                Launch My Command Center
                <ArrowRight size={20} />
              </Link>
              <button className="w-full sm:w-auto px-8 py-4 bg-[#111827] border border-[#1F2937] hover:bg-[#1C2636] text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2">
                Watch Demo Audit
              </button>
            </div>
          </motion.div>

          {/* Feature Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-20 relative group"
          >
            <div className="absolute inset-0 bg-indigo-600/20 blur-[100px] rounded-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="bg-[#111827] border border-white/5 rounded-3xl p-4 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
               <img 
                src="https://images.unsplash.com/photo-1644088379091-d574269d422f?q=80&w=2600&auto=format&fit=crop" 
                alt="Dashboard Preview" 
                className="rounded-2xl opacity-60 grayscale hover:grayscale-0 transition-all duration-700" 
                referrerPolicy="no-referrer"
               />
               <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                  <div className="p-8 bg-[#0A0F1E]/80 border border-white/10 rounded-2xl backdrop-blur-xl">
                      <p className="flex items-center gap-2 text-indigo-400 font-bold mb-1">
                        <TrendingUp size={20} />
                        NET WORTH TRACKER
                      </p>
                      <h4 className="text-3xl font-black">₹42,50,000</h4>
                      <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded w-fit">
                        ↑ 12.4% vs last quarter
                      </div>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4 tracking-tight">The Financial Stack of Tomorrow</h2>
            <p className="text-[#94A3B8]">Powered by enterprise infrastructure for retail precision.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="solutions">
            {[
              { 
                icon: <BarChart3 className="text-indigo-400" />, 
                title: "Real-time Auditing", 
                desc: "Live synchronization across all your assets and liabilities with AWS DynamoDB.",
                tag: "DATA" 
              },
              { 
                icon: <Cpu className="text-purple-400" />, 
                title: "Watson Intelligence", 
                desc: "Natural language processing analyzes your spending and offers strategic tips.",
                tag: "AI" 
              },
              { 
                icon: <Shield className="text-emerald-400" />, 
                title: "Zero-Trust Security", 
                desc: "IBM App ID ensures biometric-grade authentication and data encryption.",
                tag: "PROTECTION" 
              },
              { 
                icon: <Target className="text-amber-400" />, 
                title: "Goal Engineering", 
                desc: "Don't just save—engineer your goals with progress modeling and forecasting.",
                tag: "VIBE" 
              },
              { 
                icon: <FileText className="text-blue-400" />, 
                title: "Verified Reports", 
                desc: "Generate monthly PDF audits stored securely on AWS S3 for record-keeping.",
                tag: "REPORTS" 
              },
              { 
                icon: <Globe className="text-rose-400" />, 
                title: "Global Reach", 
                desc: "Full support for INR and Indian financial instruments like FD, SIP, and ELSS.",
                tag: "LOCALE" 
              },
            ].map((feature, idx) => (
              <div key={idx} className="p-8 bg-[#111827] border border-[#1F2937] rounded-3xl hover:border-indigo-500/50 transition-all group">
                <div className="h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <div className="text-[10px] font-black tracking-widest text-white/40 mb-2 uppercase">{feature.tag}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-[#94A3B8] text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Logo Cloud */}
      <section className="py-20 bg-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-12 opacity-30 grayscale">
           <span className="font-black italic text-3xl">IBM CLOUD</span>
           <span className="font-black italic text-3xl">AMAZON WEB SERVICES</span>
           <span className="font-black italic text-3xl">GROQ AI</span>
           <span className="font-black italic text-3xl">FINANCE INDIA</span>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-32 px-6 bg-[#0F172A]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20">
          <div className="flex-1">
            <h2 className="text-4xl font-bold mb-6">Your data is yours. <br /> Encrypted and private.</h2>
            <div className="space-y-6">
              {[
                "SOC2 Type II Compliant Infrastructure",
                "End-to-end encryption with AWS KMS",
                "Advanced DDoS protection on IBM Cloud",
                "No third-party data selling. Ever."
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="font-medium text-[#94A3B8]">{text}</span>
                </div>
              ))}
            </div>
            <button className="mt-10 flex items-center gap-2 text-indigo-400 font-bold group">
              Security Protocol Documentation
              <ChevronRight size={20} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          <div className="flex-1 bg-[#111827] p-1 rounded-3xl border border-white/5 relative shadow-inner">
             <div className="absolute -top-10 -right-10 h-32 w-32 bg-indigo-600/20 blur-3xl rounded-full"></div>
             <div className="p-8 space-y-4">
                <div className="h-2 w-24 bg-white/10 rounded"></div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="h-20 bg-white/5 rounded-xl"></div>
                   <div className="h-20 bg-white/5 rounded-xl"></div>
                </div>
                <div className="h-32 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center">
                   <Shield size={48} className="text-indigo-400 animate-pulse" />
                </div>
                <div className="h-2 w-full bg-white/10 rounded"></div>
                <div className="h-2 w-full bg-white/10 rounded"></div>
             </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[40px] p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Stop Reacting. Start Leading.</h2>
            <p className="text-indigo-100 text-lg mb-10 max-w-xl mx-auto font-medium">
              Join 12,000+ investors who use WealthWatch to engineer their financial freedom.
            </p>
            <Link to="/signup" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-indigo-700 rounded-2xl font-black uppercase tracking-tighter hover:bg-opacity-90 transition-all shadow-xl">
              Get Strategic Access Now
              <ArrowRight size={24} />
            </Link>
          </div>
          
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-64 h-64 border-[40px] border-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 border-[60px] border-white rounded-full translate-x-1/3 translate-y-1/3"></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-[#1F2937]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center italic font-black">W</div>
              <span className="font-bold text-lg">WealthWatch</span>
            </div>
            <p className="text-[#94A3B8] text-sm max-w-xs leading-relaxed mb-8">
              Built at the intersection of AI and personal finance. Institutional tools for the individual investor.
            </p>
            <div className="flex gap-4">
              {/* Social icons could go here */}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-6">Platform</h4>
            <ul className="space-y-4 text-sm text-[#94A3B8]">
              <li><a href="#" className="hover:text-white transition-colors">Dashboard</a></li>
              <li><a href="#" className="hover:text-white transition-colors">AI Advisor</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Audit Reports</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-[#94A3B8]">
              <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 text-center text-xs text-[#475569]">
          © {new Date().getFullYear()} WealthWatch Unified Financial Systems. All rights reserved. Built with IBM & AWS.
        </div>
      </footer>
    </div>
  );
}
