import React, { useState } from 'react';
import { TrendingUp, Coins, Menu } from 'lucide-react';

const CURRENCIES = {
  USD: { code: 'USD', symbol: '$', rate: 1, name: 'United States Dollar' },
  INR: { code: 'INR', symbol: '₹', rate: 83.50, name: 'Indian Rupee' },
  GBP: { code: 'GBP', symbol: '£', rate: 0.79, name: 'British Pound' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92, name: 'Euro' },
  JPY: { code: 'JPY', symbol: '¥', rate: 148.00, name: 'Japanese Yen' },
  CAD: { code: 'CAD', symbol: 'C$', rate: 1.35, name: 'Canadian Dollar' },
  AUD: { code: 'AUD', symbol: 'A$', rate: 1.52, name: 'Australian Dollar' },
  CNY: { code: 'CNY', symbol: '¥', rate: 7.20, name: 'Chinese Yuan' },
};

const MarketSidebar = () => {
  const [currency, setCurrency] = useState('USD');
  const silverPrice = 32.45;
  const goldPrice = 2650.10;

  const formatPrice = (basePrice) => {
    const { rate, symbol } = CURRENCIES[currency];
    const value = basePrice * rate;
    return `${symbol}${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="bg-white dark:bg-[#14213d] rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-white/10 h-137 mt-8">
      <div className="space-y-6">
        {/* Currency Selector */}
        <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Currency</label>
            <div className="relative group">
                <select 
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-[#14213d] dark:text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-[#fca311] appearance-none cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors font-medium shadow-sm"
                >
                    {Object.keys(CURRENCIES).map((code) => (
                        <option key={code} value={code} className="bg-white dark:bg-[#14213d] text-[#14213d] dark:text-white">
                            {code} - {CURRENCIES[code].name}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#fca311]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m6 9 6 6 6-6"/>
                    </svg>
                </div>
            </div>
        </div>

        {/* Silver Price */}
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 transition-all hover:scale-[1.02] hover:shadow-md group">
            <div className="flex justify-between items-start mb-2">
                 <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-xs">Ag</div>
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Silver</span>
                 </div>
                 <span className="text-[10px] font-mono text-slate-400">XAG/{currency}</span>
            </div>
          <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-[#14213d] dark:text-white">{formatPrice(silverPrice)}</span>
              <span className="text-emerald-500 font-bold text-xs flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-full">
                <TrendingUp size={12} />
                +1.2%
              </span>
          </div>
        </div>

        {/* Gold Price */}
        <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 transition-all hover:scale-[1.02] hover:shadow-md group">
            <div className="flex justify-between items-start mb-2">
                 <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#fca311]/20 flex items-center justify-center text-[#fca311] font-bold text-xs">Au</div>
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Gold</span>
                 </div>
                 <span className="text-[10px] font-mono text-slate-400">XAU/{currency}</span>
            </div>
          <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-[#14213d] dark:text-white">{formatPrice(goldPrice)}</span>
              <span className="text-emerald-500 font-bold text-xs flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded-full">
                <TrendingUp size={12} />
                +0.8%
              </span>
          </div>
        </div>



      </div>
    </div>
  );
};

export default MarketSidebar;
