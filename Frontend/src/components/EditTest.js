import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EditTest.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const EditTest = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");

  const { testId } = useParams();
  const [testDetails, setTestDetails] = useState({
    test_title: "",
    test_description: "",
  });
  const [questions, setQuestions] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/tests/${testId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setTestDetails(response.data);
      } catch (error) {
        console.error("Error fetching test details:", error);
      }
    };

    const fetchAllQuestions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/all-questions",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setAllQuestions(response.data);
      } catch (error) {
        console.error("Error fetching all questions:", error);
      }
    };

    const fetchTestQuestions = async () => {
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
        console.error("Error fetching test questions:", error);
      }
    };

    fetchTestDetails();
    fetchAllQuestions();
    fetchTestQuestions();
  }, [testId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTestDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      await axios.delete(
        `http://localhost:5000/tests/${testId}/questions/${questionId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const updatedQuestions = questions.filter(
        (question) => question.question_id !== questionId
      );
      setQuestions(updatedQuestions);
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/tests/${testId}`, testDetails, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      //   window.location.href = `/test/${testId}/view-questions`;
      window.location.reload();
    } catch (error) {
      console.error("Error updating test details:", error);
    }
  };

  const handleAddQuestion = async (questionId) => {
    try {
      await axios.post(
        `http://localhost:5000/tests/${testId}/questions/${questionId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const addedQuestion = allQuestions.find(
        (question) => question.question_id === questionId
      );
      setQuestions((prevQuestions) => [...prevQuestions, addedQuestion]);
      setAllQuestions((prevAllQuestions) =>
        prevAllQuestions.filter(
          (question) => question.question_id !== questionId
        )
      );
    } catch (error) {
      console.error("Error adding question to test:", error);
    }
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(`http://localhost:5000/tests/${testId}`, testDetails, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      navigate(`/user/dashboard/${userId}`);
    } catch (error) {
      console.error("Error updating test details:", error);
    }
  };

  return (
    <div className="container">
      <h1>Edit Test</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="test_title">Title:</label>
          <input
            type="text"
            id="test_title"
            name="test_title"
            value={testDetails.test_title}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="test_description">Description:</label>
          <textarea
            id="test_description"
            name="test_description"
            value={testDetails.test_description}
            onChange={handleChange}
          />
        </div>
        <div>
          <h2>Questions</h2>
          <ul>
            {questions.map((question) => (
              <li key={question.question_id}>
                {question.question_text}
                <button
                  className="delete-button"
                  onClick={() => handleDeleteQuestion(question.question_id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Add Questions</h2>
          <ul>
            {Array.isArray(allQuestions) &&
              allQuestions.map((question) => (
                <li key={question.question_id}>
                  {question.question_text}
                  <button
                    className="add-button"
                    onClick={() => handleAddQuestion(question.question_id)}
                  >
                    Add
                  </button>
                </li>
              ))}
          </ul>
        </div>
        {/* <button type="submit">Save Changes</button> */}
      </form>
      <button className="save-button" onClick={handleSaveChanges}>
        Save Changes
      </button>
    </div>
  );
};

export default EditTest;
