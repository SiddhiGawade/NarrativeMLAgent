from sklearn.feature_extraction.text import CountVectorizer
from typing import List
import re

class NarrativeNamer:
    def __init__(self):
        # Stopwords specific to this domain that don't add "flavor" to the name
        self.custom_stop_words = [
            'silver', 'stock', 'stocks', 'price', 'market', 'trading', 'today', 
            'investors', 'analysis', 'forecast', 'outlook', 'prediction', 'news',
            'report', 'growth', 'future', 'trend', 'trends', 'buy', 'sell',
            'inc', 'corp', 'limited', 'ltd', 'company', 'shares', 'share',
            'rally', 'surge', 'jump', 'drop', 'fall', 'record', 'high', 'low',
            'bull', 'bear', 'bullish', 'bearish', 'vs', 'year', 'month', 'week',
            'day', 'review', 'preview', 'update', 'breaking', 'top', 'best',
            'is', 'it', 'to', 'in', 'for', 'of', 'on', 'and', 'the', 'a', 'an'
        ]

    def _clean_titles(self, titles: List[str]) -> List[str]:
        cleaned = []
        for t in titles:
            # Remove special chars and digits (mostly)
            t = re.sub(r'[^a-zA-Z\s]', '', t)
            cleaned.append(t.lower())
        return cleaned

    def generate_name(self, titles: List[str]) -> str:
        """
        Generates a 3-part label for a cluster of titles.
        Example: "Solar | Photovoltaic | Tech"
        """
        if not titles:
            return "Unknown Narrative"
            
        clean_docs = self._clean_titles(titles)
        
        # Use CountVectorizer to find frequent n-grams (1-word or 2-words)
        try:
            vectorizer = CountVectorizer(
                stop_words=self.custom_stop_words, 
                ngram_range=(1, 2), 
                max_features=10
            )
            X = vectorizer.fit_transform(clean_docs)
            
            # Get feature names and their counts
            feature_names = vectorizer.get_feature_names_out()
            counts = X.sum(axis=0).A1
            
            # Sort by count desc
            freq_distribution = sorted(zip(feature_names, counts), key=lambda x: x[1], reverse=True)
            
            # Take top 3 keywords
            top_keywords = [w[0].title() for w in freq_distribution[:3]]
            
            if not top_keywords:
                return "General Silver News"
                
            return " | ".join(top_keywords)
            
        except ValueError:
            # Happens if vocabulary is empty (all stop words)
            return "General Activity"
            
if __name__ == "__main__":
    # Test
    namer = NarrativeNamer()
    sample = [
        "First Solar (FSLR) Stock Sinks As Market Gains",
        "Solar ETF Jumps In Buy Zone",
        "Did First Solar's (FSLR) Legal Win on TOPCon Patents?"
    ]
    print(f"Name: {namer.generate_name(sample)}")
