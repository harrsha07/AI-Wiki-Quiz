import sys
import os

# Add the parent directory to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
import json
from typing import List
import logging

from models.database import Quiz
from models.quiz_models import QuizCreate, QuizResponse, QuizHistoryResponse, APIResponse
from scraper import scrape_wikipedia
from llm_quiz_generator import generate_quiz_from_content
from utils.security import sanitize_input, sanitize_wikipedia_url

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def generate_quiz_controller(quiz_request: QuizCreate, db: Session) -> APIResponse:
    """
    Generate a quiz from a Wikipedia URL.
    """
    try:
        logger.info(f"Generating quiz for URL: {quiz_request.url}")
        
        # Sanitize and validate the URL
        sanitized_url = sanitize_wikipedia_url(str(quiz_request.url))
        
        # Scrape the Wikipedia article
        scraped_content, title, summary, sections = scrape_wikipedia(sanitized_url)
        
        # Generate quiz using LLM
        quiz_data = generate_quiz_from_content(scraped_content)
        
        # Filter questions by difficulty if specified
        if quiz_request.difficulty and quiz_request.difficulty != 'all' and 'quiz' in quiz_data:
            filtered_questions = [q for q in quiz_data['quiz'] if q.get('difficulty', '').lower() == quiz_request.difficulty.lower()]
            quiz_data['quiz'] = filtered_questions
        
        # Ensure the quiz_data has all required fields
        if "summary" not in quiz_data or not quiz_data["summary"]:
            quiz_data["summary"] = summary
        if "sections" not in quiz_data or not quiz_data["sections"]:
            quiz_data["sections"] = sections
        if "title" not in quiz_data or not quiz_data["title"]:
            quiz_data["title"] = title
        
        # Save to database
        quiz_record = Quiz(
            url=sanitized_url,
            title=title,
            scraped_content=scraped_content,
            full_quiz_data=json.dumps(quiz_data)  # Serialize to JSON string
        )
        
        db.add(quiz_record)
        db.commit()
        db.refresh(quiz_record)
        
        # Return the quiz data with database ID
        response_data = quiz_data.copy()
        response_data["id"] = quiz_record.id
        response_data["url"] = sanitized_url
        response_data["date_generated"] = quiz_record.date_generated
        
        logger.info(f"Successfully generated quiz with ID: {quiz_record.id}")
        
        return APIResponse(
            success=True,
            data=response_data,
            message="Quiz generated successfully"
        )
    
    except Exception as e:
        logger.error(f"Error generating quiz: {str(e)}")
        db.rollback()
        raise e

async def get_quiz_history_controller(db: Session) -> APIResponse:
    """
    Get a list of all generated quizzes.
    """
    try:
        logger.info("Fetching quiz history")
        quizzes = db.query(Quiz).all()
        logger.info(f"Successfully fetched {len(quizzes)} quizzes")
        
        quiz_list = []
        for quiz in quizzes:
            quiz_list.append({
                "id": quiz.id,
                "url": quiz.url,
                "title": quiz.title,
                "date_generated": quiz.date_generated
            })
        
        return APIResponse(
            success=True,
            data={"quizzes": quiz_list},
            message="Quiz history fetched successfully"
        )
    
    except Exception as e:
        logger.error(f"Error fetching quiz history: {str(e)}")
        raise e

async def get_quiz_by_id_controller(quiz_id: int, db: Session) -> APIResponse:
    """
    Get a specific quiz by ID.
    """
    try:
        logger.info(f"Fetching quiz with ID: {quiz_id}")
        quiz_record = db.query(Quiz).filter(Quiz.id == quiz_id).first()
        if not quiz_record:
            raise ValueError("Quiz not found")
        
        try:
            # Deserialize the quiz data
            quiz_data = json.loads(quiz_record.full_quiz_data.decode() if isinstance(quiz_record.full_quiz_data, bytes) else str(quiz_record.full_quiz_data))
            
            # Add database fields
            quiz_data["id"] = quiz_record.id
            quiz_data["url"] = quiz_record.url
            quiz_data["date_generated"] = quiz_record.date_generated
            
            logger.info(f"Successfully fetched quiz with ID: {quiz_id}")
            
            return APIResponse(
                success=True,
                data=quiz_data,
                message="Quiz fetched successfully"
            )
        
        except Exception as e:
            logger.error(f"Error deserializing quiz data: {str(e)}")
            raise ValueError(f"Error deserializing quiz data: {str(e)}")
    
    except Exception as e:
        logger.error(f"Error fetching quiz: {str(e)}")
        raise e