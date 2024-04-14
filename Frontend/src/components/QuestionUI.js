// //v5 p2 for click and navigate

import React from "react";
import "./QuestionUi.css"; // Import CSS file for styling
import { useNavigate } from "react-router-dom";
import Landing from "./Landing";

const QuestionUi = () => {
  const navigate = useNavigate();

  const questions = [
    {
      id: 1,
      title: "Question 1",
      description:
        "This is the first question. It should wrap within the fixed-size box.aaaaaaaaaaaaaaaaaaaaaaaaaaaaavvvvvvvvvvvvvvvvvvvvvvvddddddddddddddddddddddeeeeeeeeeeeeeeeeeeeeeehhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhiiiiiiiiiiiiiiiiiiiiiiiidddddddddddddddddddddddddkkkkkkkkkkkkkkkkaaaaaaaaaaaaauuuuuuuuuuuu",
    },
    {
      id: 2,
      title: "Question 2",
      description:
        "This is the second question. It should also wrap within the fixed-size box.",
    },
    {
      id: 3,
      title: "Question 3",
      description: "This is the third question. It should wrap too.",
    },
    {
      id: 4,
      title: "Question 3",
      description: "This is the third question. It should wrap too.",
    },
    {
      id: 5,
      title: "Question 3",
      description: "This is the third question. It should wrap too.",
    },
    {
      id: 6,
      title: "Question 3",
      description: "This is the third question. It should wrap too.",
    },
    {
      id: 7,
      title: "Question 3",
      description: "This is the third question. It should wrap too.",
    },
    {
      id: 8,
      title: "Question 3",
      description: "This is the third question. It should wrap too.",
    },
    {
      id: 9,
      title: "Question 3",
      description: "This is the third question. It should wrap too.",
    },
    {
      id: 10,
      title: "Question 3",
      description: "This is the third question. It should wrap too.",
    },
  ];

  const handleQuestionClick = (id) => {
    // navigate(`/landing/${id}`);
    const question = questions.find((q) => q.id === parseInt(id));
    navigate(`/landing`, { state: { data: question } });
  };

  return (
    <div className="question-container">
      <h2>List of Questions</h2>
      <ul>
        {questions.map((question) => (
          <li
            key={question.id}
            className="question-box"
            onClick={() => handleQuestionClick(question.id)}
          >
            <h3>{question.title}</h3>
            <p>{question.description}</p>
          </li>
        ))}
      </ul>
      {/* prepare the Landing component to receive the questions prop and render it with the appropriate question details when triggered by user interaction. It's a placeholder in the QuestionUi component, waiting for the user to click on a question to actually render the Landing component with the selected question's details. */}
      {/* <Landing questions={questions} /> */}
    </div>
  );
};

export default QuestionUi;
