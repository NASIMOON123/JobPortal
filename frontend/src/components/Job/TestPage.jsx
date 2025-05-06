import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getQuestionsByDomainAndProgress } from './questions';
import './TestPage.css'
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import signatureImg from './assets/signature.jpeg';

const TestPage = () => {
  const location = useLocation();
  const { domain, progress } = location.state || {};

  const [selectedOption, setSelectedOption] = useState([]);
  const [performance, setPerformance] = useState(null);
  const [keepLearning, setKeepLearning] = useState(false);
  const [feedback, setFeedback] = useState([]);
  const [timeLeft, setTimeLeft] = useState(600);

  const questions = getQuestionsByDomainAndProgress(domain, progress);

  useEffect(() => {
    if (performance !== null) return;
    if (timeLeft === 0) {
      calculatePerformance();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, performance]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleOptionChange = (e, questionIndex) => {
    const updatedSelectedOptions = [...selectedOption];
    updatedSelectedOptions[questionIndex] = e.target.value;
    setSelectedOption(updatedSelectedOptions);
  };

  const calculatePerformance = () => {
    let score = 0;
    const result = questions.map((q, index) => {
      const isCorrect = selectedOption[index] === q.answer;
      if (isCorrect) score++;
      return {
        ...q,
        isCorrect,
        selectedOption: selectedOption[index],
      };
    });

    setPerformance(score);
    setKeepLearning(score < 8);
    setFeedback(result);
  };



  return (
    <div
      className="test-page-container"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>🎯 All the best!</h2>
      <div
        className="test-box"
        style={{
          border: '2px solid green',
          padding: '20px',
          borderRadius: '10px',
          maxWidth: '800px',
          width: '100%',
        }}
      >
        <h4 className='test' style={{ textAlign: 'center' }}>Test Questions</h4>
        <h4 style={{ textAlign: 'center', color: 'red' }}>
          ⏰ Time Left: {formatTime(timeLeft)}
        </h4>

        {questions.map((q, index) => (
          <div className="question" key={index} style={{ marginBottom: '20px' }}>
            <h3>{index + 1}. {q.question}</h3>
            <div className="options">
              {q.options.map((option, optionIndex) => (
                <label key={optionIndex} style={{ display: 'block', margin: '4px 0' }}>
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={option}
                    onChange={(e) => handleOptionChange(e, index)}
                    checked={selectedOption[index] === option}
                    style={{ marginRight: '8px' }}
                    disabled={performance !== null}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}

        <div className="submit-btn-container" style={{ textAlign: 'center' }}>
          <button
            onClick={calculatePerformance}
            className="submit-btn"
            disabled={performance !== null}
            style={{
              backgroundColor: 'green',
              color: 'white',
              padding: '10px 20px',
              fontSize: '16px',
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Submit
          </button>
        </div>

        {performance !== null && (
          <div className="performance-feedback" style={{ marginTop: '30px', textAlign: 'center' }}>
            <h3>Your Performance: {performance}/10</h3>
            <p>
              {performance >= 8
                ? '🌟 Excellent!'
                : performance >= 5
                ? '👍 Average'
                : '📘 Keep Practicing'}
            </p>
            {keepLearning && <p>Keep learning! You're doing great!</p>}
          </div>
        )}

        {performance !== null && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            
          </div>
        )}

        {performance !== null && (
          <div className="answer-feedback" style={{ marginTop: '30px' }}>
            <h3>Answer Feedback:</h3>
            {feedback.map((q, index) => (
              <div className="feedback" key={index} style={{ marginBottom: '20px' }}>
                <h4>{q.question}</h4>
                <div className="answer-options">
                  {q.options.map((option, optionIndex) => {
                    const isSelected = q.selectedOption === option;
                    const isCorrect = option === q.answer;
                    const wasCorrectlySelected = isSelected && isCorrect;
                    const wasIncorrectlySelected = isSelected && !isCorrect;
                    const shouldShowCorrect = !isSelected && isCorrect;

                    return (
                      <div
                        key={optionIndex}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          backgroundColor: wasCorrectlySelected
                            ? '#d4edda'
                            : wasIncorrectlySelected
                            ? '#f8d7da'
                            : shouldShowCorrect
                            ? '#d4edda'
                            : 'transparent',
                          padding: '5px 10px',
                          borderRadius: '5px',
                          marginBottom: '5px',
                        }}
                      >
                        <span style={{ flexGrow: 1 }}>{option}</span>
                        {wasCorrectlySelected && <span style={{ color: 'green' }}>✔</span>}
                        {wasIncorrectlySelected && <span style={{ color: 'red' }}>✖</span>}
                        {shouldShowCorrect && <span style={{ color: 'green' }}>✔</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestPage;
