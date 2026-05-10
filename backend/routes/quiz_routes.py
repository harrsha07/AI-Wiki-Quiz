from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import json

from models.quiz_models import QuizCreate, QuizResponse, QuizHistoryResponse, APIResponse
from models.database import get_db
from controllers.quiz_controller import generate_quiz_controller, get_quiz_history_controller, get_quiz_by_id_controller

router = APIRouter()

@router.post("/generate_quiz", response_model=APIResponse)
async def generate_quiz(quiz_request: QuizCreate, db: Session = Depends(get_db)):
    """
    Generate a quiz from a Wikipedia URL.
    """
    try:
        return await generate_quiz_controller(quiz_request, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history", response_model=APIResponse)
async def get_quiz_history(db: Session = Depends(get_db)):
    """
    Get a list of all generated quizzes.
    """
    try:
        return await get_quiz_history_controller(db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/quiz/{quiz_id}", response_model=APIResponse)
async def get_quiz(quiz_id: int, db: Session = Depends(get_db)):
    """
    Get a specific quiz by ID.
    """
    try:
        return await get_quiz_by_id_controller(quiz_id, db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))