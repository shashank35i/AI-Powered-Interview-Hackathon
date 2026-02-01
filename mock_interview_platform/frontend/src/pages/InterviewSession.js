import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { submitAnswer } from '../api/client';

function InterviewSession() {
  const location = useLocation();
  const navigate = useNavigate();
  const { sessionId, question: initialQuestion, settings } = location.state || {};

  const [currentQuestion, setCurrentQuestion] = useState(initialQuestion);
  const [answerText, setAnswerText] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(settings?.time_limit_sec || 120);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [sessionState, setSessionState] = useState(null);
  
  const timerRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    if (!sessionId) {
      navigate('/');
      return;
    }

    // Start countdown timer
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [sessionId, navigate]);

  // Reset timer when question changes
  useEffect(() => {
    if (currentQuestion) {
      setTimeRemaining(settings?.time_limit_sec || 120);
      startTimeRef.current = Date.now();
    }
  }, [currentQuestion?.id, settings?.time_limit_sec]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError('');

    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const timeTakenSec = Math.floor((Date.now() - startTimeRef.current) / 1000);

    try {
      const response = await submitAnswer(
        sessionId,
        currentQuestion.id,
        answerText,
        timeTakenSec
      );

      setEvaluation(response.evaluation);
      setSessionState(response.state);

      if (response.state.terminated || !response.next_question) {
        // Navigate to report after showing evaluation briefly
        setTimeout(() => {
          navigate('/report', { state: { sessionId } });
        }, 3000);
      } else {
        // Show next question after brief delay
        setTimeout(() => {
          setCurrentQuestion(response.next_question);
          setAnswerText('');
          setEvaluation(null);
          setLoading(false);
        }, 3000);
      }
    } catch (err) {
      setError(err.message || 'Failed to submit answer');
      setLoading(false);
    }
  };

  if (!sessionId) {
    return <div>Redirecting...</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Interview Session</h1>

      {error && (
        <div style={{ color: 'red', marginBottom: '20px', padding: '10px', background: '#ffeeee', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      {/* Timer */}
      <div style={{ 
        marginBottom: '20px', 
        padding: '15px', 
        background: timeRemaining < 30 ? '#ffcccc' : '#e6f3ff',
        borderRadius: '8px',
        textAlign: 'center',
      }}>
        <span style={{ fontSize: '24px', fontWeight: 'bold' }}>
          Time Remaining: {formatTime(timeRemaining)}
        </span>
        {timeRemaining === 0 && (
          <div style={{ color: 'red', marginTop: '5px' }}>
            Time's up! Submit your answer now.
          </div>
        )}
      </div>

      {/* Session Stats */}
      {sessionState && (
        <div style={{ 
          marginBottom: '20px', 
          padding: '10px', 
          background: '#f5f5f5',
          borderRadius: '4px',
          display: 'flex',
          gap: '20px',
          flexWrap: 'wrap',
        }}>
          <span><strong>Difficulty:</strong> {sessionState.difficulty}</span>
          <span><strong>Questions:</strong> {sessionState.question_count}</span>
          <span><strong>Strikes:</strong> {sessionState.strikes}</span>
          <span><strong>Readiness Score:</strong> {sessionState.readiness_score}</span>
        </div>
      )}

      {/* Current Question */}
      <div style={{ 
        marginBottom: '20px', 
        padding: '20px', 
        background: '#f9f9f9',
        borderRadius: '8px',
        border: '1px solid #ddd',
      }}>
        <div style={{ marginBottom: '10px' }}>
          <span style={{ 
            padding: '4px 12px', 
            background: currentQuestion?.difficulty === 'easy' ? '#28a745' : currentQuestion?.difficulty === 'medium' ? '#ffc107' : '#dc3545',
            color: currentQuestion?.difficulty === 'medium' ? '#000' : '#fff',
            borderRadius: '12px',
            fontSize: '12px',
            textTransform: 'uppercase',
          }}>
            {currentQuestion?.difficulty}
          </span>
          <span style={{ marginLeft: '10px', color: '#666' }}>
            {currentQuestion?.skill}
          </span>
        </div>
        <h3 style={{ margin: '10px 0' }}>{currentQuestion?.text}</h3>
      </div>

      {/* Answer Form */}
      {!evaluation && (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Your Answer:
            </label>
            <textarea
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              rows={10}
              style={{ width: '100%', padding: '10px', fontSize: '14px' }}
              placeholder="Type your answer here..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px 30px',
              fontSize: '16px',
              background: loading ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Submitting...' : 'Submit Answer'}
          </button>
        </form>
      )}

      {/* Evaluation Result */}
      {evaluation && (
        <div style={{ 
          marginTop: '20px', 
          padding: '20px', 
          background: evaluation.score_0_100 >= 75 ? '#d4edda' : evaluation.score_0_100 >= 50 ? '#fff3cd' : '#f8d7da',
          borderRadius: '8px',
          border: '1px solid',
          borderColor: evaluation.score_0_100 >= 75 ? '#c3e6cb' : evaluation.score_0_100 >= 50 ? '#ffeeba' : '#f5c6cb',
        }}>
          <h3 style={{ marginTop: 0 }}>Evaluation</h3>
          <p><strong>Score:</strong> {evaluation.score_0_100}/100</p>
          
          <div style={{ marginTop: '15px' }}>
            <strong>Breakdown:</strong>
            <ul style={{ marginTop: '5px' }}>
              <li>Accuracy: {evaluation.breakdown.accuracy}</li>
              <li>Clarity: {evaluation.breakdown.clarity}</li>
              <li>Depth: {evaluation.breakdown.depth}</li>
              <li>Relevance: {evaluation.breakdown.relevance}</li>
              <li>Time Efficiency: {evaluation.breakdown.time_efficiency}</li>
            </ul>
          </div>

          <div style={{ marginTop: '15px' }}>
            <strong>Feedback:</strong>
            <ul style={{ marginTop: '5px' }}>
              {evaluation.feedback.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>

          {sessionState?.terminated && (
            <div style={{ marginTop: '15px', color: '#721c24', fontWeight: 'bold' }}>
              Session terminated. Redirecting to report...
            </div>
          )}

          {!sessionState?.terminated && (
            <div style={{ marginTop: '15px', color: '#155724' }}>
              Loading next question...
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default InterviewSession;
