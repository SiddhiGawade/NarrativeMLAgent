print("Starting Full Import Test...")
try:
    import json
    import os
    import sys
    print("Core OK")
    import numpy as np
    print("Numpy OK")
    import pandas as pd
    print("Pandas OK")
    import matplotlib.pyplot as plt
    print("Matplotlib OK")
    import umap
    print("UMAP OK")
    import hdbscan
    print("HDBSCAN OK")
    
    print("Importing Transformers...")
    from transformers import pipeline
    nlp = pipeline("sentiment-analysis", model="yiyanghkust/finbert-tone")
    print("Transformers Model OK")

    print("Importing GenAI...")
    import google.generativeai as genai
    print("GenAI OK")

    print("ALL SUCCESS")
except Exception as e:
    print(f"FAIL: {e}")
