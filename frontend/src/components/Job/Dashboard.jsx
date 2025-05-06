import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';


const Dashboard = () => {
  const [domain, setDomain] = useState('');
  const [progress, setProgress] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation to ensure both domain and progress are filled
    if (!domain || !progress.trim()) {
      alert('Please select a domain and provide your progress.');
      return;
    }
    navigate('/job/TestInstructions', {

      state: { domain, progress, studentName: 'Student' }
    });
    
  
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-card">
        <h2>Hello, Student!</h2>
        <p>Here’s your learning summary 👇</p>

        <form onSubmit={handleSubmit} className="form-section">
          <label>Select Domain:</label>
          <select value={domain} onChange={(e) => setDomain(e.target.value)} required>
            <option value="">--Choose Domain--</option>
            <option value="Web Development">Web Development</option>
            <option value="AI & ML">AI & ML</option>
            <option value="Data Science">Data Science</option>
            <option value="React JS">React JS</option>
            <option value="Java">Java</option>
            <option value="Python">Python</option>
          </select>

          <label>Enter your progress:</label>
          <select value={progress} onChange={(e) => setProgress(e.target.value)} required>
            <option value="">--Choose level--</option>
            <option value="starting">Easy</option>
            <option value=" medium">Medium</option>
            <option value="advanced">Advanced</option>
          </select>

          <button type="submit" className="action-btn">Start Test</button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;