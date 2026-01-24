import json
import os
import sys
import numpy as np

# Try importing sentence_transformers
try:
    from sentence_transformers import SentenceTransformer
except ImportError as e:
    print(f"[!] 'sentence_transformers' import failed: {e}")
    sys.exit(1)

class NarrativeVectorizer:
    def __init__(self, model_name: str = 'all-MiniLM-L6-v2'):
        print(f"[Vectorizer] Loading model: {model_name} ...")
        self.model = SentenceTransformer(model_name)
        
    def load_data(self, json_path: str):
        if not os.path.exists(json_path):
            print(f"[!] Data file not found: {json_path}")
            return []
        with open(json_path, 'r', encoding='utf-8') as f:
            return json.load(f)

    def generate_embeddings(self, data):
        if not data:
            return []
            
        print(f"[Vectorizer] Generating embeddings for {len(data)} items...")
        
        # Prepare text for embedding
        # We combine Title + Clean Text for maximum context
        texts = [item['title'] + " " + item['processed']['clean_text'] for item in data]
        
        # Generate vectors (batch process is handled by library)
        embeddings = self.model.encode(texts)
        
        # Convert to list for JSON serialization
        return embeddings.tolist()

    def save_vectors(self, data, vectors, output_path):
        # We save a new structure matching ID/Title to Vector
        output_data = []
        for i, item in enumerate(data):
            entry = {
                'title': item['title'],
                'published_at': item['published_at'],
                'vector': vectors[i], # List of floats
                'metadata': item['processed']
            }
            output_data.append(entry)
            
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(output_data, f)
        print(f"[Vectorizer] Saved vectors to {output_path}")

if __name__ == "__main__":
    # Paths
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    INPUT_FILE = os.path.join(BASE_DIR, 'silver_data.json')
    OUTPUT_FILE = os.path.join(BASE_DIR, 'silver_vectors.json')
    
    vectorizer = NarrativeVectorizer()
    data = vectorizer.load_data(INPUT_FILE)
    
    if data:
        vectors = vectorizer.generate_embeddings(data)
        vectorizer.save_vectors(data, vectors, OUTPUT_FILE)
    else:
        print("[!] No data to vectorize. Run main_pipeline.py first.")
