import React, { useState } from 'react';
import Layout from '../components/Layout';
import { 
  Settings, 
  Bell, 
  Shield, 
  Download, 
  Eye, 
  Save, 
  Info,
  LogOut,
  ChevronRight,
  ToggleLeft,
  Mail
} from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    transactionAlerts: true,
    monthlyReports: true,
    darkMode: true,
    twoFactorAuth: false,
    dataSharing: false,
  });

  const [saved, setSaved] = useState(false);

  const handleToggle = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Layout>
      <div className="p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
              <Settings size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Settings</h1>
              <p className="text-[#94A3B8]">Manage your preferences and account</p>
            </div>
          </div>

          {/* Save Notification */}
          {saved && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3 text-emerald-400">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="font-medium">Settings saved successfully</span>
            </div>
          )}

          {/* Notifications Section */}
          <div className="space-y-6">
            {/* Notification Preferences */}
            <div className="bg-[#111827] border border-[#1F2937] rounded-2xl overflow-hidden">
              <div className="p-6 bg-indigo-500/5 border-b border-[#1F2937] flex items-center gap-3">
                <Bell className="text-indigo-400" size={24} />
                <div>
                  <h2 className="text-lg font-bold text-white">Notifications</h2>
                  <p className="text-xs text-[#94A3B8]">Control how you receive updates</p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {/* Email Notifications */}
                <div className="flex items-center justify-between p-4 bg-[#0F172A] rounded-xl border border-[#1F2937]">
                  <div className="flex items-center gap-3">
                    <Mail className="text-blue-400" size={20} />
                    <div>
                      <p className="font-semibold text-white">Email Notifications</p>
                      <p className="text-xs text-[#94A3B8]">Receive updates via email</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle('emailNotifications')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      settings.emailNotifications
                        ? 'bg-indigo-600 text-white'
                        : 'bg-[#1F2937] text-[#94A3B8]'
                    }`}
                  >
                    {settings.emailNotifications ? 'On' : 'Off'}
                  </button>
                </div>

                {/* Push Notifications */}
                <div className="flex items-center justify-between p-4 bg-[#0F172A] rounded-xl border border-[#1F2937]">
                  <div className="flex items-center gap-3">
                    <Bell className="text-purple-400" size={20} />
                    <div>
                      <p className="font-semibold text-white">Push Notifications</p>
                      <p className="text-xs text-[#94A3B8]">Browser & app notifications</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle('pushNotifications')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      settings.pushNotifications
                        ? 'bg-indigo-600 text-white'
                        : 'bg-[#1F2937] text-[#94A3B8]'
                    }`}
                  >
                    {settings.pushNotifications ? 'On' : 'Off'}
                  </button>
                </div>

                {/* Transaction Alerts */}
                <div className="flex items-center justify-between p-4 bg-[#0F172A] rounded-xl border border-[#1F2937]">
                  <div className="flex items-center gap-3">
                    <Bell className="text-orange-400" size={20} />
                    <div>
                      <p className="font-semibold text-white">Transaction Alerts</p>
                      <p className="text-xs text-[#94A3B8]">Get notified of large transactions</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle('transactionAlerts')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      settings.transactionAlerts
                        ? 'bg-indigo-600 text-white'
                        : 'bg-[#1F2937] text-[#94A3B8]'
                    }`}
                  >
                    {settings.transactionAlerts ? 'On' : 'Off'}
                  </button>
                </div>

                {/* Monthly Reports */}
                <div className="flex items-center justify-between p-4 bg-[#0F172A] rounded-xl border border-[#1F2937]">
                  <div className="flex items-center gap-3">
                    <Bell className="text-emerald-400" size={20} />
                    <div>
                      <p className="font-semibold text-white">Monthly Reports</p>
                      <p className="text-xs text-[#94A3B8]">Receive monthly financial audit</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle('monthlyReports')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      settings.monthlyReports
                        ? 'bg-indigo-600 text-white'
                        : 'bg-[#1F2937] text-[#94A3B8]'
                    }`}
                  >
                    {settings.monthlyReports ? 'On' : 'Off'}
                  </button>
                </div>
              </div>
            </div>

            {/* Privacy & Security */}
            <div className="bg-[#111827] border border-[#1F2937] rounded-2xl overflow-hidden">
              <div className="p-6 bg-rose-500/5 border-b border-[#1F2937] flex items-center gap-3">
                <Shield className="text-rose-400" size={24} />
                <div>
                  <h2 className="text-lg font-bold text-white">Privacy & Security</h2>
                  <p className="text-xs text-[#94A3B8]">Control your data and access</p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {/* Two Factor Auth */}
                <div className="flex items-center justify-between p-4 bg-[#0F172A] rounded-xl border border-[#1F2937]">
                  <div className="flex items-center gap-3">
                    <Shield className="text-yellow-400" size={20} />
                    <div>
                      <p className="font-semibold text-white">Two-Factor Authentication</p>
                      <p className="text-xs text-[#94A3B8]">Extra layer of security</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle('twoFactorAuth')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      settings.twoFactorAuth
                        ? 'bg-indigo-600 text-white'
                        : 'bg-[#1F2937] text-[#94A3B8]'
                    }`}
                  >
                    {settings.twoFactorAuth ? 'Enabled' : 'Disabled'}
                  </button>
                </div>

                {/* Data Sharing */}
                <div className="flex items-center justify-between p-4 bg-[#0F172A] rounded-xl border border-[#1F2937]">
                  <div className="flex items-center gap-3">
                    <Eye className="text-cyan-400" size={20} />
                    <div>
                      <p className="font-semibold text-white">Data Sharing</p>
                      <p className="text-xs text-[#94A3B8]">Allow insights to improve service</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggle('dataSharing')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      settings.dataSharing
                        ? 'bg-indigo-600 text-white'
                        : 'bg-[#1F2937] text-[#94A3B8]'
                    }`}
                  >
                    {settings.dataSharing ? 'On' : 'Off'}
                  </button>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-[#111827] border border-[#1F2937] rounded-2xl overflow-hidden">
              <div className="p-6 bg-purple-500/5 border-b border-[#1F2937] flex items-center gap-3">
                <ToggleLeft className="text-purple-400" size={24} />
                <div>
                  <h2 className="text-lg font-bold text-white">Preferences</h2>
                  <p className="text-xs text-[#94A3B8]">Customize your experience</p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#0F172A] rounded-xl border border-[#1F2937]">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded bg-indigo-600"></div>
                    <div>
                      <p className="font-semibold text-white">Dark Mode</p>
                      <p className="text-xs text-[#94A3B8]">Always enabled on WealthWatch</p>
                    </div>
                  </div>
                  <span className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold">On</span>
                </div>

                <div className="p-4 bg-[#0F172A] rounded-xl border border-[#1F2937]">
                  <div className="mb-3">
                    <p className="font-semibold text-white">Currency</p>
                    <p className="text-xs text-[#94A3B8]">Display format for amounts</p>
                  </div>
                  <select className="w-full px-3 py-2 bg-[#111827] border border-[#1F2937] rounded-lg text-white focus:outline-none focus:border-indigo-500">
                    <option>INR (₹) - Indian Rupee</option>
                    <option>USD ($) - US Dollar</option>
                    <option>EUR (€) - Euro</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Data & Export */}
            <div className="bg-[#111827] border border-[#1F2937] rounded-2xl overflow-hidden">
              <div className="p-6 bg-blue-500/5 border-b border-[#1F2937] flex items-center gap-3">
                <Download className="text-blue-400" size={24} />
                <div>
                  <h2 className="text-lg font-bold text-white">Data & Export</h2>
                  <p className="text-xs text-[#94A3B8]">Download your data</p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <button className="w-full flex items-center justify-between p-4 bg-[#0F172A] hover:bg-[#161F30] rounded-xl border border-[#1F2937] transition-colors group">
                  <div className="flex items-center gap-3">
                    <Download className="text-blue-400 group-hover:text-blue-300" size={20} />
                    <div className="text-left">
                      <p className="font-semibold text-white group-hover:text-blue-300">Export All Data</p>
                      <p className="text-xs text-[#94A3B8]">Download in CSV format</p>
                    </div>
                  </div>
                  <ChevronRight className="text-[#475569]" size={20} />
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-[#0F172A] hover:bg-[#161F30] rounded-xl border border-[#1F2937] transition-colors group">
                  <div className="flex items-center gap-3">
                    <Download className="text-purple-400 group-hover:text-purple-300" size={20} />
                    <div className="text-left">
                      <p className="font-semibold text-white group-hover:text-purple-300">Export Transactions</p>
                      <p className="text-xs text-[#94A3B8]">Download transaction history</p>
                    </div>
                  </div>
                  <ChevronRight className="text-[#475569]" size={20} />
                </button>
              </div>
            </div>

            {/* About */}
            <div className="bg-[#111827] border border-[#1F2937] rounded-2xl overflow-hidden">
              <div className="p-6 bg-cyan-500/5 border-b border-[#1F2937] flex items-center gap-3">
                <Info className="text-cyan-400" size={24} />
                <div>
                  <h2 className="text-lg font-bold text-white">About</h2>
                  <p className="text-xs text-[#94A3B8]">Application information</p>
                </div>
              </div>
              <div className="p-6 space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">App Version</span>
                  <span className="text-white font-semibold">v2.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Last Updated</span>
                  <span className="text-white font-semibold">May 14, 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Accounts Connected</span>
                  <span className="text-white font-semibold">1</span>
                </div>
                <div className="pt-4 border-t border-[#1F2937]">
                  <p className="text-xs text-[#94A3B8] text-center">© 2026 WealthWatch. All rights reserved.</p>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex gap-4">
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
              >
                <Save size={20} />
                Save Changes
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#1F2937] hover:bg-[#2D3748] text-white rounded-2xl font-bold transition-all active:scale-95">
                <LogOut size={20} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
