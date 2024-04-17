import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const TestView = () => {
  const [questions, setQuestions] = useState([]);
  const { testId } = useParams(); // Ensure test_id is correctly extracted

  useEffect(() => {
    console.log("Test ID:", testId); // Log test_id to verify its value

    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/tests/${testId}/questions`, // Use test_id in the URL
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
    <div>
      <h1>Test Questions</h1>
      <ul>
        {questions.map((question) => (
          <li key={question.question_id}>{question.question_text}</li>
        ))}
      </ul>
    </div>
  );
};

export default TestView;
