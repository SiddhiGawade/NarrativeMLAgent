from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from backend.processing.check_model_accuracy import calculate_metrics

app = FastAPI(title="Echelon 2.0 API", version="1.0.0")

# Get CORS origins from environment variable or use default for development
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VEC_FILE = os.path.join(BASE_DIR, 'silver_vectors.json')
SCATTER_FILE = os.path.join(BASE_DIR, 'silver_scatter.json')

@app.get("/")
def health_check():
    """Health check endpoint for deployment monitoring"""
    return {"status": "healthy", "service": "Echelon 2.0 API", "version": "1.0.0"}

@app.get("/api/metrics")
def get_metrics():
    metrics = calculate_metrics(VEC_FILE, SCATTER_FILE)
    return metrics

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
