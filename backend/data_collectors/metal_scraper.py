import requests
import datetime
from typing import Dict, List
import os

class MetalPriceScraper:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.metalpriceapi.com/v1/latest"
        self.base_currency = "USD"
        self.currencies = ["XAG", "XAU"] # Silver, Gold

    def fetch_prices(self) -> List[Dict]:
        """
        Fetches current spot prices for Silver and Gold.
        """
        print(f"[*] Fetching Metal Prices (API Key: {self.api_key[:5]}...)")
        
        try:
            params = {
                'api_key': self.api_key,
                'base': self.base_currency,
                'currencies': ",".join(self.currencies)
            }
            
            response = requests.get(self.base_url, params=params)
            data = response.json()
            
            if not data.get('success'):
                print(f"   [!] API Error: {data.get('error')}")
                return []
                
            timestamp = data.get('timestamp')
            rates = data.get('rates', {})
            
            results = []
            normalized_date = datetime.datetime.fromtimestamp(timestamp).isoformat()
            
            # XAG is "Silver per USD" usually, or "USD per Silver" depending on base.
            # MetalPriceAPI usually gives rates relative to Base. 
            # If Base=USD, XAG=0.03 (approx). Meaning 1 USD = 0.03 oz of Silver.
            # So Price of Silver = 1 / Rate.
            
            for code, rate in rates.items():
                price = 0.0
                if rate > 0:
                    price = 1.0 / rate # Convert to USD per Ounce
                    
                entry = {
                    'source': 'MetalPriceAPI',
                    'ticker': code,
                    'title': f"Spot Price {code}: ${price:.2f}",
                    'summary': f"Current spot price for {code} is ${price:.2f} USD/oz",
                    'full_text': f"Spot Price Update: {code} trading at ${price:.2f}",
                    'url': 'https://metalpriceapi.com',
                    'published_at': normalized_date,
                    'raw_data': str(data)
                }
                results.append(entry)
                print(f"   [+] {code}: ${price:.2f}")
                
            return results

        except Exception as e:
            print(f"   [!] Error fetching metal prices: {e}")
            return []

if __name__ == "__main__":
    import os
    from dotenv import load_dotenv
    
    # Load environment variables
    load_dotenv()
    
    key = os.getenv("METAL_PRICE_API_KEY")
    if not key:
        print("Error: METAL_PRICE_API_KEY not found in environment variables")
        print("Please set METAL_PRICE_API_KEY in your .env file")
    else:
        scraper = MetalPriceScraper(key)
        scraper.fetch_prices()
