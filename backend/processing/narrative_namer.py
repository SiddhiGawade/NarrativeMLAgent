import google.generativeai as genai
from typing import List, Dict
import os
import time

from backend.processing.sentiment import NarrativeSentiment

class NarrativeNamer:
    def __init__(self, api_key: str = None):
        # Use provided key or env var
        self.api_key = api_key or "AIzaSyCHoP2pFhdjt3qmsoC4zHfTdcIVJPkSMlc"
        genai.configure(api_key=self.api_key)
        try:
            self.model = genai.GenerativeModel('gemini-1.5-flash')
        except:
            self.model = genai.GenerativeModel('gemini-pro')
            
        # Initialize Sentiment Analyzer
        self.sentiment_analyzer = NarrativeSentiment()

    def generate_name(self, titles: List[str]) -> Dict[str, str]:
        """
        Uses Gemini to generate a meaningful title and summary for a cluster of articles.
        Returns: {'title': str, 'summary': str}
        """
        if not titles:
            return {'title': "Unknown Narrative", 'summary': "No data available."}
            
        # Context window management - take unique titles, max 15
        unique_titles = list(set(titles))[:15]
        titles_text = "\n".join([f"- {t}" for t in unique_titles])
        
        prompt = f"""
        Analyze the following news headlines about Silver and the Commodity Market:
        {titles_text}

        1. Identify the single most specific Event or Trend connecting these stories.
        2. Write a short, punchy 3-6 word Title for this narrative (No "Silver" prefix needed if obvious).
        3. Write a 2-sentence summary explaining what is happening.

        Output strictly in this format:
        TITLE: [Your Title Here]
        SUMMARY: [Your Summary Here]
        """
        
        try:
            # Add delay to avoid rate limits if processed in loop
            time.sleep(1.1) 
            response = self.model.generate_content(prompt)
            text = response.text
            
            # Parse output
            title = "Unidentified Trend"
            summary = "Analysis failed."
            
            for line in text.split('\n'):
                if line.startswith('TITLE:'):
                    title = line.replace('TITLE:', '').strip()
                elif line.startswith('SUMMARY:'):
                    summary = line.replace('SUMMARY:', '').strip()
                    
            # Fallback cleanup
            title = title.replace('"', '').replace('*', '')

            # Sentiment Analysis
            sentiment_result = self.sentiment_analyzer.analyze(summary)
            
            return {
                'title': title, 
                'summary': summary,
                'sentiment': sentiment_result
            }

        except Exception as e:
            print(f"   [!] Gemini Error: {e}")
            # Fallback to first title
            return {
                'title': titles[0][:50] + "...", 
                'summary': "AI generation unavailable. See headlines for details."
            }

if __name__ == "__main__":
    namer = NarrativeNamer()
    sample = [
        "First Solar (FSLR) Stock Sinks As Market Gains",
        "Solar ETF Jumps In Buy Zone",
        "Did First Solar's (FSLR) Legal Win on TOPCon Patents?"
    ]
    print(namer.generate_name(sample))
