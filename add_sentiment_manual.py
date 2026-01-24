import json
import os
import sys
from transformers import pipeline

print("Initializing Sentiment Model...")
try:
    sentiment_pipeline = pipeline("sentiment-analysis", model="yiyanghkust/finbert-tone")
    print("Model Loaded.")
except Exception as e:
    print(f"Model Load Error: {e}")
    sys.exit(1)

def analyze_sentiment(text):
    try:
        # Truncate to avoid index errors
        res = sentiment_pipeline(text[:2000])[0]
        return {'label': res['label'], 'score': res['score']}
    except Exception as e:
        print(f"Sentiment Error: {e}")
        return {'label': 'Neutral', 'score': 0.0}

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.join(base_dir, 'backend', 'silver_clusters.json')
    
    if not os.path.exists(json_path):
        print(f"File not found: {json_path}")
        return

    print(f"Reading {json_path}...")
    with open(json_path, 'r', encoding='utf-8') as f:
        clusters = json.load(f)
        
    print(f"Processing {len(clusters)} clusters...")
    updated_count = 0
    
    for c in clusters:
        # Skip noise if desired, but we can tag it too or leave as Neutral
        if c['cluster_id'] == -1:
            c['sentiment'] = {'label': 'Neutral', 'score': 0.0}
            continue
            
        summary = c.get('summary', '')
        if not summary:
            summary = c.get('label', '')
            
        sentiment = analyze_sentiment(summary)
        c['sentiment'] = sentiment
        print(f"Cluster {c['cluster_id']}: {sentiment['label']}")
        updated_count += 1
        
    print(f"Saving updated clusters...")
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(clusters, f, indent=4)
        
    print("Done! Sentiment tags added.")

if __name__ == "__main__":
    main()
