import torch
from transformers import pipeline, AutoTokenizer, AutoModelForSequenceClassification

class NarrativeSentiment:
    def __init__(self):
        print("[Sentiment] Loading FinBERT model...")
        try:
            # use a smaller/faster variant if available, or the standard one
            # 'yiyanghkust/finbert-tone' is good for 3 classes (Positive, Negative, Neutral)
            model_name = "yiyanghkust/finbert-tone" 
            self.nlp = pipeline("sentiment-analysis", model=model_name, tokenizer=model_name)
        except Exception as e:
            print(f"[!] Error loading FinBERT: {e}")
            self.nlp = None

    def analyze(self, text: str) -> dict:
        """
        Analyzes the text and returns a dictionary with label and score.
        Label: 'Positive' | 'Negative' | 'Neutral'
        """
        if not self.nlp or not text:
            # Fallback if model failed to load
            return {'label': 'Neutral', 'score': 0.0}

        try:
            # Truncate text to 512 tokens approx (chars/4) to avoid errors
            truncated_text = text[:2000] 
            result = self.nlp(truncated_text)[0]
            
            # Map labels if necessary (the model returns "Positive", "Negative", "Neutral")
            return {
                'label': result['label'],
                'score': result['score']
            }
        except Exception as e:
            print(f"[!] Sentiment Inference Error: {e}")
            return {'label': 'Neutral', 'score': 0.0}

if __name__ == "__main__":
    # Test
    analyzer = NarrativeSentiment()
    samples = [
        "Silver prices soar as demand hits record high.",
        "Mining output drops significantly causing supply fears.",
        "Market remains stable with no major changes."
    ]
    for s in samples:
        print(f"Text: {s}\nResult: {analyzer.analyze(s)}\n")
