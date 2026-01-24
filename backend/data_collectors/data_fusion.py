from typing import List, Dict
import asyncio
from backend.data_collectors.news_scraper import NewsScraper
from backend.data_collectors.rss_scraper import RSSScraper
from backend.data_collectors.metal_scraper import MetalPriceScraper
from backend.data_collectors.twitter_scraper import TwitterScraper

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
        # API Key provided by user
        self.metal_scraper = MetalPriceScraper(api_key="23e2ec99f2041769e7bae47551d049d0")
        # Twitter Bearer Token (Normally env var, hardcoded for prototype)
        self.twitter_scraper = TwitterScraper(bearer_token="AAAAAAAAAAAAAAAAAAAAAGHN7AEAAAAAXp6jhYBtmG5WCILJYg2R9VokoNo%3Dmu6w9SCDNFVMmlWYQ0vzJX3alYAGtMOiT8MZmAyG6NDztYmfzr")

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
