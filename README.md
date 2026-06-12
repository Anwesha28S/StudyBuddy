# 🎓 AI StudyBuddy

An advanced, full-stack AI-driven educational platform that transforms static lecture videos into interactive, dynamic learning environments. Built with a highly user friendly frontend, the application automatically indexes video transcripts to generate comprehensive lesson summaries, dynamic quiz assessments, and an interactive context-aware AI co-pilot.

---

##  ✨ Key Features 

*   **Premium Dark UI Dashboard:** Features a clean, accessible layout featuring high-fidelity styling built with Tailwind CSS.
*   **Lecture Synthesis & Roadmap:** Replaces arbitrary timeline segments with an AI-generated academic overview, review time allocation budget, and a curated key takeaways panel.
*   **Dynamic Knowledge Assessment:** Generates customized multiple-choice questions with real-time semantic feedback loops (correct options highlight in emerald; incorrect choices flash in rose).
*   **Interactive AI Assistance:** A vector-indexed contextual assistant sitting side-by-side with an embedded YouTube stream player, allowing students to query specifics across long-form lectures.
*   **Auto-Curriculum Exploration:** Every suggested forward topic features an automated external search component mapping directly into live YouTube search indexes via encoded URI protocols.

---

## 🛠️ Technology Stack

### Frontend Canvas
*   **React.js (Vite)** — Single Page Application structural foundation.
*   **Tailwind CSS** — Declarative layout and interaction engines.
*   **PostCSS & Autoprefixer** — Cross-browser style parsing automation.

### Backend Infrastructure
*   **FastAPI** — High-performance execution router framework.
*   **LangChain** — LLM chaining architecture and document loader ecosystem.
*   **ChatGroq model: llama-3.3-70b-versatile** — Structured JSON schematic execution layer.
*   **ChromaDB** — Local standalone vector database instance storage (`data/chroma_db`).

---

## 📁 Project Structure

```text
ai-studybuddy/
├── backend/
│   ├── app/
│   │   ├── main.py             # FastAPI core engine and global CORS router config
│   │   └── services/
│   │       ├── videoprocessor.py # YouTube Loader and transcript parsing
│   │       ├── quizgen.py       # Pydantic structured quiz generation logic
│   │       └── planner.py       # Synthesis, takeaways, and milestone recommendations
│   ├── .env                    # System environmental authentication keys
│   └── requirements.txt        # Python library dependencies
│
└── frontend/
    ├── src/
    │   ├── features/
    │   │   ├── Dashboard.jsx    # Central nexus orchestrator 
    │   │   ├── StudyPlanner.jsx # Study Roadmap and YouTube redirect links
    │   │   ├── QuizDashboard.jsx# Real-time evaluation button state matrix
    │   │   └── VideoChat.jsx    # Stream player & context-aware chat logs 
    │   ├── App.jsx             # Top-level viewport element loader
    │   └── index.css           # Global Tailwind compiler directive configurations
    ├── tailwind.config.js      # Workspace utility routing scanner
    └── package.json            # Node package configurations
```
---
## 📸 Model in Action

Below are the interface states of the AI StudyBuddy Workspace processing an active lecture vector index:

### 1. Active Dashboard Entry
![Dashboard Workspace Entry](frontend/src/assets/image.png)

### 2. Synthesis & Curriculum Planner View
![Study Planner View](frontend/src/assets/image-1.png)

### 3. Dynamic Knowledge Assessment (Quiz)
![Quiz Feedback State](frontend/src/assets/image-2.png)

### 4. Vector Contextual AI Assistance Chat
![Interactive Video Chat](frontend/src/assets/image-3.png)


# ⚙️ Local Setup Instructions

Follow these steps to get the project running smoothly on your local machine.

---

## 📋 Prerequisites

Make sure the following are installed:

* **Node.js** (v18 or higher)
* **Python** (v3.9 or higher)
* **Git**

---

## 📥 Clone the Repository

```bash
git clone https://github.com/your-username/ai-studybuddy.git
cd ai-studybuddy
```

---

# 🖥️ Backend Setup (FastAPI)

Navigate to the backend directory:

```bash
cd backend
```

### Create a Virtual Environment

```bash
python -m venv venv
```

### Activate the Virtual Environment

**Windows (Command Prompt)**

```cmd
venv\Scripts\activate
```

**Windows (PowerShell)**

```powershell
.\venv\Scripts\Activate.ps1
```

**Mac/Linux**

```bash
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Configure Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
GROQ_API_KEY=your_groq_api_key_here
HF_token=your_hftoken_here
```

### Start the Backend Server

```bash
uvicorn app.main:app --reload
```

The backend will be available at:

```text
http://localhost:8000
```

---

# 🎨 Frontend Setup (React + Vite)

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file inside the `frontend/` directory:

```env
VITE_API_URL=http://localhost:8000
```

### Start the Development Server

```bash
npm run dev -- --force
```

The frontend will be available at:

```text
http://localhost:5173
```

---

# 🚀 Running the Application

1. Start the FastAPI backend server.
2. Start the Vite frontend server.
3. Open your browser and visit:

```text
http://localhost:5173
```

Paste a YouTube URL and start generating summaries, quizzes, and study plans.

---

### Transcript Extraction Errors

Transcript extraction depends on YouTube captions.

✅ Ensure the selected video has **captions (CC)** enabled.

Videos without captions may not generate summaries, quizzes, or study materials correctly.

---

## 🎉 You're Ready!

Once both servers are running, you can start using AI StudyBuddy locally.
