import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const CreateTest = () => {
  const [testTitle, setTestTitle] = useState("");
  const [testDescription, setTestDescription] = useState("");
  const [questions, setQuestions] = useState([]);

  const navigate = useNavigate();
  const { test_id } = useParams();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/questions");
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };
    fetchQuestions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Navigate to user dashboard
    navigate(`/user/dashboard/${localStorage.getItem("user_id")}`);
  };

  const handleAddQuestion = async (questionId) => {
    try {
      const createdBy = localStorage.getItem("user_id");
      await axios.post(`http://localhost:5000/tests/${test_id}/add-question`, {
        test_title: testTitle,
        test_description: testDescription,
        created_by: createdBy,
        question_id: questionId,
      });
      // Optionally update UI to indicate the question has been added to the test
    } catch (error) {
      console.error("Error adding question to test:", error);
    }
  };

  return (
    <div className="container">
      <h1>Create New Test</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="testTitle">Test Title</label>
          <input
            type="text"
            id="testTitle"
            value={testTitle}
            onChange={(e) => setTestTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="testDescription">Test Description</label>
          <textarea
            id="testDescription"
            value={testDescription}
            onChange={(e) => setTestDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Test</button>
      </form>
      <h2>Available Questions</h2>
      <table>
        <thead>
          <tr>
            <th>Question Text</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question) => (
            <tr key={question.question_id}>
              <td>{question.question_text}</td>
              <td>
                <button onClick={() => handleAddQuestion(question.question_id)}>
                  Add
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CreateTest;
