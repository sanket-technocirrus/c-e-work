import React, { useEffect, useState } from "react";
import axios from "axios";
import "./QuestionUi.css";
import { Link } from "react-router-dom";

const QuestionUi = () => {
  const testId = localStorage.getItem("test id");
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/tests/${testId}/questions`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, [testId]);

  return (
    <div className="QuestionUi-container">
      <h2 className="QuestionUi-title">List of Questions</h2>
      <ul className="QuestionUi-list">
        {questions.map((question, index) => (
          <li key={index} className="QuestionUi-item">
            <div
              className="QuestionUi-question"
              dangerouslySetInnerHTML={{ __html: question.question_content }}
            ></div>
            <Link
              to={{
                pathname: `/landing/${question.question_id}`,
                state: {
                  questionContent: question.question_content,
                },
              }}
              className="QuestionUi-link"
            >
              View Question
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionUi;
