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
        
    # Optional: Save to JSON/DB (Step 3)
    
if __name__ == "__main__":
    run_pipeline()
