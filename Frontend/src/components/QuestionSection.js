import React from "react";
import "./QuestionSection.css";

// for showing question passed from question ui on landing page

const QuestionSection = ({ questionContent }) => {
  // console.log("Question Content:", questionContent);

  return (
    <div className="question-section">
      {questionContent ? (
        <>
          <h2>Question</h2>
          <div dangerouslySetInnerHTML={{ __html: questionContent }}></div>
        </>
      ) : (
        <p>No question selected</p>
      )}
    </div>
  );
};

export default QuestionSection;
