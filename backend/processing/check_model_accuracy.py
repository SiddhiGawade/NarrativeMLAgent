import json
import os
import sys
import numpy as np
from sklearn.metrics import silhouette_score, davies_bouldin_score

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

def calculate_metrics(vector_file, scatter_file):
    if not os.path.exists(vector_file) or not os.path.exists(scatter_file):
        return {"error": "Data files not found"}

    try:
        # Load high-dimensional vectors (embeddings)
        with open(vector_file, 'r', encoding='utf-8') as f:
            vector_data = json.load(f)
        
        # Load cluster labels
        with open(scatter_file, 'r', encoding='utf-8') as f:
            scatter_data = json.load(f)

        # Create a map of title -> cluster
        # We use title as a key assuming uniqueness/integrity from the pipeline
        title_to_cluster = {item['title']: item['cluster'] for item in scatter_data}

        X = []
        labels = []

        for item in vector_data:
            title = item['title']
            if title in title_to_cluster:
                vector = item['vector']
                cluster = title_to_cluster[title]
                
                # Filter out noise (-1) for Silhouette Score as it's not a cluster
                # But we might want to know how much noise there is.
                # Standard practice: usually exclude noise for silhouette, or treat it as a cluster if dense.
                # HDBSCAN noise is -1.
                if cluster != -1:
                    X.append(vector)
                    labels.append(cluster)
        
        if len(set(labels)) < 2:
            return {
                "silhouette_score": 0, 
                "davies_bouldin_score": 0, 
                "num_clusters": len(set(labels)),
                "noise_ratio": 0,
                "message": "Not enough clusters for metrics"
            }

        X = np.array(X)
        labels = np.array(labels)

        sil = silhouette_score(X, labels)
        db = davies_bouldin_score(X, labels)
        
        # Calculate noise ratio
        total_points = len(vector_data)
        noise_points = len([item for item in scatter_data if item['cluster'] == -1])
        noise_ratio = noise_points / total_points if total_points > 0 else 0

        return {
            "silhouette_score": float(sil),
            "davies_bouldin_score": float(db),
            "num_clusters": int(len(set(labels))),
            "noise_points": noise_points,
            "total_points": total_points,
            "noise_ratio": float(noise_ratio)
        }

    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    VEC_FILE = os.path.join(BASE_DIR, 'silver_vectors.json')
    SCATTER_FILE = os.path.join(BASE_DIR, 'silver_scatter.json')
    
    metrics = calculate_metrics(VEC_FILE, SCATTER_FILE)
    print(json.dumps(metrics, indent=4))
