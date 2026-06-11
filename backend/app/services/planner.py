# backend/app/services/planner.py
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
from typing import List
from dotenv import load_dotenv
load_dotenv()


class StudyPlanResponse(BaseModel):
    summary: str = Field(description="A detailed, comprehensive academic summary of the lecture contents.")
    estimated_study_time: str = Field(description="Total recommended time a student should spend reviewing this material to master it (e.g., '1.5 hours').")
    core_takeaways: List[str] = Field(description="Top 3-5 critical formulas, concepts, or rules explained in the video.")
    suggested_next_topics: List[str] = Field(description="3 logical next-step subjects or advanced concepts the student should study after mastering this video.")

def generate_study_plan(transcript: str) -> dict:
    """Analyzes lecture text to build a summary, time metric, and next-step curriculum roadmap"""
    llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.3)
    parser = JsonOutputParser(pydantic_object=StudyPlanResponse)
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an elite academic advisor. Analyze the lecture transcript and generate a structured study profile. You must return your response strictly as a JSON object matching the provided schema rules.\n{format_instructions}"),
        ("user", "Lecture Transcript:\n{transcript}")
    ]).partial(format_instructions=parser.get_format_instructions())
    
    chain = prompt | llm | parser
    
    
    return chain.invoke({"transcript": transcript[:15000]})