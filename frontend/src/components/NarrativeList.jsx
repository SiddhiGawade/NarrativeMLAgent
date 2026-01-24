import React, { useState } from 'react';
import { ChevronRight, ChevronDown, BookOpen } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// eslint-disable-next-line react/prop-types
const NarrativeList = ({ clusters }) => {
  const { theme } = useTheme();
  const [expandedId, setExpandedId] = useState(null);

  // Color palette for card bottom sections
  const cardColors = ['#43BEAA', '#F6AF2F', '#ED5E58', '#52C2D8'];

  // Sort by size desc, put noise last
  // eslint-disable-next-line react/prop-types
  const sorted = [...clusters].sort((a, b) => {
    if (a.cluster_id === -1) return 1;
    if (b.cluster_id === -1) return -1;
    return b.size - a.size;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
      {sorted.map((cluster, index) => {
        const isExpanded = expandedId === cluster.cluster_id;
        const isNoise = cluster.cluster_id === -1;
        const cardColor = isNoise ? '#e5e5e5' : cardColors[index % cardColors.length];
        
        return (
          <div 
            key={cluster.cluster_id} 
            onClick={() => setExpandedId(isExpanded ? null : cluster.cluster_id)}
            className="rounded-2xl overflow-hidden border-2 border-[#e5e5e5] dark:border-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl dark:hover:shadow-[0_0_30px_-10px_rgba(191,0,255,0.3)] cursor-pointer group flex flex-col animate-in fade-in slide-in-from-bottom-4 fill-mode-backwards shadow-lg"
            style={{ 
              animationDelay: `${index * 50}ms`,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
          >
            {/* Top Section - White Background with Heading */}
            <div className="bg-white dark:bg-white/[0.02] p-5 pb-4" style={{ backgroundColor: theme === 'dark' ? undefined : '#ffffff' }}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <span className={`text-xs px-2 py-0.5 rounded font-bold tracking-wider inline-block mb-2 ${
                    isNoise ? 'bg-[#e5e5e5] dark:bg-slate-800 text-[#14213d]/50 dark:text-slate-500' : 'bg-[#fca311]/10 dark:bg-gradient-to-r dark:from-purple-500/20 dark:to-cyan-500/20 text-[#fca311] dark:text-cyan-300 border border-[#fca311]/20 dark:border-cyan-500/20'
                  }`}>
                    {isNoise ? 'NOISE' : `NARRATIVE ${index + 1}`}
                  </span>
                  <h3 className="text-[#14213d] dark:text-white font-semibold leading-tight text-base" style={{ color: theme === 'dark' ? undefined : '#14213d' }}>
                    {cluster.label}
                  </h3>
                </div>
              </div>
            </div>

            {/* Bottom Section - Colored Background with Details */}
            <div 
              className="flex-1 p-5 pt-4 text-white flex flex-col"
              style={{
                backgroundColor: theme === 'dark' ? (isNoise ? undefined : undefined) : cardColor,
                background: theme === 'dark' ? undefined : (isNoise ? '#e5e5e5' : `linear-gradient(180deg, ${cardColor} 0%, ${cardColor}dd 100%)`)
              }}
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-mono text-white dark:text-white">
                  {cluster.size} items
                </span>
                <div className="transition-opacity">
                  {isExpanded ? <ChevronDown size={16} className={`${isNoise ? 'text-[#14213d]' : 'text-white'} dark:text-cyan-400`} /> : <ChevronRight size={16} className={`${isNoise ? 'text-[#14213d]' : 'text-white'} dark:text-cyan-400 opacity-50 group-hover:opacity-100`} />}
                </div>
              </div>

              {/* Summary Section (Visible when expanded) */}
              {isExpanded && !isNoise && (
                <div className="mb-3 p-3 bg-white/20 dark:bg-black/20 rounded-lg border-l-2 border-white/50 dark:border-purple-500 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex gap-2 items-start text-xs text-white dark:text-purple-200">
                    <BookOpen size={14} className="mt-0.5 shrink-0" />
                    <p className="leading-relaxed italic" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}>
                      "{cluster.summary || "No summary available."}"
                    </p>
                  </div>
                </div>
              )}

              {/* Title List */}
              <div className="space-y-1.5">
                {/* eslint-disable-next-line react/prop-types */}
                {cluster.representative_titles.slice(0, isExpanded ? 5 : 2).map((title, i) => (
                  <p 
                    key={i} 
                    className="text-xs text-white dark:text-white border-l-2 border-white/40 dark:border-white/40 pl-2"
                    style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' }}
                  >
                    {title}
                  </p>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NarrativeList;
