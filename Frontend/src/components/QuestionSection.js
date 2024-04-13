import React from "react";
import "./QuestionSection.css";

const QuestionSection = ({ question }) => {
  return (
    <div className="question-section">
      {question ? (
        <>
          <h2>{question.title}</h2>
          <p className="problem-statement">{question.description}</p>
        </>
      ) : (
        <p>Question not found</p>
      )}
    </div>
  );
};

export default QuestionSection;
