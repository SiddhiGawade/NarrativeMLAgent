import yfinance as yf
import pandas as pd
import datetime
from typing import List, Dict
import sys
import os

# Add parent directory to path to allow importing preprocessing
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

try:
    from data_collectors.preprocessing import clean_text, normalize_date
except ImportError:
    # Fallback if run directly from backend folder
    from preprocessing import clean_text, normalize_date

class NewsScraper:
    def __init__(self, tickers: List[str]):
        self.tickers = tickers

    def fetch_news(self) -> List[Dict]:
        """
        Fetches latest news for the tickers using yfinance.
        Returns a list of dictionaries with normalized data.
        """
        aggregated_news = []
        
        print(f"[*] Fetching news for: {', '.join(self.tickers)}")
        
        for ticker in self.tickers:
            try:
                stock = yf.Ticker(ticker)
                news_items = stock.news
                print(f"   [DEBUG] {ticker}: Found {len(news_items)} raw items")
                
                # yfinance returns a list of dicts. We need to normalize them.
                for item in news_items:
                    # Check for nested content (common in newer yfinance versions)
                    content = item.get('content', item)
                    
                    # Title is the most important part for narrative detection
                    raw_title = content.get('title', '')
                    raw_summary = content.get('summary', '')
                    
                    cleaned_title = clean_text(raw_title)
                    cleaned_summary = clean_text(raw_summary)
                    
                    if not cleaned_title:
                        continue
                        
                    # Combine title and summary for richer context
                    combined_text = f"{cleaned_title} - {cleaned_summary}"
                        
                    entry = {
                        'source': 'Yahoo Finance',
                        'ticker': ticker,
                        'title': cleaned_title,
                        'summary': cleaned_summary,
                        'full_text': combined_text,
                        'url': content.get('canonicalUrl', {}).get('url') or content.get('clickThroughUrl', {}).get('url') or item.get('link', ''),
                        'published_at': content.get('pubDate', normalize_date(datetime.datetime.now())),
                        'raw_data': str(item)
                    }
                    
                    # Try to get real timestamp if available
                    if 'providerPublishTime' in item:
                        ts = item['providerPublishTime']
                        entry['published_at'] = normalize_date(datetime.datetime.fromtimestamp(ts))
                        
                    aggregated_news.append(entry)
                    
            except Exception as e:
                print(f"[!] Error fetching {ticker}: {e}")
                
        return aggregated_news

if __name__ == "__main__":
    import datetime
    target_tickers = [
        "SI=F", "SLV", "PSLV", "SIVR",        # Core Silver
        "PAAS", "AG", "HL", "CDE", "WPM",     # Major Miners
        "SSR", "MAG", "FSM",                  # Major Miners
        "SVM", "EXK", "ASM", "GATO",          # Junior Miners
        "FSLR", "SEDG", "TAN"                 # Industrial/Solar
    ]
    scraper = NewsScraper(target_tickers)
    data = scraper.fetch_news()
    
    print(f"\n[+] Successfully collected {len(data)} news items.")
    print("-" * 50)
    for i, item in enumerate(data[:10]): # Show top 10
        print(f"{i+1}. [{item['ticker']}] ({item['published_at']}) {item['title']}")
    print("-" * 50)
