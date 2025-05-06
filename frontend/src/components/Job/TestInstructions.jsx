
import React from 'react';
	import { useNavigate, useLocation } from 'react-router-dom';
	import './TestInstructions.css';

	const TestInstructionsPage = () => {
	  const navigate = useNavigate();
	  const location = useLocation();
	  const { domain, progress } = location.state || {};

	  return (
	    <div className="instructions-container">
	      <h2>Test Guidelines</h2>
	      <div className="guidelines">
		<ul>
		  <li>This test consists of 10 multiple-choice questions.</li>
		  <li>Each correct answer will add 1 mark to your score.</li>
		  <li>For each wrong answer, 1 mark will be deducted.</li>
		  <li>Make sure to answer all questions before submitting the test.</li>
		</ul>
	      </div>

	      <div className="start-test-btn-container">
		<button 
		  onClick={() => {
		    if (domain && progress) {
		      navigate('/job/TestPage', { state: { domain, progress } });
		    } else {
		      alert("Missing test data. Please go back and select domain/progress.");
		    }
		  }} 
		  className="start-test-btn"
		>
		  Take Test
		</button>
	      </div>
	    </div>
	  );
	};

	export default TestInstructionsPage;