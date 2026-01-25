import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useTheme } from '../context/ThemeContext';
import { BrainCircuit } from 'lucide-react';

const COLORS = {
  Positive: '#10b981', // Emerald 500
  Negative: '#f43f5e', // Rose 500
  Neutral: '#64748b'   // Slate 500
};

const COLORS_DARK = {
  Positive: '#34d399', // Emerald 400
  Negative: '#fb7185', // Rose 400
  Neutral: '#94a3b8'   // Slate 400
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#14213d] dark:bg-slate-900 border border-[#fca311]/20 dark:border-white/20 p-3 rounded shadow-xl text-xs z-50">
        <p className="text-white font-bold mb-1">{data.name}</p>
        <div className="flex justify-between items-center gap-4">
            <span className="text-slate-400">Count:</span>
            <span className="text-[#fca311] dark:text-cyan-400 font-mono font-bold">{data.value}</span>
        </div>
        <div className="flex justify-between items-center gap-4">
            <span className="text-slate-400">Share:</span>
            <span className="text-[#fca311] dark:text-cyan-400 font-mono font-bold">{data.percent}%</span>
        </div>
      </div>
    );
  }
  return null;
};

// eslint-disable-next-line react/prop-types
const SentimentChart = ({ clusters }) => {
  const { theme } = useTheme();

  // Process data to count sentiments
  const stats = {
    Positive: 0,
    Negative: 0,
    Neutral: 0
  };

  // eslint-disable-next-line react/prop-types
  clusters.forEach(cluster => {
      if (cluster.cluster_id === -1) return; // Skip noise
      if (cluster.sentiment) {
          stats[cluster.sentiment.label]++;
      } else {
          stats['Neutral']++;
      }
  });

  const total = Object.values(stats).reduce((a, b) => a + b, 0);

  const data = Object.keys(stats).map(key => ({
    name: key,
    value: stats[key],
    percent: total > 0 ? ((stats[key] / total) * 100).toFixed(0) : 0
  })).filter(item => item.value > 0);

  // Default data if no clusters
  const displayData = data.length > 0 ? data : [{ name: 'No Data', value: 1, percent: 100 }];

  return (
    <div className="h-[500px] w-full rounded-2xl border border-[#fca311]/10 dark:border-white/5 bg-white dark:bg-[#1e395b] p-6 relative overflow-hidden flex flex-col shadow-sm dark:shadow-inner">
      <div className="mb-2">
        <h2 className="text-lg font-bold text-[#ffffff] dark:text-white flex items-center gap-2">
          <BrainCircuit size={20} className="text-[#fca311] dark:text-cyan-400" />
          Sentiment Distribution
        </h2>
        <p className="text-xs text-[#ffffff]/60 dark:text-slate-500 uppercase tracking-wider">Market Mood Analysis</p>
      </div>

      <div className="flex-1 w-full min-h-0 relative">
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={displayData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                >
                    {displayData.map((entry, index) => (
                        <Cell 
                            key={`cell-${index}`} 
                            fill={theme === 'dark' ? (COLORS_DARK[entry.name] || '#334155') : (COLORS[entry.name] || '#cbd5e1')} 
                        />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    iconType="circle"
                    formatter={(value) => <span className="text-white/80 dark:text-slate-300 text-xs">{value}</span>}
                />
            </PieChart>
        </ResponsiveContainer>
        
        {/* Center Text Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
            <span className="text-4xl font-bold text-white dark:text-white">{total}</span>
            <span className="text-xs text-slate-400 uppercase tracking-widest">Narratives</span>
        </div>
      </div>
    </div>
  );
};

export default SentimentChart;
