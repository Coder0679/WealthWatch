import React, { useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  PieChart, 
  Target, 
  FileText, 
  Settings, 
  LogOut, 
  User,
  Bell,
  CreditCard,
  Sparkles
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const profileName = useMemo(() => user?.name || 'Investor', [user?.name]);
  const profileRisk = useMemo(() => user?.riskProfile || 'Standard', [user?.riskProfile]);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Transactions', path: '/transactions', icon: <ArrowLeftRight size={20} /> },
    { name: 'Assets', path: '/assets', icon: <PieChart size={20} /> },
    { name: 'Liabilities', path: '/liabilities', icon: <CreditCard size={20} /> },
    { name: 'AI Advisor', path: '/ai-advisor', icon: <Sparkles size={20} /> },
    { name: 'Goals', path: '/goals', icon: <Target size={20} /> },
    { name: 'Reports', path: '/reports', icon: <FileText size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#0A0F1E] text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#1F2937] bg-[#111827] hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="font-bold text-xl">W</span>
            </div>
            <span className="font-bold text-xl tracking-tight">WealthWatch</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                    : 'text-[#94A3B8] hover:bg-[#1F2937] hover:text-white'
                }`
              }
            >
              <span className="transition-transform duration-200 group-hover:scale-110">
                {item.icon}
              </span>
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-[#1F2937]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-[#94A3B8] hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-20 border-b border-[#1F2937] bg-[#111827]/50 backdrop-blur-md sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between">
          <div className="lg:hidden flex items-center gap-3">
             <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="font-bold text-lg">W</span>
            </div>
          </div>
          
          <div className="hidden lg:block">
             <h2 className="text-sm font-medium text-[#94A3B8]">Welcome back,</h2>
             <p className="text-lg font-bold">{user?.name || 'Investor'}</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              className="p-2 text-[#94A3B8] hover:text-white hover:bg-[#1F2937] rounded-lg transition-colors relative"
              aria-label="Notifications"
              type="button"
            >
              <Bell size={22} />
              <span className="absolute top-2 right-2 h-2 w-2 bg-indigo-500 rounded-full border-2 border-[#111827]"></span>
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-[#1F2937] relative">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">{profileName}</p>
                <p className="text-xs text-[#94A3B8] capitalize">{profileRisk} Profile</p>
              </div>

              <button
                type="button"
                onClick={() => setProfileOpen((v) => !v)}
                className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center border-2 border-[#1F2937] hover:opacity-95 transition-opacity"
                aria-label="Open profile menu"
              >
                <User size={20} className="text-white" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 w-64 bg-[#111827] border border-[#1F2937] rounded-2xl shadow-2xl shadow-black/30 overflow-hidden z-50">
                  <div className="p-4 border-b border-[#1F2937]">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center">
                        <User size={18} className="text-indigo-300" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{profileName}</p>
                        <p className="text-xs text-[#94A3B8] capitalize">{profileRisk} Profile</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        navigate('/settings');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-sm font-bold text-[#94A3B8] hover:text-white hover:bg-[#1F2937] transition-colors"
                    >
                      Settings
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        handleLogout();
                      }}
                      className="mt-1 w-full text-left px-3 py-2 rounded-xl text-sm font-bold text-rose-300 hover:text-white hover:bg-rose-500/10 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-[#0A0F1E] custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
