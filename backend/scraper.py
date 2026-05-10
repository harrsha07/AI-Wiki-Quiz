import requests
from bs4 import BeautifulSoup
from bs4.element import Tag, NavigableString
import re
from typing import List, Union

def scrape_wikipedia(url: str) -> tuple[str, str, str, list]:
    """
    Scrape the main content of a Wikipedia article.
    
    Args:
        url (str): The URL of the Wikipedia article
        
    Returns:
        tuple[str, str, str, list]: A tuple containing (clean_text, title, summary, sections)
    """
    try:
        # Fetch the webpage with comprehensive headers
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        }
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        
        # Parse the HTML content
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Extract the title
        title_element = soup.find('h1', {'class': 'firstHeading'})
        title = title_element.get_text() if title_element else "Unknown Title"
        
        # Extract the main content
        content_div = soup.find('div', {'id': 'mw-content-text'})
        if not content_div:
            raise ValueError("Could not find main content div")
        
        # Extract summary (first paragraph)
        first_paragraph = content_div.find('p')  # type: ignore
        summary = first_paragraph.get_text().strip() if first_paragraph else ""  # type: ignore
        
        # Extract section headings
        section_headings = content_div.find_all(['h2', 'h3'])  # type: ignore
        sections = []
        for heading in section_headings:
            heading_text = heading.get_text().strip()
            # Remove "[edit]" text from headings
            heading_text = re.sub(r'\[edit\]', '', heading_text)
            if heading_text and heading_text not in ['Contents', 'Navigation menu', 'See also', 'References', 'External links', 'Further reading']:
                sections.append(heading_text)
        
        # Remove unwanted elements
        for element in content_div.find_all(['script', 'style', 'sup', 'table']):  # type: ignore
            element.decompose()
        
        # Extract paragraphs
        paragraphs = content_div.find_all('p')  # type: ignore
        clean_text = ""
        
        for p in paragraphs:
            # Remove reference links
            for ref in p.find_all('sup'):  # type: ignore
                ref.decompose()
            
            text = p.get_text().strip()
            if text:
                clean_text += text + "\n\n"
        
        # Clean up the text
        clean_text = re.sub(r'\[\d+\]', '', clean_text)  # Remove citation brackets
        clean_text = re.sub(r'\[edit\]', '', clean_text)  # Remove edit tags
        clean_text = re.sub(r'\n{3,}', '\n\n', clean_text)  # Remove excessive newlines
        
        return clean_text.strip(), title, summary, sections
    
    except Exception as e:
        raise Exception(f"Error scraping Wikipedia: {str(e)}")