import React, { useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

// eslint-disable-next-line react/prop-types
const NarrativeList = ({ clusters }) => {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedNarrative, setSelectedNarrative] = useState(null);

  // Color palette for card bottom sections
  const cardColors = ['#43BEAA', '#F6AF2F', '#ED5E58', '#52C2D8'];

  // Sort by size desc, put noise last
  // eslint-disable-next-line react/prop-types
  const sorted = [...clusters].sort((a, b) => {
    if (a.cluster_id === -1) return 1;
    if (b.cluster_id === -1) return -1;
    return b.size - a.size;
  });

  const itemsPerPage = 2;
  const totalPages = Math.ceil(sorted.length / itemsPerPage);

  // Removed auto-rotation useEffect

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const currentItems = sorted.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );

  if (sorted.length === 0) {
    return (
        <div className="text-center py-10 text-gray-500">
            No narratives found.
        </div>
    )
  }

  return (
    <div className="relative px-4 md:px-12 py-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start min-h-[400px]">
        <AnimatePresence mode="wait">
            {currentItems.map((cluster, index) => {
                const globalIndex = currentIndex * itemsPerPage + index;
                const isNoise = cluster.cluster_id === -1;
                const cardColor = isNoise ? '#e5e5e5' : cardColors[globalIndex % cardColors.length];

                return (
                <motion.div
                    key={cluster.cluster_id} // Key must be unique for AnimatePresence
                    layoutId={`card-${cluster.cluster_id}`}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    onClick={() => !isNoise && setSelectedNarrative({ ...cluster, cardColor, globalIndex })}
                    className={`rounded-2xl overflow-hidden border-2 border-[#e5e5e5] dark:border-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl dark:hover:shadow-[0_0_30px_-10px_rgba(191,0,255,0.3)] group flex flex-col shadow-lg h-full ${!isNoise ? 'cursor-pointer' : ''}`}
                    style={{
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                >
                    {/* Top Section - White Background with Heading */}
                    <div className="bg-white dark:bg-white/[0.02] p-5 pb-4" style={{ backgroundColor: theme === 'dark' ? undefined : '#ffffff' }}>
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                        <div className="flex gap-2 mb-2">
                            <span className={`text-xs px-2 py-0.5 rounded font-bold tracking-wider inline-block ${
                                isNoise ? 'bg-[#e5e5e5] dark:bg-slate-800 text-[#14213d]/50 dark:text-slate-500' : 'bg-[#fca311]/10 dark:bg-gradient-to-r dark:from-purple-500/20 dark:to-cyan-500/20 text-[#fca311] dark:text-cyan-300 border border-[#fca311]/20 dark:border-cyan-500/20'
                            }`}>
                                {isNoise ? 'NOISE' : `NARRATIVE ${globalIndex + 1}`}
                            </span>
                            {!isNoise && (
                                <span className="ml-auto text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Maximize2 size={16} />
                                </span>
                            )}
                        </div>
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
                    </div>

                    {/* Summary Section */}
                    {!isNoise && (
                        <div className="mb-3 p-3 bg-white/20 dark:bg-black/20 rounded-lg border-l-2 border-white/50 dark:border-purple-500">
                        <div className="flex gap-2 items-start text-xs text-white dark:text-purple-200">
                            <BookOpen size={14} className="mt-0.5 shrink-0" />
                            <p className="leading-relaxed italic line-clamp-3" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}>
                            "{cluster.summary || "No summary available."}"
                            </p>
                        </div>
                        </div>
                    )}

                    {/* Title List */}
                    <div className="space-y-1.5 mb-4">
                        {/* eslint-disable-next-line react/prop-types */}
                        {cluster.representative_titles.slice(0, 3).map((title, i) => (
                        <p 
                            key={i} 
                            className="text-xs text-white dark:text-white border-l-2 border-white/40 dark:border-white/40 pl-2 truncate"
                            style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' }}
                        >
                            {title}
                        </p>
                        ))}
                         {cluster.representative_titles.length > 3 && (
                             <p className="text-[10px] text-white/80 italic pl-2">+ {cluster.representative_titles.length - 3} more...</p>
                         )}
                    </div>

                    {/* Sentiment Button */}
                    {!isNoise && cluster.sentiment && (
                        <div className="mt-auto pt-2">
                             <div className={`w-full py-2 px-4 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 ${
                                cluster.sentiment.label === 'Positive' 
                                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-900/20' 
                                : cluster.sentiment.label === 'Negative'
                                    ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-rose-900/20'
                                    : 'bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-slate-900/20'
                            }`}>
                                {cluster.sentiment.label === 'Positive' ? 'BULLISH' : cluster.sentiment.label === 'Negative' ? 'BEARISH' : 'NEUTRAL'}
                                <span className="opacity-80 text-xs">({(cluster.sentiment.score * 100).toFixed(0)}%)</span>
                            </div>
                        </div>
                    )}
                    </div>
                </motion.div>
                );
            })}
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
       {totalPages > 1 && (
        <>
            <button 
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-black/50 rounded-full shadow-lg hover:bg-white dark:hover:bg-black/70 transition-colors z-10"
                aria-label="Previous slide"
            >
                <ChevronLeft size={24} className="text-[#14213d] dark:text-white" />
            </button>
            <button 
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-black/50 rounded-full shadow-lg hover:bg-white dark:hover:bg-black/70 transition-colors z-10"
                aria-label="Next slide"
            >
                <ChevronRight size={24} className="text-[#14213d] dark:text-white" />
            </button>
        </>
       )}

       {/* Indicators */}
       {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                        idx === currentIndex 
                        ? 'w-6 bg-[#fca311]' 
                        : 'w-2 bg-gray-300 dark:bg-gray-700'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                />
            ))}
        </div>
       )}

       {/* MODAL VIEW */}
       <AnimatePresence>
        {selectedNarrative && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSelectedNarrative(null)}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div
                    layoutId={`card-${selectedNarrative.cluster_id}`}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white dark:bg-[#0f172a] rounded-3xl shadow-2xl z-50 flex flex-col"
                >
                     {/* Close Button */}
                    <button 
                        onClick={() => setSelectedNarrative(null)}
                        className="absolute top-4 right-4 p-2 bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 rounded-full transition-colors z-20"
                    >
                        <X size={20} className="text-[#14213d] dark:text-white" />
                    </button>

                    {/* Modal Header */}
                    <div className="p-8 pb-6 border-b border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                        <div className="flex gap-2 mb-4">
                             <span className="text-xs px-2 py-0.5 rounded font-bold tracking-wider inline-block bg-[#fca311]/10 dark:bg-gradient-to-r dark:from-purple-500/20 dark:to-cyan-500/20 text-[#fca311] dark:text-cyan-300 border border-[#fca311]/20 dark:border-cyan-500/20">
                                NARRATIVE {selectedNarrative.globalIndex + 1}
                            </span>
                             <span className="text-xs px-2 py-0.5 rounded font-bold tracking-wider inline-block bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400">
                                {selectedNarrative.size} ITEMS
                            </span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold text-[#14213d] dark:text-white leading-tight">
                            {selectedNarrative.label}
                        </h2>
                    </div>

                    {/* Modal Body */}
                    <div className="p-8 pt-6 space-y-8">
                        {/* Summary */}
                        <div className="prose dark:prose-invert max-w-none">
                             <div className="flex gap-3 items-start p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border-l-4 border-blue-400 dark:border-blue-400">
                                <BookOpen className="text-blue-500 shrink-0 mt-1" size={20} />
                                <div>
                                    <h4 className="font-bold text-blue-900 dark:text-blue-100 text-sm uppercase tracking-wider mb-1">Theme Summary</h4>
                                    <p className="text-blue-800 dark:text-blue-200 text-lg leading-relaxed italic">
                                        "{selectedNarrative.summary}"
                                    </p>
                                </div>
                            </div>
                        </div>

                         {/* Titles */}
                         <div>
                            <h4 className="font-bold text-[#14213d] dark:text-white text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                                <span className="w-1 h-4 bg-[#fca311] rounded-full"></span>
                                Representative Titles
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {selectedNarrative.representative_titles.map((title, i) => (
                                    <div key={i} className="p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/5 hover:border-[#fca311]/30 transition-colors">
                                        <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                            {title}
                                        </p>
                                    </div>
                                ))}
                            </div>
                         </div>

                        {/* Detailed Sentiment */}
                        {selectedNarrative.sentiment && (
                            <div>
                                <h4 className="font-bold text-[#14213d] dark:text-white text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <span className={`w-1 h-4 rounded-full ${
                                         selectedNarrative.sentiment.label === 'Positive' ? 'bg-emerald-500' : 
                                         selectedNarrative.sentiment.label === 'Negative' ? 'bg-rose-500' : 'bg-slate-500'
                                    }`}></span>
                                    Market Sentiment
                                </h4>
                                <div className={`p-6 rounded-2xl ${
                                     selectedNarrative.sentiment.label === 'Positive' 
                                     ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 border border-emerald-200 dark:border-emerald-500/30' 
                                     : selectedNarrative.sentiment.label === 'Negative'
                                         ? 'bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-800/20 border border-rose-200 dark:border-rose-500/30'
                                         : 'bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/30 dark:to-slate-700/30 border border-slate-200 dark:border-slate-500/30'
                                }`}>
                                   <div className="flex items-center gap-4 mb-2">
                                        <span className={`text-4xl font-black ${
                                             selectedNarrative.sentiment.label === 'Positive' ? 'text-emerald-600 dark:text-emerald-400' : 
                                             selectedNarrative.sentiment.label === 'Negative' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-slate-400'
                                        }`}>
                                            {(selectedNarrative.sentiment.score * 100).toFixed(0)}%
                                        </span>
                                        <div>
                                            <div className={`text-lg font-bold uppercase tracking-wide ${
                                                 selectedNarrative.sentiment.label === 'Positive' ? 'text-emerald-700 dark:text-emerald-300' : 
                                                 selectedNarrative.sentiment.label === 'Negative' ? 'text-rose-700 dark:text-rose-300' : 'text-slate-700 dark:text-slate-300'
                                            }`}>
                                                {selectedNarrative.sentiment.label === 'Positive' ? 'Bullish Outlook' : selectedNarrative.sentiment.label === 'Negative' ? 'Bearish Signal' : 'Neutral Stance'}
                                            </div>
                                            <p className="text-sm opacity-80 dark:text-gray-400">
                                                Based on aggregate analysis of {selectedNarrative.size} sources
                                            </p>
                                        </div>
                                   </div>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        )}
       </AnimatePresence>
    </div>
  );
};

export default NarrativeList;
