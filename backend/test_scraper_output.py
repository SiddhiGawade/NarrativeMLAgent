from data_collectors.news_scraper import NewsScraper
import sys

# Redirect stdout to file just in case
sys.stdout = open('scraper_results.txt', 'w', encoding='utf-8')

print("Starting Scraper Test...")
target_tickers = ["SI=F", "SLV", "AG"]
scraper = NewsScraper(target_tickers)
data = scraper.fetch_news()

print(f"\n[+] Successfully collected {len(data)} news items.")
print("-" * 50)
for i, item in enumerate(data):
    print(f"{i+1}. [{item['ticker']}] {item['title'][:50]}... | {item['published_at']}")
print("-" * 50)

print("Done.")
