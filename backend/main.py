from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# Removed TrustedHostMiddleware to avoid potential conflicts with Render
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import os

from routes.quiz_routes import router as quiz_router

# Load environment variables
load_dotenv()

app = FastAPI(title="AI Wiki Quiz Generator")

# Add security headers middleware
@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

# Add CORS middleware to allow frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # More permissive for deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(quiz_router, prefix="/api")

@app.get("/")
async def root():
    return JSONResponse(content={"message": "AI Wiki Quiz Generator API", "status": "running"}, status_code=200)

# Add a health check endpoint for Render
@app.get("/health")
async def health_check():
    return JSONResponse(content={"status": "healthy", "message": "AI Wiki Quiz Generator is running"}, status_code=200)

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port)