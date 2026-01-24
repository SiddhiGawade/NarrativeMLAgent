import asyncio
import sys
import os
import json 
import datetime

# Add project root to path ensuring module resolution works
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.data_collectors.data_fusion import DataFusion
from backend.processing.processor_v1 import DataProcessor

def run_pipeline():
    print("="*60)
    print(" SILVER NARRATIVE AGENT - MAIN PIPELINE v1.0")
    print("="*60)
    
    # 1. Collection Phase
    print("\n[PHASE 1] Data Collection")
    fusion = DataFusion()
    raw_data = fusion.collect_all_data()
    
    if not raw_data:
        print("[!] No data collected. Exiting.")
        return
        
    print(f"[+] Collection Complete. Got {len(raw_data)} items.")
    
    # 2. Processing Phase
    print("\n[PHASE 2] Data Processing")
    processor = DataProcessor()
    processed_feed = processor.process_batch(raw_data)
    
    # 3. Storage Phase (JSON)
    json_path = os.path.join(os.path.dirname(__file__), 'silver_data.json')
    try:
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(processed_feed, f, indent=4, default=str)
        print(f"\n[Storage] Saved {len(processed_feed)} items to {json_path}")
    except Exception as e:
        print(f"[!] Error saving JSON: {e}")
    
    # 4. Display Results
    print("\n" + "="*60)
    print(" TOP SILVER NARRATIVES (SENTIMENT RANKED)")
    print("="*60)
    
    # Sort by sentiment magnitude (absolute value) to filter "strongest" views? 
    # Or just by date? Let's stick to date for now, but display sentiment.
    
    for i, item in enumerate(processed_feed[:20]):
        sent = item['processed']['sentiment_score']
        # Visual indicator
        if sent > 0.2: label = "[BULLISH]"
        elif sent < -0.2: label = "[BEARISH]"
        else: label = "[NEUTRAL]"
        
        print(f"{label} (Score: {sent:.2f}) | {item['title'][:80]}")
        print(f"   > Source: {item['source']} | Date: {item['published_at']}")
        print("-" * 40)
        
    # 4. Vectorization Phase
    print("\n[PHASE 3] Vectorization")
    from backend.processing.vectorizer import NarrativeVectorizer
    vectorizer = NarrativeVectorizer()
    
    # We load from the just-saved JSON to ensure consistency
    data_for_vec = vectorizer.load_data(json_path)
    if data_for_vec:
        vectors = vectorizer.generate_embeddings(data_for_vec)
        vec_path = os.path.join(os.path.dirname(__file__), 'silver_vectors.json')
        vectorizer.save_vectors(data_for_vec, vectors, vec_path)
    else:
        print("[!] Vectorization skipped (no data).")
        return

    # 5. Clustering & Narrative Generation Phase
    print("\n[PHASE 4] Clustering & Narrative Analysis")
    from backend.processing.cluster_engine import ClusterEngine
    
    # Paths for clustering output
    out_json = os.path.join(os.path.dirname(__file__), 'silver_clusters.json')
    out_img = os.path.join(os.path.dirname(__file__), 'clusters.png')
    scatter_json = os.path.join(os.path.dirname(__file__), 'silver_scatter.json')
    
    engine = ClusterEngine(json_path, vec_path)
    embeddings, titles = engine.load_data()
    
    if embeddings is not None and len(embeddings) > 0:
        df = engine.run_clustering(embeddings, titles)
        engine.save_results(df, out_json, out_img, scatter_json)
    else:
        print("[!] Clustering skipped (no embeddings).")

    # 6. Display Results (Top Narratives)
    print("\n" + "="*60)
    print(" NEW DETECTED NARRATIVES (WITH SENTIMENT)")
    print("="*60)
    
    # Load the results we just saved
    if os.path.exists(out_json):
        with open(out_json, 'r', encoding='utf-8') as f:
            clusters = json.load(f)
            
        for c in clusters:
            if c['cluster_id'] == -1: continue # Skip noise in summary
            sent_label = "NEUTRAL"
            if c.get('sentiment'):
                sent_label = c['sentiment']['label'].upper()
                
            print(f"[{sent_label}] {c['label']}")
            print(f"   > Summary: {c['summary']}")
            print("-" * 40)
    
    # End Loop
    
if __name__ == "__main__":
    run_pipeline()
