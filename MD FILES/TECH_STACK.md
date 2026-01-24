# Project Tech Stack

## Frontend

The frontend is built with a modern React stack, focusing on performance and developer experience.

*   **Core Framework**: [React 19](https://react.dev/)
*   **Build Tool**: [Vite 7](https://vitejs.dev/) - Fast bundler and development server.
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) - Utility-first CSS framework (using the new Vite plugin).
*   **Routing**: [React Router DOM v7](https://reactrouter.com/)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/) - For complex animations and page transitions.
*   **Icons**: [Lucide React](https://lucide.dev/) - Clean, consistent icon set.
*   **Charts/Visualization**: [Recharts](https://recharts.org/) - Composable charting library for React.
*   **Utilities**: `clsx`, `tailwind-merge` - For dynamic class name management.

## Backend (Data & Processing)

The backend is a Python-based data pipeline responsible for fetching, analyzing, and clustering market narratives.

*   **Language**: Python 3.x
*   **Data Collection**:
    *   `yfinance`: For fetching financial news and stock data from Yahoo Finance.
    *   `requests` / `BeautifulSoup` (implied): For web scraping content.
*   **AI & Machine Learning**:
    *   `sentence-transformers`: For generating text embeddings (e.g., `all-MiniLM-L6-v2`) to semanticize news titles.
    *   `google-generativeai`: Google Gemini API for generating narrative titles and summaries.
    *   `umap-learn`: For dimensionality reduction of high-dimensional embeddings.
    *   `hdbscan`: For hierarchical density-based clustering of narratives.
*   **Data Manipulation**:
    *   `pandas`: For data structuring and DataFrame operations.
    *   `numpy`: For numerical operations and array handling.
*   **Visualization**:
    *   `matplotlib`: For generating static cluster maps (saved as images).

## Infrastructure & Tools

*   **Package Management**: `npm` (Frontend), `pip` (Backend).
*   **Linting**: `ESLint` (Frontend).

## Process Model (Data Ingestion to Naming)

The data pipeline follows a sequential "Silver Narrative Agent" flow:

1.  **Data Ingestion (`news_scraper.py`)**
    *   Fetches latest news and market data for target tickers (e.g., Silver miners, Solar stocks) using `yfinance`.
    *   Raw data is normalized into a standard dictionary format.

2.  **Preprocessing**
    *   Text cleaning (removing noise) and date normalization.

3.  **Vectorization (`vectorizer.py`)**
    *   Uses `sentence-transformers` (model: `all-MiniLM-L6-v2`) to convert article titles and summaries into high-dimensional numerical vectors (embeddings).

4.  **Clustering Engine (`cluster_engine.py`)**
    *   **Dimensionality Reduction**: Uses `UMAP` to compress vectors from 384 dimensions to 2 dimensions for visualization and easier clustering.
    *   **Topic Discovery**: Uses `HDBSCAN` to find dense clusters of semantically similar articles (narratives) and identify outlier noise.

5.  **Narrative Naming (`narrative_namer.py`)**
    *   Sends a batch of titles from each identified cluster to the **Google Gemini API**.
    *   Gemini generates a specific, punchy title and a short summary for the narrative trend.

6.  **Output & Utilization**
    *   Results are saved as JSON files (`silver_clusters.json`, `silver_scatter.json`) which the Frontend consumes to display the Narrative Map and lists.
