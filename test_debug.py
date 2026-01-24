print("Testing Imports...")

try:
    import numpy
    print("Numpy OK")
except Exception as e:
    print(f"Numpy Fail: {e}")

try:
    import torch
    print("Torch OK")
except Exception as e:
    print(f"Torch Fail: {e}")

try:
    from transformers import pipeline
    print("Transformers Pipeline Import OK")
    nlp = pipeline("sentiment-analysis", model="yiyanghkust/finbert-tone")
    print("FinBERT Model Loaded OK")
except Exception as e:
    print(f"Transformers Model Fail: {e}")

try:
    import umap
    print("UMAP OK")
except Exception as e:
    print(f"UMAP Fail: {e}")

try:
    import hdbscan
    print("HDBSCAN OK")
except Exception as e:
    print(f"HDBSCAN Fail: {e}")

print("Done.")
