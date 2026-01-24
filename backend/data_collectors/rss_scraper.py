import feedparser
from typing import List, Dict
import datetime
import sys
import os

# Add parent directory to path to allow importing preprocessing
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

try:
    from data_collectors.preprocessing import clean_text, normalize_date
except ImportError:
    from preprocessing import clean_text, normalize_date

class RSSScraper:
    def __init__(self, feed_urls: List[str] = None):
        """
        :param feed_urls: List of RSS feed URLs. 
                          If None, defaults to a curated list of finance feeds.
        """
        self.feed_urls = feed_urls or [
            "https://www.investing.com/rss/commodities_Silver.rss",
            "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=15839069",
            "https://feeds.content.dowjones.com/public/rss/mw_topstories",
            "https://www.kitco.com/rss/category/silver",
            "https://www.mining.com/commodity/silver/feed/",
            "http://feeds.feedburner.com/zerohedge/feed"
        ]

    def fetch_feeds(self) -> List[Dict]:
        """
        Fetches and parses all configured RSS feeds.
        Returns normalized list of items.
        """
        aggregated_news = []
        
        print(f"[*] Fetching {len(self.feed_urls)} RSS feeds...")
        
        for url in self.feed_urls:
            try:
                feed = feedparser.parse(url)
                if feed.bozo:
                    print(f"   [!] Warning parsing {url}: {feed.bozo_exception}")
                
                source_title = feed.feed.get('title', 'RSS Source')
                print(f"   [+] Parsed {source_title}: {len(feed.entries)} items")
                
                for entry in feed.entries:
                    raw_title = entry.get('title', '')
                    raw_summary = entry.get('summary', '') or entry.get('description', '')
                    
                    cleaned_title = clean_text(raw_title)
                    cleaned_summary = clean_text(raw_summary)
                    
                    if not cleaned_title:
                        continue
                        
                    # Standardize Date
                    published_at = normalize_date(datetime.datetime.now())
                    if hasattr(entry, 'published_parsed') and entry.published_parsed:
                         # published_parsed is a struct_time, convert to datetime
                         dt_obj = datetime.datetime(*entry.published_parsed[:6])
                         published_at = normalize_date(dt_obj)
                    
                    combined_text = f"{cleaned_title} - {cleaned_summary}"
                    
                    item = {
                        'source': f"RSS - {source_title}",
                        'ticker': 'GENERAL', # RSS feeds often aren't ticker specific unless filtered
                        'title': cleaned_title,
                        'summary': cleaned_summary,
                        'full_text': combined_text,
                        'url': entry.get('link', ''),
                        'published_at': published_at,
                        'raw_data': str(entry)
                    }
                    aggregated_news.append(item)
                    
            except Exception as e:
                print(f"   [!] Error fetching feed {url}: {e}")
                
        return aggregated_news

if __name__ == "__main__":
    scraper = RSSScraper()
    data = scraper.fetch_feeds()
    print(f"\n[+] Total RSS Items: {len(data)}")
    if data:
        print(f"Sample: {data[0]['title']} | {data[0]['published_at']}")
