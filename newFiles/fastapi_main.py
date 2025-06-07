# app/main.py
from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.database.connection import get_db, engine
from app.database.models import Base
from app.api.routes import leads, automation, scraping, contracts, analytics
from app.core.config import settings
import uvicorn

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="LeadGen Pro API",
    description="Real Estate Lead Generation and Automation API",
    version="1.0.0"
)

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:4028"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(leads.router, prefix="/api/leads", tags=["leads"])
app.include_router(automation.router, prefix="/api/automation", tags=["automation"])
app.include_router(scraping.router, prefix="/api/scraping", tags=["scraping"])
app.include_router(contracts.router, prefix="/api/contracts", tags=["contracts"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["analytics"])

@app.get("/")
async def root():
    return {
        "message": "LeadGen Pro API",
        "version": "1.0.0",
        "status": "active"
    }

@app.get("/health")
async def health_check(db: Session = Depends(get_db)):
    try:
        # Simple database connectivity check
        db.execute("SELECT 1")
        return {
            "status": "healthy",
            "database": "connected",
            "timestamp": "2024-01-20T10:30:00Z"
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail="Database connection failed")

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )

# app/database/connection.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# SQLite database setup
SQLALCHEMY_DATABASE_URL = f"sqlite:///{settings.DATABASE_PATH}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}  # SQLite specific
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """Database dependency for FastAPI"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# app/core/config.py
from pydantic import BaseSettings
import os

class Settings(BaseSettings):
    # Database
    DATABASE_PATH: str = "leadgen_pro.db"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-this"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # External APIs
    GMAIL_CLIENT_ID: str = ""
    GMAIL_CLIENT_SECRET: str = ""
    LINE_CHANNEL_ACCESS_TOKEN: str = ""
    
    # Scraping configuration
    FACEBOOK_RATE_LIMIT: int = 3  # Seconds between requests
    MAX_DAILY_REQUESTS: int = 1000
    
    # Thai NLP
    THAI_NLP_MODEL: str = "pythainlp"
    
    class Config:
        env_file = ".env"

settings = Settings()

# requirements.txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
pydantic==2.5.0
python-multipart==0.0.6
aiofiles==23.2.1
beautifulsoup4==4.12.2
playwright==1.40.0
pandas==2.1.4
requests==2.31.0
python-dotenv==1.0.0
celery==5.3.4
redis==5.0.1
pythainlp==4.0.2
google-api-python-client==2.108.0
line-bot-sdk==3.5.0
schedule==1.2.0
cryptography==41.0.8
passlib[bcrypt]==1.7.4
python-jose[cryptography]==3.3.0