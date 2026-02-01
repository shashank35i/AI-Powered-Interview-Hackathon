import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import InterviewSetup from './pages/InterviewSetup';
import InterviewSession from './pages/InterviewSession';
import InterviewReport from './pages/InterviewReport';

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
        {/* Header */}
        <header style={{
          background: '#007bff',
          color: 'white',
          padding: '15px 20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '24px', fontWeight: 'bold' }}>
              Mock Interview Platform
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<InterviewSetup />} />
            <Route path="/session" element={<InterviewSession />} />
            <Route path="/report" element={<InterviewReport />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer style={{
          textAlign: 'center',
          padding: '20px',
          color: '#666',
          marginTop: '40px',
        }}>
          Mock Interview Platform &copy; 2024
        </footer>
      </div>
    </Router>
  );
}

export default App;
