from pydantic import BaseModel, HttpUrl, validator
from typing import List, Optional
from datetime import datetime

class Question(BaseModel):
    question: str
    options: List[str]
    answer: str
    difficulty: str
    explanation: str

    @validator('difficulty')
    def validate_difficulty(cls, v):
        if v.lower() not in ['easy', 'medium', 'hard']:
            raise ValueError('Difficulty must be easy, medium, or hard')
        return v.lower()

class KeyEntities(BaseModel):
    people: List[str]
    organizations: List[str]
    locations: List[str]

class QuizOutput(BaseModel):
    title: str
    summary: str
    key_entities: KeyEntities
    sections: List[str]
    quiz: List[Question]
    related_topics: List[str]

class QuizCreate(BaseModel):
    url: HttpUrl
    difficulty: Optional[str] = None

    @validator('difficulty')
    def validate_difficulty(cls, v):
        if v and v.lower() not in ['all', 'easy', 'medium', 'hard']:
            raise ValueError('Difficulty must be all, easy, medium, or hard')
        return v.lower() if v else None

    @validator('url')
    def validate_wikipedia_url(cls, v):
        if 'wikipedia.org' not in str(v):
            raise ValueError('URL must be a Wikipedia article')
        return v

class QuizResponse(QuizOutput):
    id: int
    url: HttpUrl
    date_generated: datetime
    
    class Config:
        from_attributes = True

class QuizHistoryResponse(BaseModel):
    id: int
    url: HttpUrl
    title: str
    date_generated: datetime
    
    class Config:
        from_attributes = True

class APIResponse(BaseModel):
    success: bool
    data: Optional[dict] = None
    message: Optional[str] = None
    error: Optional[str] = None