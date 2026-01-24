import yfinance as yf
import pprint

print("Starting Test...")
tickers = ["NVDA"]
for t in tickers:
    try:
        dat = yf.Ticker(t)
        news = dat.news
        if news:
            print(f"Sample Item for {t}:")
            pprint.pprint(news[0])
            print("Keys:", news[0].keys())
        else:
            print("No news found")
    except Exception as e:
        print(f"Error {t}: {e}")
print("Done.")
