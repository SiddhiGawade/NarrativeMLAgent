from typing import List, Dict
import asyncio
import os
from dotenv import load_dotenv
from backend.data_collectors.news_scraper import NewsScraper
from backend.data_collectors.rss_scraper import RSSScraper
from backend.data_collectors.metal_scraper import MetalPriceScraper
from backend.data_collectors.twitter_scraper import TwitterScraper

# Load environment variables
load_dotenv()

class DataFusion:
    def __init__(self, target_tickers: List[str] = None):
        # Default now includes the expanded list from expansion plan
        self.tickers = target_tickers or [
            "SI=F", "SLV", "PSLV", "SIVR",        # Core
            "PAAS", "AG", "HL", "CDE", "WPM",     # Miners
            "SSR", "MAG", "FSM",                  # Miners
            "SVM", "EXK", "ASM", "GATO",          # Juniors
            "FSLR", "SEDG", "TAN"                 # Industrial
        ]
        self.news_scraper = NewsScraper(self.tickers)
        self.rss_scraper = RSSScraper() 
        
        # Load API keys from environment
        metal_api_key = os.getenv("METAL_PRICE_API_KEY")
        if not metal_api_key:
            raise ValueError("METAL_PRICE_API_KEY not found in environment variables")
        self.metal_scraper = MetalPriceScraper(api_key=metal_api_key)
        
        twitter_token = os.getenv("TWITTER_BEARER_TOKEN")
        if not twitter_token:
            raise ValueError("TWITTER_BEARER_TOKEN not found in environment variables")
        self.twitter_scraper = TwitterScraper(bearer_token=twitter_token)

    def collect_all_data(self) -> List[Dict]:
        """
        Runs all scrapers and fuses the data into a single timeline.
        """
        print("\n[Fusion] Starting Multi-Source Collection (Expanded Silver Universe)...")
        
        all_data = []

        # 1. Fetch Metal Prices (High Priority Real-time)
        print("[Fusion] > Triggering MetalPriceScraper...")
        metal_data = self.metal_scraper.fetch_prices()
        all_data.extend(metal_data)
        
        # 2. Fetch News (yfinance)
        print("[Fusion] > Triggering News Scraper...")
        news_data = self.news_scraper.fetch_news()
        all_data.extend(news_data)
        
        # 3. Fetch RSS
        print("[Fusion] > Triggering RSS Scraper...")
        rss_data = self.rss_scraper.fetch_feeds()
        all_data.extend(rss_data)

        # 4. Fetch Twitter (New)
        print("[Fusion] > Triggering Twitter Scraper...")
        twitter_data = self.twitter_scraper.fetch_tweets(query="Silver #silver squeeze $SLV lang:en -is:retweet", max_results=15)
        all_data.extend(twitter_data)
        
        # 5. Merge & Sort
        # Deduplication (Simple check on Title)
        seen_titles = set()
        unique_data = []
        for item in all_data:
            t = item.get('title', '')
            if t not in seen_titles:
                seen_titles.add(t)
                unique_data.append(item)
        
        print(f"[Fusion] Total Raw: {len(all_data)} -> Unique: {len(unique_data)}")
        
        # Sort by Date (Descending - Newest First)
        unique_data.sort(key=lambda x: x['published_at'], reverse=True)
        
        return unique_data

if __name__ == "__main__":
    fusion = DataFusion()
    results = fusion.collect_all_data()
    
    print("\n" + "="*60)
    print(f"FUSED FEED ({len(results)} items)")
    print("="*60)
    
    for i, item in enumerate(results[:20]):
        print(f"[{item['published_at']}] [{item['source'][:15]}...] {item['title'][:60]}...")
