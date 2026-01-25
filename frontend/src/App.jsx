import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import StatsRow from './components/StatsRow';
import NarrativeMap from './components/NarrativeMap';
import NarrativeList from './components/NarrativeList';
import ModelMetrics from './components/ModelMetrics';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage'; // Import Landing Page
import { getClusterData, getVectorData, getStats } from './data/loader';

import { Share2, ScanLine, BrainCircuit } from 'lucide-react';

import MarketSidebar from './components/MarketSidebar';
import SentimentChart from './components/SentimentChart';

function Dashboard() {
  const [clusters, setClusters] = useState([]);
  const [scatterData, setScatterData] = useState([]);
  const [stats, setStats] = useState({ totalArticles: 0, totalNarratives: 0 });
  const [loadingStep, setLoadingStep] = useState(0);

  useEffect(() => {
    // Simulate async data load
    setClusters(getClusterData());
    setScatterData(getVectorData());
    setStats(getStats());
  }, []);

  useEffect(() => {
    // Loading Sequence
    if (loadingStep < 3) {
      const timer = setTimeout(() => {
        setLoadingStep(prev => prev + 1);
      }, 1500); // 1.5s per step
      return () => clearTimeout(timer);
    }
  }, [loadingStep]);

  // Loading Screen
  if (loadingStep < 3) {
    const steps = [
      { text: "AI IS SCANNING THE DATA...", icon: <ScanLine size={48} className="animate-pulse text-cyan-400" /> },
      { text: "CLUSTERING NARRATIVES...", icon: <Share2 size={48} className="animate-spin-slow text-purple-400" /> },
      { text: "ANALYZING NARRATIVE SENTIMENT...", icon: <BrainCircuit size={48} className="animate-bounce text-emerald-400" /> }
    ];

    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8 animate-in fade-in duration-500">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 blur-xl opacity-20 animate-pulse"></div>
          <div className="relative bg-white/5 dark:bg-black/20 p-8 rounded-full border border-white/10 shadow-2xl backdrop-blur-sm">
            {steps[loadingStep].icon}
          </div>
        </div>
        
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold font-mono tracking-wider text-[#14213d] dark:text-white">
            {steps[loadingStep].text}
          </h2>
          <div className="flex justify-center gap-1">
            <div className="w-2 h-2 bg-[#fca311] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-[#fca311] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-[#fca311] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <StatsRow stats={stats} />
        
        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
                <div className="flex items-center gap-4 mb-4">
                    <h2 className="font-bold text-lg text-[#fca311] dark:text-white">Detected Patterns</h2>
                    <span className="text-xs text-[#14213d]/60 dark:text-slate-400 font-mono animate-pulse">LIVE FEED</span>
                </div>
                <NarrativeList clusters={clusters} />
            </div>

            {/* Right Column - Market Sidebar (25% -> 1 col) */}
            <div className="lg:col-span-1">
                <div className="flex items-center gap-2 mb-4 h-7"> {/* h-7 enforces same height as left header text */}
                    <h2 className="font-bold text-lg text-[#fca311] dark:text-white">Market Data</h2>
                </div>
                <MarketSidebar />
            </div>
        </div>

        {/* Visualizations Grid - Full Width */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
                <NarrativeMap data={scatterData} />
            </div>
            <div className="md:col-span-1">
                <SentimentChart clusters={clusters} />
            </div>
        </div>
    </div>
  );
}

import AuthPage from './pages/AuthPage';

// Wrapper to handle layout based on route
function Layout() {
  const location = useLocation();
  const isLanding = location.pathname === '/';
  const isAuth = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="min-h-screen text-[#000000] dark:text-white selection:bg-[#fca311]/30 dark:selection:bg-cyan-500/30">
      {/* Hide Header on Auth Pages if desired, or keep it. Keeping it for navigation. */}
      {!isAuth && <Header />}
      
      <main className={isLanding ? "" : ""}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/metrics" element={
            <ProtectedRoute>
              <div className="bg-[#bde0fe] min-h-screen"><ModelMetrics /></div>
            </ProtectedRoute>
          } />
          <Route path="/login" element={<AuthPage initialMode="login" />} />
          <Route path="/signup" element={<AuthPage initialMode="signup" />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
