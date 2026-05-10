import os
import sys
import os

# Add the parent directory to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Try to import the most compatible version
try:
    from langchain_google_genai import ChatGoogleGenerativeAI  # type: ignore
except ImportError:
    try:
        from langchain_community.chat_models import ChatGooglePalm
        # Create an alias for compatibility
        ChatGoogleGenerativeAI = ChatGooglePalm  # type: ignore
    except ImportError:
        from langchain_community.llms import GooglePalm
        # Create an alias for compatibility
        class ChatGoogleGenerativeAI:
            def __init__(self, *args, **kwargs):
                self.llm = GooglePalm(*args, **kwargs)
            
            def __call__(self, *args, **kwargs):
                return self.llm(*args, **kwargs)
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.exceptions import OutputParserException
from pydantic import BaseModel
from models.quiz_models import QuizOutput
import json

def initialize_llm():
    """Initialize the Gemini LLM with API key from environment variables."""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found in environment variables")
    
    # Check if we have the newer class or our wrapper
    if hasattr(ChatGoogleGenerativeAI, 'llm'):
        # We're using our wrapper class
        llm = ChatGoogleGenerativeAI(
            model="models/gemini-pro-latest",
            google_api_key=api_key,
            temperature=0.7
        )
    else:
        try:
            llm = ChatGoogleGenerativeAI(
                model="models/gemini-pro-latest",
                google_api_key=api_key,
                temperature=0.7
            )
        except Exception:
            try:
                # Fallback for older versions
                llm = ChatGoogleGenerativeAI(
                    model="models/gemini-pro-latest",
                    google_api_key=api_key,
                    temperature=0.7
                )
            except Exception:
                # Another fallback for even older versions
                llm = ChatGoogleGenerativeAI(
                    model="models/gemini-pro-latest",
                    google_api_key=api_key,
                    temperature=0.7
                )
    return llm

def generate_quiz_from_content(content: str) -> dict:
    """
    Generate a quiz from the provided content using LangChain and Gemini.
    
    Args:
        content (str): The cleaned Wikipedia article content
        
    Returns:
        dict: The generated quiz in JSON format
    """
    try:
        # Initialize LLM
        llm = initialize_llm()
        
        # Set up the parser
        parser = JsonOutputParser(pydantic_object=QuizOutput)  # type: ignore
        
        # Create prompt template
        prompt_template = PromptTemplate(
            template="""
            You are an expert quiz generator. Based on the provided Wikipedia article content, 
            create an educational and engaging quiz with 5-10 questions.
            
            Guidelines:
            1. Create 5-10 multiple-choice questions
            2. Each question should have 4 options (A, B, C, D)
            3. Clearly indicate the correct answer
            4. Provide a brief explanation for each answer
            5. Assign a difficulty level (easy, medium, hard) to each question based on the complexity of the concept
            6. Extract 3-5 related topics for further reading
            7. Identify key entities (people, organizations, locations) from the article
            8. Provide a brief summary of the article
            9. Extract main sections of the article
            
            If a difficulty level is specified, prioritize questions of that difficulty:
            - Easy: Basic facts and definitions
            - Medium: Analysis and interpretation of concepts
            - Hard: Complex reasoning and synthesis of multiple concepts
            
            Article Content:
            {content}
            
            {format_instructions}
            
            QUIZ:""",
            input_variables=["content"],
            partial_variables={"format_instructions": parser.get_format_instructions()}
        )
        
        # Create chain
        chain = prompt_template | llm | parser
        
        # Generate quiz
        quiz_data = chain.invoke({"content": content[:4000]})  # Limit content length
        
        return quiz_data
    
    except OutputParserException as e:
        raise Exception(f"Error parsing LLM output: {str(e)}")
    except Exception as e:
        raise Exception(f"Error generating quiz: {str(e)}")