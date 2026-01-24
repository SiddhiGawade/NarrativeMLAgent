# Narrative Sentiment Analysis Model

To classify the generated narratives about the **Silver** market as **Positive** (Bullish) or **Negative** (Bearish), we will use a specialized Large Language Model (LLM) fine-tuned for financial sentiment.

## Selected Model: FinBERT
**Model Name:** `yiyanghkust/finbert-tone` or `ProsusAI/finbert`

### Why FinBERT?
1.  **Domain Specificity**: Unlike standard BERT, FinBERT is pre-trained on a massive corpus of financial documents (corporate reports, earnings calls, financial news).
2.  **Context Awareness**: It understands that words like "volatility" or "correction" have specific financial implications that generic sentiment models might misinterpret.
3.  **Accuracy**: It consistently outperforms generic models (like VADER or standard BERT) in financial text classification tasks.

## Implementation Strategy

### Input
The "Generated Narrative" (the summary text of the cluster) + Representative Titles.

### Process
1.  **Tokenization**: The narrative text is tokenized using the FinBERT tokenizer.
2.  **Inference**: The model predicts the probability of three classes:
    *   **Positive**: Implies upward price pressure (Bullish).
    *   **Negative**: Implies downward price pressure (Bearish).
    *   **Neutral**: No clear directional signal.
3.  **Aggregation**: If the narrative is long, we may split it into sentences, classify each, and aggregate the score to determine the overall sentiment.

### Output
A sentiment label (`Positive`, `Negative`, `Neutral`) and a confidence score (e.g., `0.85`).

## Integration
This model will be integrated into the Python backend.
*   **Library**: `transformers` (Hugging Face)
*   **Pipeline**: `sentiment-analysis`

```python
from transformers import pipeline

nlp = pipeline("sentiment-analysis", model="yiyanghkust/finbert-tone")
results = nlp(["Silver prices soar amid rising inflation fears.", "Industrial demand for silver weakens."])
# Output: [{'label': 'Positive', 'score': ...}, {'label': 'Negative', 'score': ...}]
```
