import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./TestView.css";

const TestView = () => {
  const [questions, setQuestions] = useState([]);
  const { testId } = useParams();

  useEffect(() => {
    console.log("Test ID:", testId);

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
    <div className="TestView-container">
      <h1 className="TestView-title">Test Questions</h1>
      <ul className="TestView-list">
        {questions.map((question) => (
          <li key={question.question_id} className="TestView-item">
            <div
              className="TestView-question"
              dangerouslySetInnerHTML={{ __html: question.question_content }}
            ></div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestView;
