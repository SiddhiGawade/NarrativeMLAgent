import re
import datetime
from typing import List, Dict
import difflib

# Try importing standard NLP libs, fallback if missing
try:
    from textblob import TextBlob
except ImportError:
    TextBlob = None

class DataProcessor:
    def __init__(self):
        # Expanded keywords for strict filtering
        self.silver_keywords = [
            "silver", "slv", "ag", "miner", "gold", "precious metal", 
            "commodity", "inflation", "dollar", "fed", "fomc", 
            "solar", "photovoltaic", "short", "squeeze", "mint", "coin"
        ]
        
    def clean_text(self, text: str) -> str:
        """
        Basic text cleaning:
        - Remove HTML tags
        - Remove extra whitespace
        - Lowercase for analysis (optional, but good for reliable matching)
        """
        if not text:
            return ""
            
        # Remove HTML
        text = re.sub(r'<[^>]+>', '', text)
        # Remove URLs
        text = re.sub(r'http\S+', '', text)
        # Collapse whitespace
        text = ' '.join(text.split())
        return text

    def get_sentiment(self, text: str) -> float:
        """
        Returns a float between -1.0 (Negative) and 1.0 (Positive).
        """
        if TextBlob:
            return TextBlob(text).sentiment.polarity
        
        # Fallback: Simple dictionary-based sentiment
        # This is very basic, for V2 we want VADER or FinBERT
        positive = ["surge", "jump", "record", "high", "bull", "buy", "profit", "gain"]
        negative = ["drop", "crash", "low", "bear", "sell", "loss", "plummet", "risk"]
        
        text_lower = text.lower()
        score = 0
        for w in positive:
            if w in text_lower: score += 1
        for w in negative:
            if w in text_lower: score -= 1
            
        # Normalize roughly between -1 and 1
        if score > 5: score = 5
        if score < -5: score = -5
        return score / 5.0

    def process_batch(self, raw_data: List[Dict]) -> List[Dict]:
        """
        Main pipeline for a list of raw items.
        """
        print(f"\n[Processor] Processing {len(raw_data)} items...")
        processed_data = []
        
        ignored_count = 0
        
        for item in raw_data:
            # 1. Clean
            full_text = item.get('full_text', '') or item.get('title', '')
            clean = self.clean_text(full_text)
            
            # 1b. Strict Filtering
            # If the clean text doesn't contain at least one keyword, SKIP IT.
            # Exception: Real-time price updates (MetalPriceAPI) are always kept.
            if item.get('source') != 'MetalPriceAPI':
                if not any(k in clean.lower() for k in self.silver_keywords):
                    ignored_count += 1
                    continue
            
            # 2. Sentiment
            sentiment = self.get_sentiment(clean)
            
            # 3. Enrich
            item['processed'] = {
                'clean_text': clean,
                'sentiment_score': sentiment,
                'is_relevant': True
            }
            
            processed_data.append(item)
            
        print(f"[Processor] Filtered out {ignored_count} unrelated items (Noise).")
            
        # 4. Deduplicate (Simpler version here, advanced in V2)
        # We verify if titles are > 90% similar
        unique_data = []
        seen_titles = []
        
        for item in processed_data:
            title = item['title']
            is_dup = False
            for seen in seen_titles:
                ratio = difflib.SequenceMatcher(None, title, seen).ratio()
                if ratio > 0.9:
                    is_dup = True
                    break
            
            if not is_dup:
                unique_data.append(item)
                seen_titles.append(title)
                
        print(f"[Processor] Deduplicated {len(processed_data)} -> {len(unique_data)} items.")
        return unique_data

if __name__ == "__main__":
    # Test
    processor = DataProcessor()
    sample = [
        {"title": "Silver Prices Surge to Record Highs", "full_text": "Silver prices surge to record highs amid solar demand."},
        {"title": "Silver Prices Surge to Record Highs", "full_text": "Duplicate..."},
        {"title": "Mining Stocks crash", "full_text": "Mining stocks crash as rates rise."}
    ]
    results = processor.process_batch(sample)
    for r in results:
        print(f"Title: {r['title']} | Sentiment: {r['processed']['sentiment_score']}")
