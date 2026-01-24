import React from 'react';
import { Eye, TrendingUp, Sun, Moon, Activity, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import snaLogo from '../assets/SNA_Logo.png';

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

const Header = () => {
  const [currency, setCurrency] = React.useState('USD');
  const { theme, toggleTheme } = useTheme();

  const formatPrice = (basePrice) => {
    const { rate, symbol } = CURRENCIES[currency];
    const value = basePrice * rate;
    return `${symbol}${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const silverPrice = 32.45;
  const goldPrice = 2650.10;

  return (
    <header className="flex items-center justify-between p-6 border-b border-[#fca311]/20 dark:border-white/5 bg-white/60 dark:bg-[#050510]/60 backdrop-blur-xl sticky top-0 z-50 shadow-sm dark:shadow-[0_4px_30px_rgba(0,0,0,0.1)] transition-colors duration-300">
      <div className="flex items-center gap-3 group">
        <Link to="/">
          <img src={snaLogo} alt="SNA Logo" className="h-[50px] w-auto object-contain hover:scale-105 transition-transform duration-300" />
        </Link>
      </div>

      <div className="flex items-center gap-6 text-sm font-mono">
        <Link to="/dashboard" className="p-2 rounded-lg hover:bg-[#ffffff]/10 dark:hover:bg-white/10 text-slate-500 dark:text-slate-300 transition-colors flex items-center gap-2 hover:text-[#fca311] dark:hover:text-cyan-400">
           <LayoutDashboard size={18} />
           <span className="hidden sm:inline">Dashboard</span>
        </Link>

        {/* Theme Toggle */}
        <Link to="/metrics" className="p-2 rounded-lg hover:bg-[#ffffff]/10 dark:hover:bg-white/10 text-slate-500 dark:text-slate-300 transition-colors flex items-center gap-2 hover:text-[#fca311] dark:hover:text-cyan-400">
           <Activity size={18} />
           <span className="hidden sm:inline">Model Accuracy</span>
        </Link>

        {/* Theme Toggle Button Removed */}


        {/* Currency Selector */}
        <div className="relative group">
            <select 
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-[#14213d] border border-[#fca311]/40 text-white text-xs rounded-md px-3 py-1.5 outline-none focus:border-[#fca311] appearance-none cursor-pointer hover:bg-[#1e293b] transition-colors pr-8 font-medium shadow-sm"
            >
                {Object.keys(CURRENCIES).map((code) => (
                    <option key={code} value={code} className="bg-[#14213d] text-white">
                        {code} ({CURRENCIES[code].symbol})
                    </option>
                ))}
            </select>
             <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#fca311]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m6 9 6 6 6-6"/>
                </svg>
            </div>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-slate-500 dark:text-slate-400 text-xs">XAG/{currency} (Silver)</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
            {formatPrice(silverPrice)} <TrendingUp size={12} />
          </span>
        </div>
        <div className="flex flex-col items-end border-l border-slate-200 dark:border-white/10 pl-6">
          <span className="text-slate-500 dark:text-slate-400 text-xs">XAU/{currency} (Gold)</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
            {formatPrice(goldPrice)} <TrendingUp size={12} />
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
