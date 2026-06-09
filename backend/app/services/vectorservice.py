import os
from dotenv import load_dotenv

load_dotenv()

from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

from langchain_core.documents import Document

CHROMA_DATA_DIR = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "../../data/chroma_db")
)

class VectorService:
    def __init__(self):
        self.embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            model_kwargs={
            "token": os.getenv("HF_TOKEN")
            }
        )

        self.llm = ChatGroq(
            model="llama-3.3-70b-versatile",
            temperature=0
        )

        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            separators=["\n\n", "\n", ".", " ", ""]
        )

    def index_youtube_video(self, video_id: str, transcript: str):
        doc = Document(
            page_content=transcript,
            metadata={"video_id": video_id}
        )

        chunks = self.splitter.split_documents([doc])

        Chroma.from_documents(
            documents=chunks,
            embedding=self.embeddings,
            persist_directory=CHROMA_DATA_DIR,
            collection_name=f"video_{video_id}"
        )

        return f"Successfully indexed video_{video_id}"

    def get_chat_chain(self, video_id: str):
        vectorstore = Chroma(
            persist_directory=CHROMA_DATA_DIR,
            embedding_function=self.embeddings,
            collection_name=f"video_{video_id}"
        )

        retriever = vectorstore.as_retriever(
            search_type="mmr",
            search_kwargs={"k": 4, "fetch_k": 15}
        )

        prompt = ChatPromptTemplate.from_messages([
            (
                "system",
                "You are an AI StudyBuddy. Answer the student's question using strictly the provided context from the lecture video transcript. If you do not know the answer based on the context, say so.\n\nContext:\n{context}"
            ),
            ("user", "{question}")
        ])

        def format_docs(docs):
            return "\n\n".join(doc.page_content for doc in docs)

        chat_chain = (
            {
                "context": retriever | format_docs,
                "question": RunnablePassthrough()
            }
            | prompt
            | self.llm
            | StrOutputParser()
        )

        return chat_chain