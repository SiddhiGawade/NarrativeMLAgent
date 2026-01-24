import clusterData from '../../../backend/silver_clusters.json';
import scatterData from '../../../backend/silver_scatter.json';

// In a real app, this might fetch from an API. 
// For now, we use the imported JSON directly.

export const getClusterData = () => {
    return clusterData || [];
};

export const getVectorData = () => {
    // If vectorData doesn't have x/y from python (it currently has 'vector'), 
    // we might need to rely on the cluster_engine logic having saved x/y.
    // Wait, vectorizer.py saves 'vector' (384 floats). 
    // cluster_engine.py saves `silver_clusters.json` BUT it didn't save the x/y coordinates of every point to a file we can easily read for the scatter plot.
    // We need to FIX the backend to save the [x, y] coordinates for every point so the frontend can plot them.

    // Checking `silver_vectors.json` content... it has 'vector' (high dim).
    // Checking `silver_clusters.json` content... it has aggregated cluster info.

    // IMMEDIATE ACTION: We need a file `silver_scatter.json` with {x, y, title, cluster, sentiment}.
    // For now, this loader will return empty or mock data until backend is updated.
    return scatterData || [];
};

export const getStats = () => {
    const clusters = getClusterData();
    const totalArticles = clusters.reduce((acc, c) => acc + c.size, 0);
    const totalNarratives = clusters.filter(c => c.cluster_id !== -1).length;

    return {
        totalArticles,
        totalNarratives,
        lastUpdated: new Date().toISOString()
    };
};
