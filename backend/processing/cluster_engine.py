import json
import os
import sys
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# Try imports
print("DEBUG: Importing UMAP/HDBSCAN...")
try:
    import umap
    import hdbscan
    print("DEBUG: UMAP/HDBSCAN Imported")
except ImportError:
    print("[!] UMAP or HDBSCAN not installed.")
    sys.exit(1)

# Add project root to path ensuring module resolution works
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

print("DEBUG: Importing NarrativeNamer...")
from backend.processing.narrative_namer import NarrativeNamer
print("DEBUG: Namer Imported")

class ClusterEngine:
    def __init__(self, data_file: str, vector_file: str):
        self.data_file = data_file
        self.vector_file = vector_file
        self.namer = NarrativeNamer()
        
    def load_data(self):
        if not os.path.exists(self.vector_file):
            print(f"[!] Vector file not found: {self.vector_file}")
            return None, None
            
        with open(self.vector_file, 'r', encoding='utf-8') as f:
            vector_data = json.load(f)
            
        # Extract Vectors and Metadata
        embeddings = [item['vector'] for item in vector_data]
        titles = [item['title'] for item in vector_data]
        return np.array(embeddings), titles

    def run_clustering(self, embeddings, titles):
        print(f"[ClusterEngine] Reducing dimensions (UMAP) on {len(embeddings)} items...")
        
        # 1. UMAP (384 -> 2 Dimensions)
        # Using n_neighbors=15 (local structure) and min_dist=0.1
        reducer = umap.UMAP(n_neighbors=15, min_dist=0.1, n_components=2, random_state=42)
        umap_embeddings = reducer.fit_transform(embeddings)
        
        print(f"[ClusterEngine] Finding topics (HDBSCAN)...")
        # 2. HDBSCAN
        # min_cluster_size=3 means we need at least 3 articles to form a "Topic".
        clusterer = hdbscan.HDBSCAN(min_cluster_size=3, gen_min_span_tree=True)
        cluster_labels = clusterer.fit_predict(umap_embeddings)
        
        # 3. Organize Results
        df = pd.DataFrame(umap_embeddings, columns=['x', 'y'])
        df['cluster'] = cluster_labels
        df['title'] = titles
        
        # Count clusters (excluding noise -1)
        num_clusters = len(set(cluster_labels)) - (1 if -1 in cluster_labels else 0)
        print(f"[ClusterEngine] Found {num_clusters} distinct narratives (and {list(cluster_labels).count(-1)} noise items).")
        
        return df

    def save_results(self, df, output_json, output_img, scatter_json):
        # 1. Save Scatter Data (Full list for Frontend)
        # We convert the DataFrame to a list of dicts: [{x, y, cluster, title}, ...]
        scatter_data = df.to_dict(orient='records')
        # Ensure native types for JSON serialization (int64 -> int)
        for item in scatter_data:
            item['cluster'] = int(item['cluster'])
            
        with open(scatter_json, 'w', encoding='utf-8') as f:
            json.dump(scatter_data, f, indent=4)
        print(f"[ClusterEngine] Saved scatter data to {scatter_json}")

        # 2. Save Aggregated Cluster Summary
        results = []
        for cluster_id in sorted(df['cluster'].unique()):
            cluster_items = df[df['cluster'] == cluster_id]
            titles = cluster_items['title'].tolist()
            
            # Use Namer to generate label (Returns Dict with Title/Summary)
            if cluster_id == -1:
                name_data = {'title': "Noise coverage", 'summary': "Unrelated items"}
            else:
                try:
                    name_data = self.namer.generate_name(titles)
                except Exception as e:
                    print(f"   [!] Detailed naming failed: {e}")
                    name_data = {'title': "Narrative Processing Error", 'summary': str(e)}
            
            # Simple summarization: Just take the first 5 titles
            representative_titles = titles[:5]
            
            entry = {
                'cluster_id': int(cluster_id),
                'size': int(len(cluster_items)),
                'label': name_data['title'],
                'summary': name_data.get('summary', 'No summary available.'),
                'sentiment': name_data.get('sentiment'),
                'representative_titles': representative_titles
            }
            results.append(entry)
            
        with open(output_json, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=4)
        print(f"[ClusterEngine] Saved cluster summary to {output_json}")
        
        # Save Plot
        plt.figure(figsize=(10, 8))
        scatter = plt.scatter(df['x'], df['y'], c=df['cluster'], cmap='Spectral', s=50)
        plt.colorbar(scatter, label='Cluster ID')
        plt.title(f"Silver Narratives Map: {len(df['cluster'].unique())-1} Topics Found")
        plt.xlabel("UMAP Dimension 1")
        plt.ylabel("UMAP Dimension 2")
        plt.savefig(output_img)
        print(f"[ClusterEngine] Saved visualization to {output_img}")

if __name__ == "__main__":
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    VEC_FILE = os.path.join(BASE_DIR, 'silver_vectors.json')
    # Use empty data file path since we load metadata from vector file directly
    DATA_FILE = "" 
    
    OUT_JSON = os.path.join(BASE_DIR, 'silver_clusters.json')
    OUT_IMG = os.path.join(BASE_DIR, 'clusters.png')
    SCATTER_JSON = os.path.join(BASE_DIR, 'silver_scatter.json')
    
    engine = ClusterEngine(DATA_FILE, VEC_FILE)
    embeddings, titles = engine.load_data()
    
    if embeddings is not None and len(embeddings) > 0:
        df = engine.run_clustering(embeddings, titles)
        engine.save_results(df, OUT_JSON, OUT_IMG, SCATTER_JSON)
    else:
        print("[!] No embeddings found. Run vectorizer.py first.")
