const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

async function fetchJson(url, options = {}) {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP ${response.status}`);
  }
  
  return response.json();
}

export async function analyze(resumeText, jdText) {
  return fetchJson('/api/analyze', {
    method: 'POST',
    body: JSON.stringify({ resume_text: resumeText, jd_text: jdText }),
  });
}

export async function startSession(resumeText, jdText, settings) {
  return fetchJson('/api/session/start', {
    method: 'POST',
    body: JSON.stringify({
      resume_text: resumeText,
      jd_text: jdText,
      settings,
    }),
  });
}

export async function submitAnswer(sessionId, questionId, answerText, timeTakenSec) {
  return fetchJson('/api/session/answer', {
    method: 'POST',
    body: JSON.stringify({
      session_id: sessionId,
      question_id: questionId,
      answer_text: answerText,
      time_taken_sec: timeTakenSec,
    }),
  });
}

export async function fetchReport(sessionId) {
  return fetchJson(`/api/session/report?session_id=${encodeURIComponent(sessionId)}`);
}

export async function healthCheck() {
  return fetchJson('/health');
}
