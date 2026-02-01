import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchReport } from '../api/client';

function InterviewReport() {
  const location = useLocation();
  const navigate = useNavigate();
  const { sessionId } = location.state || {};

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!sessionId) {
      navigate('/');
      return;
    }

    const loadReport = async () => {
      try {
        const data = await fetchReport(sessionId);
        setReport(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch report');
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, [sessionId, navigate]);

  const getReadinessColor = (score) => {
    if (score >= 80) return '#28a745';
    if (score >= 60) return '#6c757d';
    if (score >= 40) return '#ffc107';
    return '#dc3545';
  };

  const getHiringReadinessColor = (status) => {
    switch (status) {
      case 'Strong Hire': return '#28a745';
      case 'Hire': return '#6c757d';
      case 'Borderline': return '#ffc107';
      case 'No Hire': return '#dc3545';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
        <h1>Loading Report...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <h1>Error</h1>
        <div style={{ color: 'red', padding: '10px', background: '#ffeeee', borderRadius: '4px' }}>
          {error}
        </div>
        <button
          onClick={() => navigate('/')}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Back to Setup
        </button>
      </div>
    );
  }

  if (!report) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <h1>No Report Available</h1>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '10px 20px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Back to Setup
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Interview Report</h1>

      {/* Readiness Score */}
      <div style={{ 
        textAlign: 'center',
        padding: '30px',
        background: '#f8f9fa',
        borderRadius: '8px',
        marginBottom: '30px',
      }}>
        <h2 style={{ marginTop: 0, color: '#333' }}>Readiness Score</h2>
        <div style={{
          fontSize: '72px',
          fontWeight: 'bold',
          color: getReadinessColor(report.readiness_score_0_100),
        }}>
          {report.readiness_score_0_100}
        </div>
        <div style={{ fontSize: '18px', color: '#666' }}>out of 100</div>
        
        <div style={{
          marginTop: '20px',
          padding: '10px 20px',
          background: getHiringReadinessColor(report.hiring_readiness),
          color: report.hiring_readiness === 'Borderline' ? '#000' : '#fff',
          borderRadius: '20px',
          display: 'inline-block',
          fontSize: '18px',
          fontWeight: 'bold',
        }}>
          {report.hiring_readiness}
        </div>
      </div>

      {/* Skill Breakdown */}
      <div style={{ marginBottom: '30px' }}>
        <h2>Skill Breakdown</h2>
        {Object.entries(report.skill_breakdown).map(([skill, score]) => (
          <div key={skill} style={{ marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span style={{ fontWeight: 'bold' }}>{skill}</span>
              <span>{score}/100</span>
            </div>
            <div style={{
              height: '20px',
              background: '#e9ecef',
              borderRadius: '10px',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${score}%`,
                background: getReadinessColor(score),
                borderRadius: '10px',
                transition: 'width 0.5s ease',
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* Strengths */}
      <div style={{ 
        marginBottom: '20px', 
        padding: '20px', 
        background: '#d4edda',
        borderRadius: '8px',
        border: '1px solid #c3e6cb',
      }}>
        <h3 style={{ marginTop: 0, color: '#155724' }}>Strengths</h3>
        <ul style={{ marginBottom: 0 }}>
          {report.strengths.map((strength, i) => (
            <li key={i} style={{ color: '#155724', marginBottom: '5px' }}>{strength}</li>
          ))}
        </ul>
      </div>

      {/* Weaknesses */}
      <div style={{ 
        marginBottom: '20px', 
        padding: '20px', 
        background: '#f8d7da',
        borderRadius: '8px',
        border: '1px solid #f5c6cb',
      }}>
        <h3 style={{ marginTop: 0, color: '#721c24' }}>Areas for Improvement</h3>
        <ul style={{ marginBottom: 0 }}>
          {report.weaknesses.map((weakness, i) => (
            <li key={i} style={{ color: '#721c24', marginBottom: '5px' }}>{weakness}</li>
          ))}
        </ul>
      </div>

      {/* Actionable Feedback */}
      <div style={{ 
        marginBottom: '30px', 
        padding: '20px', 
        background: '#e6f3ff',
        borderRadius: '8px',
        border: '1px solid #b3d7ff',
      }}>
        <h3 style={{ marginTop: 0, color: '#004085' }}>Actionable Feedback</h3>
        <ul style={{ marginBottom: 0 }}>
          {report.actionable_feedback.map((feedback, i) => (
            <li key={i} style={{ color: '#004085', marginBottom: '5px' }}>{feedback}</li>
          ))}
        </ul>
      </div>

      {/* Back Button */}
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '12px 30px',
            fontSize: '16px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Start New Interview
        </button>
      </div>
    </div>
  );
}

export default InterviewReport;
