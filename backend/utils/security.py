import re
from urllib.parse import urlparse

def sanitize_input(text: str) -> str:
    """
    Sanitize user input to prevent XSS and other attacks.
    """
    # Remove any HTML tags
    text = re.sub(r'<[^>]*>', '', text)
    
    # Escape special characters
    text = text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
    text = text.replace('"', '&quot;').replace("'", '&#x27;')
    
    return text.strip()

def validate_wikipedia_url(url: str) -> bool:
    """
    Validate that the URL is a Wikipedia article.
    """
    try:
        parsed = urlparse(url)
        return (
            parsed.scheme in ['http', 'https'] and
            'wikipedia.org' in parsed.netloc and
            '/wiki/' in parsed.path
        )
    except Exception:
        return False

def sanitize_wikipedia_url(url: str) -> str:
    """
    Sanitize and validate Wikipedia URL.
    """
    # Remove any trailing whitespace
    url = url.strip()
    
    # Ensure it has a scheme
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url
    
    # Validate the URL
    if not validate_wikipedia_url(url):
        raise ValueError("Invalid Wikipedia URL")
    
    return url