import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import StatsRow from './components/StatsRow';
import NarrativeMap from './components/NarrativeMap';
import NarrativeList from './components/NarrativeList';
import ModelMetrics from './components/ModelMetrics';
import LandingPage from './pages/LandingPage'; // Import Landing Page
import { getClusterData, getVectorData, getStats } from './data/loader';

function Dashboard() {
  const [clusters, setClusters] = useState([]);
  const [scatterData, setScatterData] = useState([]);
  const [stats, setStats] = useState({ totalArticles: 0, totalNarratives: 0 });

  useEffect(() => {
    // Simulate async data load
    setClusters(getClusterData());
    setScatterData(getVectorData());
    setStats(getStats());
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
        <StatsRow stats={stats} />
        
        {/* Main Content - Narrative Cards */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg text-[#fca311] dark:text-white">Detected Patterns</h2>
            <span className="text-xs text-[#14213d]/60 dark:text-slate-400 font-mono animate-pulse">LIVE FEED</span>
          </div>
          <NarrativeList clusters={clusters} />
        </div>

        {/* Impact Graph */}
        <div className="w-full">
          <NarrativeMap data={scatterData} />
        </div>
    </div>
  );
}

// Wrapper to handle layout based on route
function Layout() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <div className="min-h-screen text-[#000000] dark:text-white selection:bg-[#fca311]/30 dark:selection:bg-cyan-500/30">
      <Header />
      
      <main className={isLanding ? "" : ""}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/metrics" element={<div className="max-w-7xl mx-auto p-6"><ModelMetrics /></div>} />
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
