# Data Ingestion Layer - Technical Explanation

## Overview
The Data Ingestion Layer is the "eyes" of the Narrative Detection Agent. Its purpose is to continuously fetch high-quality, real-time textual data from financial markets to feed into the ML pipeline.

## Technology Stack

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Language** | **Python 3.10** | Core logic execution. |
| **Data Source** | **Yahoo Finance API** | Primary source for high-volume, real-time financial news. |
| **Library** | **`yfinance`** | A popular open-source library that wraps Yahoo Finance's internal APIs to fetch market data and news without requiring a paid Bloomberg terminal. |
| **Preprocessing** | **RegEx (`re`)** | Custom text cleaning to remove noise (URLs, excessive whitespace). |

## How It Works (The "Secret Sauce")

### 1. The Source
We utilize `yfinance`, which reverse-engineers the internal API calls used by the `finance.yahoo.com` website.
-   **Why this?** It provides institutional-grade news feeds (Bloomberg, Reuters, Yahoo Finance Video) for free, which is critical for a hackathon MVP.

### 2. The Extraction Logic (`NewsScraper`)
When we query a ticker like **NVDA (Nvidia)**:
1.  **Request**: The scraper hits the endpoint associated with the ticker.
2.  **Raw Payload**: We receive a complex JSON object containing nested metadata (videos, stories, third-party articles).
3.  **Normalization**: Our script (`news_scraper.py`) parses this JSON tree.
    -   It looks for specific keys: `title`, `summary`, and `pubDate`.
    -   *Robustness*: It handles different data shapes (e.g., Video content vs. Text articles have different structures).

### 3. Preprocessing (`clean_text`)
Raw web data is noisy. We apply a cleaning pipeline before the ML model sees a single byte:
-   **URL Removal**: Uses Regular Expressions to strip `http://...` links which confuse semantic embedding models.
-   **Whitespace Normalization**: Converts messy multi-line text into clean, single-paragraph strings.
-   **Content Merging**: We combine the **Headline** and the **Summary** into a single `full_text` field to provide maximum context for the clustering engine.

## Example Output Explained
In `scraper_results.txt`, you see:

> `[NVDA] Nvidia CEO Jensen Huang in Shanghai amid China regs... | 2026-01-24`

-   **[NVDA]**: The target entity (Context).
-   **Text**: The cleaned, combined headline representing a potential signal.
-   **Date**: ISO-formatted timestamp. This is crucial for the "Temporal Tracking" feature of the agent (detecting *when* a narrative starts).
