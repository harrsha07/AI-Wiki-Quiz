from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os

# Database setup - using SQLite by default, but can be changed to MySQL or PostgreSQL
# For MySQL: mysql+pymysql://user:password@host:port/dbname
# For PostgreSQL: postgresql+psycopg2://user:password@host:port/dbname

# Use environment variable for database URL, fallback to SQLite
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./quiz_history.db")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Quiz(Base):
    __tablename__ = "quizzes"
    
    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, index=True)
    title = Column(String)
    date_generated = Column(DateTime, default=datetime.utcnow)
    scraped_content = Column(Text)  # For Bonus
    full_quiz_data = Column(Text)   # Store JSON as text

# Create tables
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()