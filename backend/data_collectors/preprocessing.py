import re
import datetime

def clean_text(text: str) -> str:
    """
    Basic text preprocessing:
    - Removes extra whitespace
    - Removes urls
    - Keeps standard punctuation for now (models are robust)
    """
    if not text:
        return ""
    
    # Remove URLs
    text = re.sub(r'http\S+', '', text)
    
    # Remove newlines and extra spaces
    text = text.replace('\n', ' ').strip()
    text = re.sub(r'\s+', ' ', text)
    
    return text

def normalize_date(date_obj) -> str:
    """Ensures date is in ISO format YYYY-MM-DD"""
    if isinstance(date_obj, (datetime.datetime, datetime.date)):
        return date_obj.strftime("%Y-%m-%d")
    return str(date_obj)
