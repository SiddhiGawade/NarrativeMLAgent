import requests
import datetime
from typing import List, Dict

class TwitterScraper:
    def __init__(self, bearer_token: str):
        self.bearer_token = bearer_token
        self.base_url = "https://api.twitter.com/2/tweets/search/recent"

    def fetch_tweets(self, query: str = "Silver #Silver squeeze $SLV lang:en", max_results: int = 10) -> List[Dict]:
        """
        Fetches recent tweets matching the query.
        Note: Requires 'Basic' tier or higher for Search API access.
        """
        print(f"[*] Fetching Tweets for query: '{query}'")
        
        headers = {
            "Authorization": f"Bearer {self.bearer_token}",
            "User-Agent": "SilverNarrativeBot/1.0"
        }
        
        params = {
            'query': query,
            'max_results': max_results,
            'tweet.fields': 'created_at,author_id,public_metrics',
            'expansions': 'author_id'
        }
        
        try:
            response = requests.get(self.base_url, headers=headers, params=params)
            
            if response.status_code != 200:
                print(f"   [!] Twitter API Error ({response.status_code}): {response.text}")
                return []
                
            data = response.json()
            if 'data' not in data:
                print("   [!] No tweets found or API limit reached.")
                return []
                
            results = []
            users = {u['id']: u['username'] for u in data.get('includes', {}).get('users', [])}
            
            for tweet in data['data']:
                author_id = tweet.get('author_id')
                author_name = users.get(author_id, "Unknown")
                
                # Normalize date
                # Twitter format: 2023-10-01T12:00:00.000Z (ISO 8601)
                pub_at = tweet.get('created_at')
                
                entry = {
                    'source': f"Twitter - @{author_name}",
                    'ticker': 'SOCIAL',
                    'title': tweet['text'][:100] + "...",
                    'summary': tweet['text'],
                    'full_text': tweet['text'],
                    'url': f"https://twitter.com/{author_name}/status/{tweet['id']}",
                    'published_at': pub_at,
                    'raw_data': str(tweet.get('public_metrics', {}))
                }
                results.append(entry)
                
            print(f"   [+] Collected {len(results)} tweets")
            return results

        except Exception as e:
            print(f"   [!] Error fetching tweets: {e}")
            return []

if __name__ == "__main__":
    # PASTE YOUR BEARER TOKEN HERE
    BEARER_TOKEN = "AAAAAAAAAAAAAAAAAAAAAGHN7AEAAAAAXp6jhYBtmG5WCILJYg2R9VokoNo%3Dmu6w9SCDNFVMmlWYQ0vzJX3alYAGtMOiT8MZmAyG6NDztYmfzr"
    
    if BEARER_TOKEN == "YOUR_BEARER_TOKEN_HERE":
        print("Please paste your Bearer Token in the script.")
    else:
        scraper = TwitterScraper(BEARER_TOKEN)
        scraper.fetch_tweets()
