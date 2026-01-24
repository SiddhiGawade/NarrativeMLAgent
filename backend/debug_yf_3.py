import yfinance as yf

print("DEBUG_START")
try:
    stock = yf.Ticker("NVDA")
    news = stock.news
    if news:
        item = news[0]
        for k in item.keys():
            print(f"KEY: {k}")
            print(f"VAL: {item[k]}")
    else:
        print("NO NEWS")
except Exception as e:
    print(e)
print("DEBUG_END")
