
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.services.videoprocessor import extract_transcript
from app.services.quizgen import generate_quiz
import os
from dotenv import load_dotenv

load_dotenv() 

app = FastAPI(title="AI StudyBuddy API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS", "PUT", "DELETE"], 
    allow_headers=["*"], 
)

from fastapi.responses import StreamingResponse
from app.services.vectorservice import VectorService
import urllib.parse as urlparse

vector_service = VectorService()
@app.get("/")
def root():
    return {"message": "AI Study Buddy backend is running"}
def get_video_id(url: str) -> str:
    """Helper to extract unique video id string from YouTube link variants"""
    url_data = urlparse.urlparse(url)
    query = urlparse.parse_qs(url_data.query)
    if video := query.get("v"):
        return video[0]
    return url_data.path.split("/")[-1]

class ProcessRequest(BaseModel):
    url: str

@app.post("/api/generate-workspace")
async def generate_workspace(request: ProcessRequest):
    try:
        video_id = get_video_id(request.url)
        transcript = extract_transcript(request.url)
        
        # Build the study materials
        quiz = generate_quiz(transcript)
        
        if isinstance(quiz, dict) and "quiz" in quiz:
            quiz = quiz["quiz"]
        vector_service.index_youtube_video(video_id, transcript)

        return {
            "video_id": video_id,
            "quiz": quiz
        }
    except Exception as e:
        print(f"❌ ERROR in generate_workspace: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# 2. Add the dynamic Chat Query Endpoint
class ChatQueryRequest(BaseModel):
    video_id: str
    question: str

@app.post("/api/chat")
async def chat_with_video(request: ChatQueryRequest):
    try:
       
        chain = vector_service.get_chat_chain(request.video_id)
        
        async def event_generator():
           
            async for chunk in chain.astream(request.question):
                yield chunk

        
        return StreamingResponse(event_generator(), media_type="text/event-stream")
        
    except Exception as e:
        print(f"ENDPOINT CRASH ERROR DETECTED: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))