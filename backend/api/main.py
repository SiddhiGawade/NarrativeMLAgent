from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
import os

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from backend.processing.check_model_accuracy import calculate_metrics

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VEC_FILE = os.path.join(BASE_DIR, 'silver_vectors.json')
SCATTER_FILE = os.path.join(BASE_DIR, 'silver_scatter.json')

@app.get("/api/metrics")
def get_metrics():
    metrics = calculate_metrics(VEC_FILE, SCATTER_FILE)
    return metrics

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
