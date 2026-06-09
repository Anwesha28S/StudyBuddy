from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
from typing import List
from dotenv import load_dotenv

load_dotenv()

class QuizItem(BaseModel):
    question: str
    options: List[str]
    correct_answer: str

class Quiz(BaseModel):
    quiz: List[QuizItem]

def generate_quiz(transcript: str):
    llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0)

    parser = JsonOutputParser(pydantic_object=Quiz)

    prompt = ChatPromptTemplate.from_messages([
        (
            "system",
            """You are an educator.
Generate exactly 5 multiple-choice questions based strictly on the transcript.

Each question must have exactly 4 options.
The correct_answer must exactly match one option.

Return only valid JSON.

{format_instructions}"""
        ),
        ("user", "Transcript:\n{transcript}")
    ]).partial(format_instructions=parser.get_format_instructions())

    chain = prompt | llm | parser

    result = chain.invoke({"transcript": transcript[:15000]})

    return result["quiz"]