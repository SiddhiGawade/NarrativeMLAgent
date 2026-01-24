import yfinance as yf
import json

data = []
try:
    stock = yf.Ticker("NVDA")
    news = stock.news
    # limit to 2 items
    data = news[:2]
except Exception as e:
    data = {"error": str(e)}

with open("backend/dump_news.json", "w") as f:
    json.dump(data, f, indent=2, default=str)
