import React from 'react';
import { Eye, TrendingUp, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

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
    <header className="flex items-center justify-between p-6 border-b border-[#fca311]/20 dark:border-white/5 bg-[#14213d]/95 dark:bg-white/[0.02] backdrop-blur-md sticky top-0 z-50 shadow-sm dark:shadow-[0_4px_30px_rgba(0,0,0,0.1)] transition-colors duration-300">
      <div className="flex items-center gap-3 group">
        <div className="p-2 rounded-lg bg-[#fca311]/10 dark:bg-cyan-500/10 border border-[#fca311]/20 dark:border-cyan-500/20 text-[#fca311] dark:text-cyan-400 shadow-[0_0_15px_-5px_#fca311] dark:shadow-[0_0_15px_-5px_var(--color-neon-blue)] group-hover:shadow-[0_0_20px_-2px_#fca311] dark:group-hover:shadow-[0_0_20px_-2px_var(--color-neon-blue)] transition-all duration-300">
          <Eye size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-widest text-[#ffffff] dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-white dark:via-cyan-200 dark:to-white">ECHELON</h1>
          <p className="text-[10px] text-[#fca311] dark:text-cyan-500/60 uppercase tracking-[0.2em] font-medium">Autonomous Pattern Hunter</p>
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm font-mono">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-[#ffffff]/10 dark:hover:bg-white/10 text-[#fca311] dark:text-slate-300 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Currency Selector */}
        <div className="relative group">
            <select 
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-[#14213d] dark:bg-white/5 border border-[#fca311]/20 dark:border-white/10 text-[#ffffff] dark:text-slate-300 text-xs rounded px-2 py-1 outline-none focus:border-[#fca311]/50 dark:focus:border-cyan-500/50 appearance-none cursor-pointer hover:bg-[#ffffff]/10 dark:hover:bg-white/10 transition-colors pr-6"
            >
                {Object.keys(CURRENCIES).map((code) => (
                    <option key={code} value={code} className="bg-[#14213d] dark:bg-slate-900 text-[#ffffff] dark:text-slate-300">
                        {code} ({CURRENCIES[code].symbol})
                    </option>
                ))}
            </select>
             <div className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-slate-500">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
