from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uuid
import random

app = FastAPI(title="Mock Interview Platform API")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://frontend:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory session storage
sessions: Dict[str, dict] = {}

# Question bank by difficulty
QUESTIONS = {
    "easy": [
        {"id": "e1", "text": "What is the difference between a list and a tuple in Python?", "skill": "Python"},
        {"id": "e2", "text": "Explain what REST API means.", "skill": "API Design"},
        {"id": "e3", "text": "What is the purpose of version control (Git)?", "skill": "DevOps"},
        {"id": "e4", "text": "Describe the difference between HTTP GET and POST.", "skill": "Web"},
        {"id": "e5", "text": "What is a primary key in a database?", "skill": "Database"},
    ],
    "medium": [
        {"id": "m1", "text": "Explain how Python's GIL affects multithreading.", "skill": "Python"},
        {"id": "m2", "text": "Design a rate limiter for an API. What approaches would you consider?", "skill": "System Design"},
        {"id": "m3", "text": "How would you optimize a slow SQL query?", "skill": "Database"},
        {"id": "m4", "text": "Explain the concept of eventual consistency in distributed systems.", "skill": "System Design"},
        {"id": "m5", "text": "What are the tradeoffs between microservices and monoliths?", "skill": "Architecture"},
    ],
    "hard": [
        {"id": "h1", "text": "Design a distributed cache with strong consistency guarantees.", "skill": "System Design"},
        {"id": "h2", "text": "How would you implement a consensus algorithm like Raft?", "skill": "Distributed Systems"},
        {"id": "h3", "text": "Design a real-time collaborative editing system (like Google Docs).", "skill": "System Design"},
        {"id": "h4", "text": "Explain how to handle Byzantine faults in a distributed system.", "skill": "Distributed Systems"},
        {"id": "h5", "text": "Design a load balancer that can handle millions of requests per second.", "skill": "System Design"},
    ]
}

DIFFICULTY_ORDER = ["easy", "medium", "hard"]

# ============ Models ============

class HealthResponse(BaseModel):
    ok: bool

class AnalyzeRequest(BaseModel):
    resume_text: str
    jd_text: str

class AnalyzeResponse(BaseModel):
    skills: List[str]
    role_requirements: List[str]
    focus_areas: List[str]

class Settings(BaseModel):
    time_limit_sec: int
    max_questions: int
    early_terminate_threshold: int

class StartSessionRequest(BaseModel):
    resume_text: str
    jd_text: str
    settings: Settings

class Question(BaseModel):
    id: str
    text: str
    difficulty: str
    skill: str

class StartSessionResponse(BaseModel):
    session_id: str
    question: Question

class SubmitAnswerRequest(BaseModel):
    session_id: str
    question_id: str
    answer_text: str
    time_taken_sec: int

class Breakdown(BaseModel):
    accuracy: int
    clarity: int
    depth: int
    relevance: int
    time_efficiency: int

class Evaluation(BaseModel):
    score_0_100: int
    breakdown: Breakdown
    feedback: List[str]

class State(BaseModel):
    difficulty: str
    strikes: int
    terminated: bool
    question_count: int
    readiness_score: int

class SubmitAnswerResponse(BaseModel):
    next_question: Optional[Question]
    evaluation: Evaluation
    state: State

class SkillBreakdown(BaseModel):
    pass

class ReportResponse(BaseModel):
    readiness_score_0_100: int
    skill_breakdown: Dict[str, int]
    strengths: List[str]
    weaknesses: List[str]
    actionable_feedback: List[str]
    hiring_readiness: str

# ============ Endpoints ============

@app.get("/health", response_model=HealthResponse)
def health():
    return {"ok": True}

@app.post("/api/analyze", response_model=AnalyzeResponse)
def analyze(req: AnalyzeRequest):
    # Simple keyword extraction simulation
    resume_lower = req.resume_text.lower()
    jd_lower = req.jd_text.lower()
    
    skills = []
    role_requirements = []
    focus_areas = []
    
    # Extract skills from resume
    skill_keywords = ["python", "javascript", "react", "sql", "aws", "docker", "kubernetes", "system design"]
    for skill in skill_keywords:
        if skill in resume_lower or skill in jd_lower:
            skills.append(skill.title() if skill != "aws" else "AWS")
    
    if not skills:
        skills = ["Python", "System Design"]
    
    # Role requirements from JD
    if "senior" in jd_lower:
        role_requirements = ["5+ years experience", "System design expertise", "Mentorship ability"]
    elif "junior" in jd_lower:
        role_requirements = ["Basic programming", "Willingness to learn", "Team collaboration"]
    else:
        role_requirements = ["Relevant experience", "Technical proficiency", "Problem solving"]
    
    # Focus areas based on gaps
    focus_areas = ["System Design", "Coding Interview", "Behavioral"]
    
    return {
        "skills": skills,
        "role_requirements": role_requirements,
        "focus_areas": focus_areas
    }

@app.post("/api/session/start", response_model=StartSessionResponse)
def start_session(req: StartSessionRequest):
    session_id = str(uuid.uuid4())
    
    # Initialize session state
    sessions[session_id] = {
        "resume_text": req.resume_text,
        "jd_text": req.jd_text,
        "settings": req.settings.dict(),
        "difficulty": "medium",
        "strikes": 0,
        "question_count": 0,
        "scores": [],
        "skill_scores": {},
        "terminated": False,
        "used_questions": set()
    }
    
    # Get first question
    question = get_next_question(session_id)
    
    return {
        "session_id": session_id,
        "question": question
    }

def get_next_question(session_id: str) -> Question:
    session = sessions[session_id]
    difficulty = session["difficulty"]
    used = session["used_questions"]
    
    # Get available questions for current difficulty
    available = [q for q in QUESTIONS[difficulty] if q["id"] not in used]
    
    # If no questions available at this difficulty, try others
    if not available:
        for d in DIFFICULTY_ORDER:
            available = [q for q in QUESTIONS[d] if q["id"] not in used]
            if available:
                break
    
    if not available:
        # All questions used, reset or return None
        available = QUESTIONS["easy"]
    
    question = random.choice(available)
    session["used_questions"].add(question["id"])
    session["question_count"] += 1
    
    return {
        "id": question["id"],
        "text": question["text"],
        "difficulty": difficulty,
        "skill": question["skill"]
    }

def evaluate_answer(answer_text: str, time_taken_sec: int, time_limit_sec: int, difficulty: str) -> tuple:
    """Simulate answer evaluation. Returns (score, breakdown, feedback)"""
    answer_len = len(answer_text.strip())
    
    # Base score based on answer length (simulated quality)
    if answer_len < 20:
        base_score = random.randint(30, 50)
    elif answer_len < 100:
        base_score = random.randint(50, 75)
    else:
        base_score = random.randint(60, 95)
    
    # Adjust for difficulty
    if difficulty == "hard":
        base_score = min(100, base_score + 5)
    elif difficulty == "easy":
        base_score = max(0, base_score - 5)
    
    # Time penalty
    time_efficiency = 100
    if time_taken_sec > time_limit_sec:
        base_score = int(base_score * 0.8)
        time_efficiency = max(0, int((time_limit_sec / time_taken_sec) * 100))
    
    # Breakdown
    breakdown = {
        "accuracy": min(100, base_score + random.randint(-10, 10)),
        "clarity": min(100, base_score + random.randint(-10, 10)),
        "depth": min(100, base_score + random.randint(-10, 10)),
        "relevance": min(100, base_score + random.randint(-10, 10)),
        "time_efficiency": time_efficiency
    }
    
    # Ensure all are in valid range
    for k in breakdown:
        breakdown[k] = max(0, min(100, breakdown[k]))
    
    # Feedback
    feedback = []
    if base_score >= 75:
        feedback.append("Excellent answer with good depth.")
    elif base_score >= 50:
        feedback.append("Good answer, but could use more detail.")
    else:
        feedback.append("Answer needs significant improvement.")
    
    if time_efficiency < 100:
        feedback.append("Try to answer within the time limit.")
    
    return base_score, breakdown, feedback

@app.post("/api/session/answer", response_model=SubmitAnswerResponse)
def submit_answer(req: SubmitAnswerRequest):
    if req.session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = sessions[req.session_id]
    
    if session["terminated"]:
        raise HTTPException(status_code=400, detail="Session already terminated")
    
    settings = session["settings"]
    
    # Evaluate answer
    score, breakdown, feedback = evaluate_answer(
        req.answer_text,
        req.time_taken_sec,
        settings["time_limit_sec"],
        session["difficulty"]
    )
    
    # Store score
    session["scores"].append(score)
    
    # Update difficulty based on score
    current_idx = DIFFICULTY_ORDER.index(session["difficulty"])
    if score >= 75 and current_idx < len(DIFFICULTY_ORDER) - 1:
        session["difficulty"] = DIFFICULTY_ORDER[current_idx + 1]
    elif score <= 40 and current_idx > 0:
        session["difficulty"] = DIFFICULTY_ORDER[current_idx - 1]
    
    # Update strikes
    if score < 50:
        session["strikes"] += 1
    
    # Calculate readiness score
    if session["scores"]:
        readiness_score = sum(session["scores"]) // len(session["scores"])
    else:
        readiness_score = 0
    
    # Check early termination
    terminated = False
    if session["strikes"] >= 2:
        terminated = True
    elif session["question_count"] >= 3 and readiness_score < settings["early_terminate_threshold"]:
        terminated = True
    elif session["question_count"] >= settings["max_questions"]:
        terminated = True
    
    session["terminated"] = terminated
    session["readiness_score"] = readiness_score
    
    # Get next question if not terminated
    next_question = None
    if not terminated:
        next_question = get_next_question(req.session_id)
    
    return {
        "next_question": next_question,
        "evaluation": {
            "score_0_100": score,
            "breakdown": breakdown,
            "feedback": feedback
        },
        "state": {
            "difficulty": session["difficulty"],
            "strikes": session["strikes"],
            "terminated": session["terminated"],
            "question_count": session["question_count"],
            "readiness_score": readiness_score
        }
    }

@app.get("/api/session/report", response_model=ReportResponse)
def fetch_report(session_id: str):
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = sessions[session_id]
    scores = session["scores"]
    
    if not scores:
        readiness_score = 0
    else:
        readiness_score = sum(scores) // len(scores)
    
    # Determine hiring readiness
    if readiness_score >= 80:
        hiring_readiness = "Strong Hire"
    elif readiness_score >= 60:
        hiring_readiness = "Hire"
    elif readiness_score >= 40:
        hiring_readiness = "Borderline"
    else:
        hiring_readiness = "No Hire"
    
    # Skill breakdown (simulated based on questions answered)
    skill_breakdown = {
        "Python": min(100, readiness_score + random.randint(-10, 10)),
        "System Design": min(100, readiness_score + random.randint(-15, 5)),
        "Database": min(100, readiness_score + random.randint(-10, 10)),
    }
    
    # Strengths and weaknesses
    if readiness_score >= 70:
        strengths = ["Strong technical knowledge", "Good problem-solving approach"]
        weaknesses = ["Could improve on time management"]
    elif readiness_score >= 50:
        strengths = ["Basic understanding of concepts"]
        weaknesses = ["Need deeper technical knowledge", "Practice more coding problems"]
    else:
        strengths = ["Willingness to attempt questions"]
        weaknesses = ["Fundamental gaps in knowledge", "Need significant practice", "Study core concepts"]
    
    actionable_feedback = [
        f"Focus on improving areas with scores below {readiness_score}",
        "Practice more timed interviews",
        "Review system design fundamentals"
    ]
    
    return {
        "readiness_score_0_100": readiness_score,
        "skill_breakdown": skill_breakdown,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "actionable_feedback": actionable_feedback,
        "hiring_readiness": hiring_readiness
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
