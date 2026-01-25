import React from 'react';
import { Layers, Activity, Zap } from 'lucide-react';

// eslint-disable-next-line react/prop-types
const StatsRow = ({ stats }) => {
  // eslint-disable-next-line react/prop-types
  const { totalArticles, totalNarratives } = stats;

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="p-4 rounded-xl bg-[#14213d] dark:bg-white/5 border-2 border-blue-900 dark:border-blue-900 shadow-sm dark:shadow-none flex items-center gap-4">
        <div className="p-3 rounded-lg bg-[#fca311]/20 dark:bg-blue-500/10 text-[#fca311] dark:text-blue-400">
          <Layers size={20} />
        </div>
        <div>
          <p className="text-[#ffffff]/60 dark:text-slate-400 text-xs uppercase">Processed Signals</p>
          <p className="text-2xl font-bold text-[#ffffff] dark:text-white">{totalArticles}</p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-[#14213d] dark:bg-white/5 border-2 border-blue-900 dark:border-blue-900 shadow-sm dark:shadow-none flex items-center gap-4">
        <div className="p-3 rounded-lg bg-[#fca311]/20 dark:bg-purple-500/10 text-[#fca311] dark:text-purple-400">
          <Activity size={20} />
        </div>
        <div>
          <p className="text-[#ffffff]/60 dark:text-slate-400 text-xs uppercase">Active Narratives</p>
          <p className="text-2xl font-bold text-[#ffffff] dark:text-white">{totalNarratives}</p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-[#14213d] dark:bg-white/5 border-2 border-blue-900 dark:border-blue-900 shadow-sm dark:shadow-none flex items-center gap-4">
        <div className="p-3 rounded-lg bg-[#fca311]/20 dark:bg-orange-500/10 text-[#fca311] dark:text-orange-400">
          <Zap size={20} />
        </div>
        <div>
          <p className="text-[#ffffff]/60 dark:text-slate-400 text-xs uppercase">System Status</p>
          <p className="text-2xl font-bold text-[#fca311] dark:text-emerald-400">ONLINE</p>
        </div>
      </div>
    </div>
  );
};

export default StatsRow;
