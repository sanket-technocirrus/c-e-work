import React, { useEffect, useState } from "react";
import axios from "axios";
import "./QuestionUi.css";
import { Link, useNavigate, useParams } from "react-router-dom";

const QuestionUi = () => {
  const navigate = useNavigate();
  const { testId } = useParams();
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
    <div className="question-container">
      <h2>List of Questions</h2>
      <ul>
        {questions.map((question, index) => (
          <li key={index} className="question-box">
            <div
              dangerouslySetInnerHTML={{ __html: question.question_content }}
            ></div>
            {/*  for showing question passed from question ui on landing page */}

            <Link
              to={{
                pathname: `/landing/${question.question_id}`,
                state: {
                  questionContent: question.question_content,
                },
              }}
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
