import json
import os
import sys
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Imports that work in test_full.py
import umap
import hdbscan
from transformers import pipeline
import google.generativeai as genai

# Setup paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(BASE_DIR, 'backend')
VEC_FILE = os.path.join(BACKEND_DIR, 'silver_vectors.json')
OUT_JSON = os.path.join(BACKEND_DIR, 'silver_clusters.json')
OUT_IMG = os.path.join(BACKEND_DIR, 'clusters.png')
SCATTER_JSON = os.path.join(BACKEND_DIR, 'silver_scatter.json')

# Init Sentiment
print("Loading Sentiment Model...")
sentiment_pipeline = pipeline("sentiment-analysis", model="yiyanghkust/finbert-tone")

# Init GenAI - Load from environment
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY not found in environment variables")

genai.configure(api_key=GOOGLE_API_KEY)
try:
    genai_model = genai.GenerativeModel('gemini-1.5-flash')
except:
    genai_model = genai.GenerativeModel('gemini-pro')

def analyze_sentiment(text):
    try:
        res = sentiment_pipeline(text[:2000])[0]
        return {'label': res['label'], 'score': res['score']}
    except:
        return {'label': 'Neutral', 'score': 0.0}

def generate_name(titles):
    prompt = f"""
    Analyze these headlines about Silver:
    {titles[:15]}
    
    1. Identify the event.
    2. Write a short Title (3-6 words).
    3. Write a 2-sentence Summary.
    
    Output strictly:
    TITLE: ...
    SUMMARY: ...
    """
    try:
        response = genai_model.generate_content(prompt)
        text = response.text
        title = "Unidentified Trend"
        summary = "Analysis failed."
        for line in text.split('\n'):
            if line.startswith('TITLE:'): title = line.replace('TITLE:', '').strip()
            elif line.startswith('SUMMARY:'): summary = line.replace('SUMMARY:', '').strip()
        
        return title.replace('"','').replace('*',''), summary
    except Exception as e:
        print(f"GenAI Error: {e}")
        return titles[0], "No summary."

def main():
    print("Loading Data...")
    if not os.path.exists(VEC_FILE):
        print("Vector file missing.")
        return

    with open(VEC_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    embeddings = np.array([item['vector'] for item in data])
    titles = [item['title'] for item in data]
    
    print(f"Clustering {len(embeddings)} items...")
    reducer = umap.UMAP(n_neighbors=15, min_dist=0.1, n_components=2, random_state=42)
    umap_embeddings = reducer.fit_transform(embeddings)
    
    clusterer = hdbscan.HDBSCAN(min_cluster_size=3, gen_min_span_tree=True)
    labels = clusterer.fit_predict(umap_embeddings)
    
    df = pd.DataFrame(umap_embeddings, columns=['x', 'y'])
    df['cluster'] = labels
    df['title'] = titles
    
    # Save Scatter
    scatter_data = df.to_dict(orient='records')
    for item in scatter_data: item['cluster'] = int(item['cluster'])
    with open(SCATTER_JSON, 'w') as f: json.dump(scatter_data, f, indent=4)
    
    # Process Clusters
    results = []
    unique_clusters = sorted(df['cluster'].unique())
    print(f"Processing {len(unique_clusters)} clusters...")

    for cid in unique_clusters:
        c_items = df[df['cluster'] == cid]
        c_titles = c_items['title'].tolist()
        
        if cid == -1:
            title, summary = "Noise coverage", "Unrelated items."
            sent = {'label': 'Neutral', 'score': 0.0}
        else:
            title, summary = generate_name(c_titles)
            sent = analyze_sentiment(summary)
            print(f"Cluster {cid}: {title} [{sent['label']}]")
            
        entry = {
            'cluster_id': int(cid),
            'size': int(len(c_items)),
            'label': title,
            'summary': summary,
            'sentiment': sent,
            'representative_titles': c_titles[:5]
        }
        results.append(entry)
        
    with open(OUT_JSON, 'w') as f: json.dump(results, f, indent=4)
    print("Done!")

if __name__ == "__main__":
    main()
