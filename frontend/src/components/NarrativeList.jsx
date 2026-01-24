import React, { useState } from 'react';
import { ChevronRight, ChevronDown, BookOpen } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// eslint-disable-next-line react/prop-types
const NarrativeList = ({ clusters }) => {
  const { theme } = useTheme();
  const [expandedId, setExpandedId] = useState(null);

  // Sort by size desc, put noise last
  // eslint-disable-next-line react/prop-types
  const sorted = [...clusters].sort((a, b) => {
    if (a.cluster_id === -1) return 1;
    if (b.cluster_id === -1) return -1;
    return b.size - a.size;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sorted.map((cluster, index) => {
        const isExpanded = expandedId === cluster.cluster_id;
        
        return (
          <div 
            key={cluster.cluster_id} 
            onClick={() => setExpandedId(isExpanded ? null : cluster.cluster_id)}
            className="p-5 rounded-2xl border border-[#e5e5e5]/20 text-[#ffffff] dark:border-white/10 bg-[#14213d] dark:bg-white/[0.02] backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg dark:hover:shadow-[0_0_30px_-10px_rgba(191,0,255,0.3)] hover:bg-[#14213d] dark:hover:bg-white/[0.05] cursor-pointer group h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 fill-mode-backwards"
            style={{ 
              animationDelay: `${index * 50}ms`,
              backgroundColor: theme === 'dark' ? undefined : '#14213d'
            }}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className={`text-xs px-2 py-0.5 rounded font-bold tracking-wider ${
                    cluster.cluster_id === -1 ? 'bg-[#e5e5e5]/10 dark:bg-slate-800 text-[#ffffff]/50 dark:text-slate-500' : 'bg-[#fca311]/10 dark:bg-gradient-to-r dark:from-purple-500/20 dark:to-cyan-500/20 text-[#fca311] dark:text-cyan-300 border border-[#fca311]/20 dark:border-cyan-500/20 shadow-sm dark:shadow-[0_0_10px_-5px_var(--color-neon-blue)]'
                }`}>
                  {cluster.cluster_id === -1 ? 'NOISE' : `NARRATIVE ${index + 1}`}
                </span>
                <h3 className="text-[#fca311] dark:text-white font-semibold mt-2 leading-tight">
                  {cluster.label}
                </h3>
              </div>
              <span className="text-xs text-[#ffffff]/50 dark:text-slate-500 font-mono shrink-0 ml-2">{cluster.size} items</span>
            </div>

            {/* Summary Section (Visible when expanded) */}
            {isExpanded && cluster.cluster_id !== -1 && (
              <div className="my-3 p-3 bg-[#fca311]/10 dark:bg-black/20 rounded-lg border-l-2 border-[#fca311] dark:border-purple-500 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex gap-2 items-start text-xs text-[#ffffff] dark:text-purple-200">
                  <BookOpen size={14} className="mt-0.5 shrink-0" />
                  <p className="leading-relaxed italic">
                    "{cluster.summary || "No summary available."}"
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-1 mt-auto pt-2">
              {/* eslint-disable-next-line react/prop-types */}
              {cluster.representative_titles.slice(0, isExpanded ? 5 : 2).map((title, i) => (
                <p key={i} className="text-xs text-[#ffffff]/70 dark:text-slate-400 border-l-2 border-[#ffffff]/10 dark:border-slate-700 pl-2">
                  {title}
                </p>
              ))}
            </div>
            
            <div className="mt-3 flex justify-end transition-opacity">
               {isExpanded ? <ChevronDown size={16} className="text-[#fca311] dark:text-cyan-400" /> : <ChevronRight size={16} className="text-[#fca311] dark:text-cyan-400 opacity-50 group-hover:opacity-100" />}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NarrativeList;
