import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { useTheme } from '../context/ThemeContext';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#14213d] dark:bg-slate-900 border border-[#fca311]/20 dark:border-white/20 p-3 rounded shadow-xl text-xs max-w-xs z-50">
        <p className="text-[#fca311] dark:text-cyan-400 font-bold mb-1">Narrative {data.narrativeId}</p>
        <p className="text-[#ffffff] dark:text-white mb-2 line-clamp-2">{data.title}</p>
        <div className="flex justify-between items-center border-t border-[#fca311]/10 dark:border-white/10 pt-2">
            <span className="text-[#ffffff]/60 dark:text-slate-400">Impact Score:</span>
            <span className="text-[#fca311] dark:text-emerald-400 font-mono font-bold">{data.impact}</span>
        </div>
      </div>
    );
  }
  return null;
};

// eslint-disable-next-line react/prop-types
const NarrativeMap = ({ data }) => {
  const { theme } = useTheme();

  // 1. Process data for Bar Chart
  // We need to group by cluster to get the size (impact). 
  // Since 'data' passed here is likely the Scatter points (individual articles), 
  // we might want to use the Cluster Data instead if available, or aggregate here.
  // However, looking at App.jsx, <NarrativeMap data={scatterData} /> is used.
  // And scatterData is effectively just points. 
  // BUT, we know the size from the cluster itself.
  // Actually, for a pure impact graph, we should probably pass the 'clusters' prop to this component 
  // instead of 'scatterData', OR we can aggregate the scatterData by cluster ID.
  // Given we want to show "Narrative Impact", displaying the Clusters directly is better.
  // Let's rely on the fact that if we change the prop in App.jsx, we can use clusters.
  // WAITING: I should probably update App.jsx to pass 'clusters' to NarrativeMap as well or instead.
  // For now, I will modify this component to expect 'clusters' or aggregate the 'data' if it has cluster info.
  // Let's look at `loader.js` -> getVectorData return `scatterData`. `silver_scatter.json` likely has `cluster` field.
  
  // Aggregate data by cluster
  const clusterMap = new Map();
  // eslint-disable-next-line react/prop-types
  data.forEach(item => {
      if (item.cluster === -1) return; // Skip noise
      if (!clusterMap.has(item.cluster)) {
          clusterMap.set(item.cluster, { 
              cluster: item.cluster, 
              impact: 0, 
              title: item.title // Use first title as label
          });
      }
      clusterMap.get(item.cluster).impact += 1;
  });

  const chartData = Array.from(clusterMap.values())
      .map(c => ({
          ...c,
          narrativeId: c.cluster + 1, // 1-based index for display
          fullTitle: c.title
      }))
      .sort((a, b) => b.impact - a.impact); // Sort by impact desc

  // Color logic - Updated for Midnight Aurora
  const getBarColor = (impact) => {
      if (impact >= 15) return theme === 'dark' ? '#ff0055' : '#fca311'; // High
      if (impact >= 5) return theme === 'dark' ? '#bf00ff' : '#ffffff';  // Medium
      return theme === 'dark' ? '#00F0FF' : '#fca311';                   // Low
  };

  return (
    <div className="h-[500px] w-150px rounded-2xl border border-[#fca311]/10 dark:border-white/5 bg-white dark:bg-[#1e293b] p-6 relative overflow-hidden flex flex-col shadow-sm dark:shadow-inner ml-12">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-[#ffffff] dark:text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#fca311] dark:bg-cyan-400 shadow-[0_0_10px_#fca311] dark:shadow-[0_0_10px_var(--color-neon-blue)] animate-pulse"></span>
          Narrative Impact Graph
        </h2>
        <p className="text-xs text-[#ffffff]/60 dark:text-slate-500 uppercase tracking-wider">Impact Score based on news volume and signal strength</p>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={theme === 'dark' ? "#ffffff10" : "#ffffff10"} />
            <XAxis type="number" stroke={theme === 'dark' ? "#94a3b8" : "#ffffff60"} fontSize={10} tickLine={false} axisLine={false} />
            <YAxis 
                dataKey="narrativeId" 
                type="category" 
                stroke={theme === 'dark' ? "#94a3b8" : "#ffffff60"} 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                width={30}
                tickFormatter={(value) => `#${value}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{fill: theme === 'dark' ? '#ffffff05' : '#ffffff05'}} />
            <Bar dataKey="impact" radius={[0, 4, 4, 0]} barSize={20}>
                {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.impact)} />
                ))}
            </Bar>
            </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-[#fca311]/10 dark:border-white/5">
        <div className="flex items-center gap-2 text-xs text-[#ffffff]/60 dark:text-slate-400">
            <span className={`w-3 h-3 rounded-sm ${theme === 'dark' ? 'bg-red-500' : 'bg-[#fca311]'}`}></span>
            <span>High Impact ({'>'}15)</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#ffffff]/60 dark:text-slate-400">
            <span className={`w-3 h-3 rounded-sm ${theme === 'dark' ? 'bg-amber-500' : 'bg-[#ffffff]'}`}></span>
            <span>Medium Impact (5-15)</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#ffffff]/60 dark:text-slate-400">
            <span className={`w-3 h-3 rounded-sm ${theme === 'dark' ? 'bg-blue-500' : 'bg-[#fca311] opacity-50'}`}></span>
            <span>Low Impact ({'<'}5)</span>
        </div>
      </div>
    </div>
  );
};

export default NarrativeMap;
