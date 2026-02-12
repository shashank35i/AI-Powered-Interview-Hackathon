<div align="center">

# 🎯 InterviewIQ  
### **The AI-Powered Mock Interview Platform**

A comprehensive AI interviewer platform that simulates real-world interviews, evaluates candidates objectively, and provides detailed performance feedback.

<br/>

<a href="https://ot2udd4lycxiu.ok.kimi.link"><b>🌐 Live Demo Website</b></a>

<br/><br/>

![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=0B1F2A)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Docker](https://img.shields.io/badge/Deploy-Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![AI](https://img.shields.io/badge/AI-Adaptive%20Interviews-7C3AED?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Launch%20Ready-22C55E?style=for-the-badge)

<br/>

</div>

---



## ⚡ Quick Start
- 🚀 **Production Ready** — Fully deployed as a **React + FastAPI** web app  
- 📱 **Web-based** — Access from any browser  
- 🤖 **AI-Powered** — Real-time question adaptation & objective scoring  
- 🎨 **Modern UI** — Responsive design for all devices  
- 🐳 **Docker Ready** — One-command deployment  

**Get Started:**
- **Local Dev:** [WEB_APP_SETUP.md](WEB_APP_SETUP.md)  
- **Production:** [PRODUCTION_GUIDE.md](PRODUCTION_GUIDE.md)  
- **Launch Ready:** [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md)  

---

## 📌 Table of Contents
- [🎯 Key Capabilities](#-key-capabilities)
- [📊 Output: Final Interview Report](#-output-final-interview-report)
- [🏗️ Architecture](#️-architecture)
- [🧠 Data Flow](#-data-flow)
- [🚀 Quick Start](#-quick-start-1)
- [🔑 Configuration](#-configuration)
- [💻 Usage Example](#-usage-example)
- [📈 Evaluation Metrics](#-evaluation-metrics)
- [🎓 Interview Question Types](#-interview-question-types)
- [📝 Sample Output](#-sample-output)
- [⚙️ Advanced Features](#️-advanced-features)
- [🔐 Security Considerations](#-security-considerations)
- [📚 Dependencies](#-dependencies)
- [🚧 Future Enhancements](#-future-enhancements)
- [📖 Documentation](#-documentation)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [🆘 Troubleshooting](#-troubleshooting)

---

## 🎯 Key Capabilities

### 1) **Resume Analysis**
- Extract candidate skills, experience, projects, and education  
- Identify professional strengths and expertise areas  
- Calculate years of experience and technology proficiency  
- Build comprehensive candidate profile  

### 2) **Job Description Processing**
- Parse job requirements and responsibilities  
- Extract required and preferred skills  
- Identify technology stack requirements  
- Analyze experience level requirements  
- Calculate skill gaps between candidate and role  

### 3) **Dynamic Question Generation**
- Generate questions spanning 5 skill areas:
  - **Technical**: Framework, language, and system concepts  
  - **Problem-Solving**: Algorithm design, optimization  
  - **Behavioral**: Team collaboration, conflict resolution  
  - **Communication**: Explanation clarity, presentation skills  
  - **System Design**: Architecture, scalability decisions  
- Adjust difficulty based on previous performance  
- Support 3 difficulty levels: **Easy → Medium → Hard**  
- Ask relevant questions aligned with job requirements  

### 4) **Adaptive Difficulty**
- Monitor answer quality in real-time  
- Increase difficulty for strong responses (≥80%)  
- Maintain difficulty for average responses (50–80%)  
- Reduce difficulty for weak responses (<50%)  
- Progressive difficulty through interview  

### 5) **Answer Evaluation**
Scoring on 5 dimensions:
- **Accuracy** (25%): Correctness and completeness  
- **Clarity** (20%): Clear communication and structure  
- **Depth** (25%): Thorough explanation and examples  
- **Relevance** (20%): Alignment with question intent  
- **Time Efficiency** (10%): Time management  

### 6) **Time Management**
- Enforce strict time limits per question  
- Track time efficiency scores  
- Penalize overtime responses  
- Bonus for well-paced answers  
- Optimal range: **70–90%** of allocated time  

### 7) **Early Interview Termination**
- Automatic termination if average score < **40%** for **3 consecutive questions**  
- Prevents wasting time on unfit candidates  
- Applies completion penalty to final score  
- Logged for analysis  

### 8) **Objective Scoring Mechanism**
- Multi-dimension evaluation framework  
- Weighted component scoring  
- Skill-area based breakdown  
- Consistency detection  
- Role-fit alignment  

### 9) **Comprehensive Feedback**
- Strengths identification  
- Areas for improvement  
- Missed concepts analysis  
- Actionable recommendations  
- Technology-specific guidance  

---

## 📊 Output: Final Interview Report

### Overall Performance
- **Final Score**: 0–100 readiness indicator  
- **Readiness Category**: **Strong / Average / Needs Improvement**  
- **Hiring Readiness**: **Ready / Needs Development / Not Ready**  
- **Role Fit**: % compatibility with job requirements  

### Performance Breakdown
```txt
Skill Area Scores:
  - Technical: X/100
  - Problem-Solving: X/100
  - Behavioral: X/100
  - Communication: X/100
  - System Design: X/100

Component Metrics:
  - Technical Depth: X/100
  - Communication Quality: X/100
  - Time Management: X/100
  - Adaptability: X/100
  - Interview Completion: X%
Detailed Feedback
Top 3–5 strengths with context

Top 3–5 weaknesses for improvement

Specific actionable recommendations

Missing technology recommendations

Interview performance trends

🏗️ Architecture
Core Components
src/
├── agents/
│   └── ai_interviewer.py           # Main AI interviewer agent (state + policy)
├── core/
│   ├── resume_analyzer.py          # Resume parsing & analysis
│   ├── job_description_analyzer.py # JD parsing & analysis
│   ├── question_generator.py       # Question creation & difficulty adaptation
│   ├── answer_evaluator.py         # Answer scoring & evaluation
│   └── interview_scorer.py         # Final scoring & feedback report
├── utils/
│   ├── models.py                   # Data models / schemas
│   ├── config.py                   # Environment configuration
│   └── logger.py                   # Logging setup
└── main.py                         # Orchestrator & demo entry
Web App Structure
mock_interview_platform/
├── frontend/                       # React UI
│   ├── src/
│   │   ├── api/client.js           # API wrapper
│   │   ├── pages/
│   │   │   ├── InterviewSetup.js   # Resume + JD input
│   │   │   ├── InterviewSession.js # Timed interview session
│   │   │   └── InterviewReport.js  # Final report
│   │   ├── App.js                  # Routing
│   │   └── index.js                # React entry
│   └── package.json
├── src/                            # FastAPI backend
│   └── main.py                     # API entrypoint
├── docker-compose.yml
├── Dockerfile.backend
└── requirements.txt
🧠 Data Flow
Resume + JD
    ↓
[ResumeAnalyzer] + [JobDescriptionAnalyzer]
    ↓
CandidateProfile + JobRequirements + SkillGaps
    ↓
[QuestionGenerator] → Questions (difficulty controlled)
    ↓
Interview Loop:
  ├─ Display Question
  ├─ Collect Answer + Time
  ├─ [AnswerEvaluator] → Score + Feedback
  ├─ Apply Time Penalty (if overtime)
  ├─ Check Early Termination
  ├─ Adapt Difficulty
  └─ Next Question
    ↓
[InterviewScorer] → Final Readiness Score + Report
    ↓
Final Report + Recommendations
🚀 Quick Start (Local)
1) Backend
# From repo root
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt --pre

# Run FastAPI (adjust entrypoint if different)
uvicorn src.main:app --reload --port 8000
2) Frontend
cd mock_interview_platform/frontend
npm install
npm start
Frontend: http://localhost:3000

Backend Health: http://localhost:8000/health

🐳 Docker (One Command)
docker compose -f mock_interview_platform/docker-compose.yml up --build
🔑 Configuration Options
Copy .env.example → .env:

cp .env.example .env
App Settings
MAX_QUESTIONS=5
TIME_PER_QUESTION=120
PASSING_THRESHOLD=60
EARLY_TERMINATION_THRESHOLD=40
Model Providers
Option A: Microsoft Foundry (Azure AI)

FOUNDRY_API_KEY=your_api_key
FOUNDRY_ENDPOINT=https://your-instance.inference.ai.azure.com
FOUNDRY_MODEL_ID=gpt-4o-mini
Option B: GitHub Models (Free tier)

GITHUB_TOKEN=your_github_token
GITHUB_MODEL=openai/gpt-4o-mini
💻 Usage Example
from src.main import InterviewOrchestrator
from src.utils import Config

config = Config()
orchestrator = InterviewOrchestrator(config)

results = orchestrator.run_interview(
    resume_text="...",
    jd_text="...",
    candidate_name="John Doe",
    job_title="Senior Backend Engineer",
    interactive=True
)
📈 Evaluation Metrics
Question Difficulty Levels
Level	Characteristics	Time Limit
Easy	Basic concepts, definitions, simple explanations	120 sec
Medium	Real-world scenarios, trade-offs, optimization	180 sec
Hard	System design, complex problems, edge cases	240 sec
Scoring Components
Component	Weight	Description
Accuracy	25%	Correctness and key concept coverage
Clarity	20%	Communication quality and structure
Depth	25%	Thoroughness and examples
Relevance	20%	Alignment with question intent
Time Efficiency	10%	Speed and time management
Readiness Categories
Score	Category	Meaning
75–100	Strong	Ready for role, high competency
60–74	Average	Suitable with development areas
0–59	Needs Improvement	Requires significant development
🎓 Interview Question Types
Technical Questions
Framework/library-specific concepts

Language features and best practices

Database design and optimization

API design patterns

Problem-Solving
Algorithm design

Complexity analysis

Optimization strategies

Edge case handling

Behavioral
Past experience narratives

Conflict resolution

Teamwork examples

Initiative demonstrations

Communication
Explaining concepts to non-technical audiences

Presentation skills

Clarity and structure

System Design
Architecture decisions

Scalability considerations

Technology selection

Disaster recovery planning

📝 Sample Output
================================================================================
MOCK INTERVIEW REPORT
================================================================================

Candidate: John Smith
Position: Senior Software Engineer - Backend
Interview Date: 2026-02-01 10:30:45
Duration: 15:32

================================================================================
OVERALL PERFORMANCE
================================================================================
Final Score: 78/100
Readiness Category: Strong
Hiring Readiness: Ready
Estimated Role Fit: 82%
Completion: 100%

================================================================================
SKILL AREA BREAKDOWN
================================================================================
  technical: 82/100 (2 questions)
  problem_solving: 75/100 (1 question)
  behavioral: 80/100 (1 question)
  communication: 76/100 (1 question)
  system_design: 78/100 (1 question)

================================================================================
COMPONENT SCORES
================================================================================
Technical Depth: 82/100
Communication Quality: 76/100
Time Management: 85/100
Adaptability: 72/100

================================================================================
STRENGTHS
================================================================================
  ✓ Strong technical foundation with diverse tech stack
  ✓ Clear and structured answers with good examples
  ✓ Good problem-solving approach
  ✓ Excellent time management

================================================================================
AREAS FOR IMPROVEMENT
================================================================================
  ✗ Could provide more depth on system design trade-offs
  ✗ Missing some edge cases in problem-solving
  ✗ Needs better communication about complex concepts

================================================================================
ACTIONABLE FEEDBACK
================================================================================
  • Review system design patterns - focus on scalability
  • Practice explaining trade-offs more clearly
  • Study distributed systems concepts
  • Work on handling ambiguous requirements
  • Learn more about: Redis, Elasticsearch, GraphQL
⚙️ Advanced Features
Adaptive Difficulty Algorithm
Tracks last 3 question scores

Increases difficulty if average ≥ 80%

Decreases difficulty if average < 50%

Regenerates question with new difficulty level

Early Termination Logic
Monitors performance threshold (configurable)

Terminates after 3 consecutive low scores

Applies completion penalty to final score

Logs termination reason

Role Fit Calculation
Skill alignment: 30% weight

Technology match: 25% weight

Experience level: 20% weight

Interview performance: 25% weight

🔐 Security Considerations
Secure credential management via .env

Input validation on resume/JD input

No data persistence by default

Optional logging for audit trails (avoid storing sensitive text)

📚 Dependencies
agent-framework-azure-ai: AI agent orchestration

pydantic: Data validation

python-dotenv: Environment configuration

pyyaml: Configuration parsing

🚧 Future Enhancements
 Multi-language support

 Video interview support with non-verbal assessment

 Real-time interview dashboard

 Candidate comparison analytics

 Interview history and progress tracking

 Custom rubric creation

 ATS integration

 Group interview scenarios

📖 Documentation
Core Components API

Configuration Guide

Evaluation Framework

Interview Examples

🤝 Contributing
Contributions welcome:

Additional question templates

Enhanced NLP for answer evaluation

Performance optimizations

More skill categories / rubrics

Integrations with external services

📄 License
Provided as-is for educational and evaluation purposes.

🆘 Troubleshooting
Model API Issues
Verify credentials in .env

Check network connectivity

Review API rate limits

Low Evaluation Scores
Ensure candidates provide detailed answers (reasoning + examples)

Confirm time limits are reasonable for difficulty

Ensure JD contains sufficient details

Early Termination
Review performance trends

Adjust early termination threshold if needed

Analyze weak areas in report

Created: February 2026
Version: 1.0.0
Platform: Python 3.8+
