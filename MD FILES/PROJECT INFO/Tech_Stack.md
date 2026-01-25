# Tech Stack

## Overview
Echelon 2.0 uses a modern **Microservices Architecture**, separating the heavy AI processing (Backend) from the interactive visualization (Frontend).

## 1. Frontend (The Dashboard)
*   **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/) - For lightning-fast rendering and development experience.
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) - For a custom, premium, responsive UI (Dark/Light mode).
*   **Icons**: [Lucide React](https://lucide.dev/) - Clean, lightweight SVG icons.
*   **Visualization**: Custom SVG components & Canvas for the Narrative Map.
*   **State Management**: React Hooks (`useState`, `useEffect`, `useContext`).

## 2. Backend (The Brain)
*   **Language**: [Python 3.9+](https://www.python.org/) - The industry standard for AI and Data Science.
*   **API Framework**: [FastAPI](https://fastapi.tiangolo.com/) - High-performance async web framework to serve data to the frontend.
*   **Process Management**: `main_pipeline.py` orchestrates the data flow.

## 3. Data Science & AI (The Engine)
*   **Data Manipulation**: [Pandas](https://pandas.pydata.org/) & [NumPy](https://numpy.org/) - For structured data handling.
*   **Machine Learning**: [Scikit-learn](https://scikit-learn.org/) - For clustering algorithms (DBSCAN, K-Means).
*   **Embeddings**: [Transformers](https://huggingface.co/docs/transformers/index) / [Sentence-Transformers](https://www.sbert.net/) - To convert text into vector representations.
*   **Sentiment Analysis**: NLTK / VADER / Transformer-based sentiment models.
*   **Dimensionality Reduction**: PCA / t-SNE (implied for visualization) - To project high-dimensional narrative vectors onto a 2D map.

## 4. Infrastructure & Hosting
*   **Backend Hosting**: [Render](https://render.com/) - Auto-deploy from Git, handles Python environments.
*   **Frontend Hosting**: [Vercel](https://vercel.com/) / [Netlify](https://www.netlify.com/) (Recommended) or served statically.
*   **Version Control**: [Git](https://git-scm.com/) & GitHub.

## 5. External APIs (Data Sources)
*   **Yahoo Finance API** (`yfinance`): For real-time commodity price data (Silver, Gold).
*   **News APIs**: (e.g., NewsAPI, GNews) to fetch headlines.
*   **Custom Scrapers**: Python scripts in `data_collectors/` to fetch specialized data.
