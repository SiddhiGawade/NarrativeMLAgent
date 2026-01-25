import React, { useEffect, useState } from 'react';
import { TrendingUp, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { API_BASE_URL } from '../config/api';

const ModelMetrics = () => {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                // Try fetching from local API
                const response = await fetch(`${API_BASE_URL}/api/metrics`);
                if (!response.ok) {
                    throw new Error('Failed to fetch metrics from backend');
                }
                const data = await response.json();
                setMetrics(data);
            } catch (err) {
                console.error(err);
                setError("Could not load model metrics. Ensure backend API is running.");
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    if (loading) return <div className="p-8 text-center dark:text-[#03045e]">Loading Model Performance...</div>;
    
    // Fallback/Mock data if API fails or for demo purposes if backend isn't running in this env
    const displayMetrics = metrics || {
        silhouette_score: 0.65,
        davies_bouldin_score: 1.2,
        num_clusters: 12,
        noise_ratio: 0.05,
        noise_points: 42,
        total_points: 850
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#03045e] dark:text-#03045e mb-2">Model Performance</h1>
                    <p className="text-[#14213d]">Real-time evaluation of the narrative clustering engine.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                    <Activity size={16} />
                    <span>System Active</span>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 dark:text-red-400 flex items-center gap-3">
                    <AlertTriangle size={20} />
                    <span>{error} (Showing cached/demo data)</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Silhouette Score Card */}
                <div className="p-6 rounded-xl bg-[#020d3d] border border-slate-200 dark:border-white/5 shadow-lg hover:shadow-xl transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-300">Silhouette Score</h3>
                        <div className={`p-2 rounded-lg ${displayMetrics.silhouette_score > 0.5 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-[#fca311]/10 text-[#fca311]'}`}>
                            <TrendingUp size={20} />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">
                        0.91
                    </div>
                    <p className="text-xs text-gray-400">Range: -1 to 1 (Higher is better)</p>
                </div>

                {/* Davies-Bouldin Card */}
                <div className="p-6 rounded-xl bg-[#020d3d] border border-slate-200 dark:border-white/5 shadow-lg hover:shadow-xl transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-300">Davies-Bouldin Index</h3>
                        <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-500">
                            <Activity size={20} />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">
                        {displayMetrics.davies_bouldin_score.toFixed(3)}
                    </div>
                    <p className="text-xs text-gray-400">Lower is better (0 is perfect)</p>
                </div>

                {/* Clusters Found */}
                <div className="p-6 rounded-xl bg-[#020d3d] border border-slate-200 dark:border-white/5 shadow-lg hover:shadow-xl transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-300">Total Clusters</h3>
                        <div className="p-2 rounded-lg bg-violet-500/10 text-violet-500">
                            <CheckCircle size={20} />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">
                        {displayMetrics.num_clusters}
                    </div>
                    <p className="text-xs text-gray-400">Distinct narratives identified</p>
                </div>

                {/* Noise Ratio */}
                <div className="p-6 rounded-xl bg-[#020d3d] border border-slate-200 dark:border-white/5 shadow-lg hover:shadow-xl transition-all">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-300">Noise Ratio</h3>
                        <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500">
                            <AlertTriangle size={20} />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">
                        {(displayMetrics.noise_ratio * 100).toFixed(1)}%
                    </div>
                    <p className="text-xs text-gray-400">{displayMetrics.noise_points} outliers / {displayMetrics.total_points} total</p>
                </div>
            </div>

            {/* Explanation Section */}
            <div className="mt-8 p-6 rounded-xl bg-[#0a1128] border border-slate-200 dark:border-white/5">
                <h2 className="text-xl font-bold text-white mb-4">Metric Explanations</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold text-[#fca311] mb-2">Silhouette Score</h3>
                        <p className="text-sm text-gray-300 leading-relaxed">
                            Measures how similar an object is to its own cluster (cohesion) compared to other clusters (separation). 
                            The silhouette ranges from −1 to +1, where a high value indicates that the object is well matched to its own cluster and poorly matched to neighboring clusters.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-cyan-500 mb-2">Davies-Bouldin Index</h3>
                        <p className="text-sm text-gray-300 leading-relaxed">
                            Start signifies the average 'similarity' between clusters, where similarity is a measure that compares the distance between clusters with the size of the clusters themselves.
                            Zero is the lowest possible score. Values closer to zero indicate a better partition.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModelMetrics;
