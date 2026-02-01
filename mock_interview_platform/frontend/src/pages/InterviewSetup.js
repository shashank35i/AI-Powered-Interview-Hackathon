import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { startSession } from '../api/client';

function InterviewSetup() {
  const navigate = useNavigate();
  const [resumeText, setResumeText] = useState('');
  const [jdText, setJdText] = useState('');
  const [timeLimit, setTimeLimit] = useState(120);
  const [maxQuestions, setMaxQuestions] = useState(5);
  const [earlyTerminateThreshold, setEarlyTerminateThreshold] = useState(40);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const settings = {
        time_limit_sec: parseInt(timeLimit),
        max_questions: parseInt(maxQuestions),
        early_terminate_threshold: parseInt(earlyTerminateThreshold),
      };

      const response = await startSession(resumeText, jdText, settings);
      navigate('/session', {
        state: {
          sessionId: response.session_id,
          question: response.question,
          settings,
        },
      });
    } catch (err) {
      setError(err.message || 'Failed to start session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Mock Interview Setup</h1>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '20px', padding: '10px', background: '#ffeeee', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Resume Text:
          </label>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            rows={8}
            style={{ width: '100%', padding: '10px', fontSize: '14px' }}
            placeholder="Paste your resume here..."
            required
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Job Description:
          </label>
          <textarea
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            rows={8}
            style={{ width: '100%', padding: '10px', fontSize: '14px' }}
            placeholder="Paste the job description here..."
            required
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>Interview Settings</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Time Limit per Question (seconds):
            </label>
            <input
              type="number"
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value)}
              min={30}
              max={600}
              style={{ padding: '8px', width: '150px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Maximum Questions:
            </label>
            <input
              type="number"
              value={maxQuestions}
              onChange={(e) => setMaxQuestions(e.target.value)}
              min={1}
              max={20}
              style={{ padding: '8px', width: '150px' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Early Terminate Threshold (score 0-100):
            </label>
            <input
              type="number"
              value={earlyTerminateThreshold}
              onChange={(e) => setEarlyTerminateThreshold(e.target.value)}
              min={0}
              max={100}
              style={{ padding: '8px', width: '150px' }}
            />
            <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
              Session ends early if readiness score falls below this after 3+ questions
            </small>
          </div>
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
          {loading ? 'Starting...' : 'Start Interview'}
        </button>
      </form>
    </div>
  );
}

export default InterviewSetup;
