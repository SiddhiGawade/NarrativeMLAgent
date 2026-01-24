# Silver Narrative Agent (Autonomous Pattern Hunter)

A sophisticated data pipeline designed to detect emerging narratives in the Silver and Commodity markets. This agent ingests data from multiple sources, processes it for sentiment and relevance, and prepares it for AI clustering.

## 🚀 Features

*   **Multi-Source Ingestion**:
    *   **Financial News**: Tracks 19 tickers including Miners (`AG`, `PAAS`), ETFs (`SLV`), and Industrial players (`FSLR`).
    *   **Commodity RSS**: Aggregates news from Kitco, SilverSeek, Mining.com, and more.
    *   **Real-Time Spot Prices**: Integrates MetalPriceAPI for XAG/XAU rates.
    *   **Social Sentiment**: Fetches Twitter/X discussions on #SilverSqueeze.
*   **Intelligent Processing**:
    *   **Strict Filtering**: Removes general political/macro noise to focus on Silver.
    *   **Sentiment Analysis**: Scores narratives from Bullish to Bearish.
    *   **Vectorization**: Converts texts into 384-dimensional embeddings using `all-MiniLM-L6-v2`.

## 🛠️ Installation

1.  **Clone the repository**:
    ```bash
    git clone <your-repo-url>
    cd Echelon2.0
    ```

2.  **Install Dependencies**:
    ```bash
    pip install requests pandas yfinance feedparser textblob sentence-transformers
    # Optional for future steps:
    # pip install umap-learn hdbscan
    ```

## 🏃 Usage

### 1. Run the Main Pipeline
Collects data, processes it, and saves to `backend/silver_data.json`.
```bash
python backend/main_pipeline.py
```

### 2. Generate Embeddings
Converts the collected data into vectors for clustering.
```bash
python backend/processing/vectorizer.py
```
Output saved to: `backend/silver_vectors.json`.

## 📂 Project Structure

```
Echelon2.0/
├── backend/
│   ├── data_collectors/       # Scrapers (News, RSS, Twitter, Metal)
│   ├── processing/            # Logic (Processor, Vectorizer)
│   ├── main_pipeline.py       # Orchestrator script
│   ├── silver_data.json       # Processed Data (Output)
│   └── silver_vectors.json    # Embeddings (Output)
├── MD FILES/                  # Documentation & Plans
└── README.md
```

## 🗺️ Roadmap

-   [x] **Phase 1**: Data Sources (News, RSS, API, Social)
-   [x] **Phase 2**: Processing (Sentiment, Cleaning, JSON Storage)
-   [x] **Phase 3**: Vectorization (Embeddings)
-   [ ] **Phase 4**: Dimensionality Reduction (UMAP)
-   [ ] **Phase 5**: Clustering & Topic Detection (HDBSCAN)

---
*Built for the Alpha Echelon Narrative Detection Challenge.*
