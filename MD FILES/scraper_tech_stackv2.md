# Data Ingestion Layer V2 - Multi-Source Strategy

## 1. Why We Need V2 (The Volume Problem)
**Status Quo:** Yahoo Finance gives us ~10-20 high-quality articles per ticker per day.
**Problem:** To detect *emerging* narratives in the **Silver and Commodity markets**, we need:
1.  **Higher Volume**: Analysis of both Futures (`SI=F`) and ETFs (`SLV`, `PSLV`).
2.  **Sentiment Diversity**: Commodities are driven by macro factors (inflation, war) and retail hype (silver squeeze).
3.  **Faster Signal**: Twitter and specialized forums often react before mainstream news.

---

## 2. Expanded Tech Stack

| Component | Technology | Why Add This? |
| :--- | :--- | :--- |
| **Social Media** | **Reddit API (PRAW)** | The heartbeat of retail investors. Subreddits like `r/wallstreetbets`, `r/stocks`, `r/investing` are narrative factories. |
| **RSS Feeds** | **`feedparser` Library** | Getting headlines from CNBC, MarketWatch, TechCrunch without API keys/limits. |
| **Orchestrator** | **AsyncIO** | We need to fetch from multiple sources *concurrently* to keep it fast. |

---

## 3. Implementation Plan

### Source A: Reddit Scraper (The "Noise" & "Signal")
Refactoring to include a `RedditScraper` class.
-   **Targets**: `r/wallstreetbets`, `r/stocks`, `r/technology`, `r/artificial`, `r/investing`.
-   **Data Points**: Submission Title, Top Comment body (often contains the real sentiment), Score (Upvotes).
-   **Credential Requirement**: You will need to create a Reddit App (Client ID + Secret) - *Free and instant*.

### Source B: RSS Feeds (The "Breadth")
Adding a lightweight RSS parser for additional news volume.
-   **Feeds**: 
    -   CNBC Top News
    -   MarketWatch Market Pulse
    -   TechCrunch (for AI/Tech stocks)
-   **Advantage**: Zero authentication needed, highly reliable.

### Source C: Data Fusion (The "Mixer")
We can't just dump all this together. We need a `DataNormalizer` that standardizes:
-   `yfinance` (News)
-   `Reddit` (Social Post)
-   `RSS` (Blog/News)

Into a single schema:
```json
{
  "id": "unique_id",
  "text": "The combined title + body content",
  "timestamp": "ISO-8601",
  "source_type": "social|news",
  "source_name": "reddit/r/wsb | yahoo | cnbc",
  "meta": { "upvotes": 100, "author": "..." }
}
```

---

## 4. Execution Step for You

1.  **Get Reddit Credentials**: Go to `https://www.reddit.com/prefs/apps`, create a "Process" app.
    -   Name: `HackathonAgent`
    -   Redirect URI: `http://localhost:8080` (doesn't matter)
    -   Copy **Client ID** (under name) and **Client Secret**.
2.  **Update `task.md`**: Add Reddit Implementation.
3.  **I will write**:
    -   `reddit_scraper.py` (Needs your keys)
    -   `rss_scraper.py` (Works instantly)
    -   `main_ingestion.py` (Runs everything together)

This approach will easily 10x-50x your dataset size immediately.
