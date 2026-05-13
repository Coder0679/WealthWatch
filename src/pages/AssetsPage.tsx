import React, { useEffect, useState } from 'react';
import { useFinancialStore } from '../store/financialStore';
import Layout from '../components/Layout';
import { 
  Plus, 
  Building2, 
  LineChart, 
  Bitcoin, 
  Home, 
  Clock, 
  Trash2,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import AddAssetModal from '../components/AddAssetModal';

const TYPE_ICONS: Record<string, React.ReactNode> = {
  bank: <Building2 />,
  stock: <LineChart />,
  crypto: <Bitcoin />,
  real_estate: <Home />,
  fd: <Clock />,
};

export default function AssetsPage() {
  const { assets, isLoading, fetchAssets, deleteAsset } = useFinancialStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalValue = assets.reduce((sum, a) => sum + a.currentValue, 0);
  const filteredAssets = activeTab === 'all' ? assets : assets.filter(a => a.type === activeTab);

  return (
    <Layout>
      <div className="p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <p className="text-[#94A3B8] font-bold uppercase tracking-widest text-xs mb-2">Total Combined Value</p>
              <h1 className="text-5xl font-black tracking-tight text-white">{formatCurrency(totalValue)}</h1>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <Plus size={20} />
              <span>Add Asset</span>
            </button>
          </div>

          {/* Type Filters */}
          <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar">
            {['all', 'bank', 'stock', 'crypto', 'real_estate', 'fd'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-xl text-sm font-bold border transition-all whitespace-nowrap capitalize ${
                  activeTab === tab 
                  ? 'bg-white text-[#0A0F1E] border-white shadow-xl translate-y-[-2px]' 
                  : 'bg-[#111827] text-[#94A3B8] border-[#1F2937] hover:border-white/20'
                }`}
              >
                {tab === 'all' ? 'All Assets' : tab.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Assets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssets.map((asset) => {
              const gain = asset.currentValue - asset.purchaseValue;
              const gainPercent = (gain / asset.purchaseValue) * 100;
              const isGain = gain >= 0;

              return (
                <div key={asset.id} className="bg-[#111827] border border-[#1F2937] p-6 rounded-3xl hover:border-indigo-500/30 transition-all group relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-600/10 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                  
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className="h-12 w-12 rounded-2xl bg-[#0A0F1E] border border-[#1F2937] flex items-center justify-center text-white p-2.5">
                      {TYPE_ICONS[asset.type] || <TrendingUp />}
                    </div>
                    <button 
                      onClick={() => {
                        if(confirm('Delete this asset?')) {
                          deleteAsset(asset.id);
                        }
                      }}
                      className="p-2 text-gray-600 hover:text-rose-400 transition-colors md:opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-white mb-1">{asset.name}</h3>
                    <p className="text-xs text-[#94A3B8] font-bold uppercase tracking-widest bg-[#0A0F1E] py-1 px-2.5 rounded-lg inline-block border border-[#1F2937]">
                      {asset.type.replace('_', ' ')}
                    </p>

                    <div className="mt-8 pt-6 border-t border-[#1F2937] grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-bold text-[#94A3B8] uppercase mb-1">Current Value</p>
                        <p className="text-lg font-black text-white">{formatCurrency(asset.currentValue)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-[#94A3B8] uppercase mb-1">Performance</p>
                        <div className={`flex items-center gap-1 text-sm font-black ${isGain ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isGain ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                          {isGain ? '+' : ''}{Math.abs(gainPercent).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredAssets.length === 0 && (
            <div className="py-20 text-center border-2 border-dashed border-[#1F2937] rounded-3xl">
              <p className="text-[#94A3B8] font-bold">No assets found</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="mt-4 text-emerald-400 font-bold hover:underline"
              >
                Add your first asset
              </button>
            </div>
          )}
        </div>
      </div>

      <AddAssetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Layout>
  );
}
