import React from "react";
import "./QuestionSection.css";

const QuestionSection = ({ questionText }) => {
  return (
    <div className="question-section">
      {questionText ? (
        <>
          <h2>Question</h2>
          <p className="question-text">{questionText}</p>
        </>
      ) : (
        <p>No question selected</p>
      )}
    </div>
  );
};

export default QuestionSection;
