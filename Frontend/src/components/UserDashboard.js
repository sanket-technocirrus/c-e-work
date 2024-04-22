import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserDashboard.css"; // Import the CSS file

const UserDashboard = () => {
  const [tests, setTests] = useState([]);

  const fetchTests = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/tests/user/${localStorage.getItem("user_id")}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setTests(response.data);
    } catch (error) {
      console.error("Error fetching tests:", error);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const handleCreateNewTest = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/tests-user/generate-id`,
        {}, // No request body needed
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // Navigate to the CreateTest page with the generated test_id
      window.location.href = `/create-test/${response.data.test_id}`;
    } catch (error) {
      console.error("Error generating test ID:", error);
    }
  };

  const handleDeleteTest = async (testId) => {
    try {
      await axios.delete(`http://localhost:5000/tests/${testId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // After successful deletion, fetch the updated list of tests
      fetchTests();
    } catch (error) {
      console.error("Error deleting test:", error);
    }
  };

  const handleViewTest = (testId) => {
    // Redirect the user to the page displaying questions for the specified test
    window.location.href = `/test/${testId}/view-questions`;
  };

  const handleEditTest = (testId) => {
    // Redirect the user to the edit page for the specified test
    window.location.href = `/edit-test/${testId}`;
  };

  const handleManageParticipants = (testId) => {
    // Redirect the user to the manage participants page for the specified test
    window.location.href = `/manage-participants/${testId}`;
  };

  return (
    <div className="container">
      <h1 className="header">Welcome to User Dashboard</h1>
      <div>
        <button onClick={handleCreateNewTest} className="create-test-button">
          Create New Test
        </button>
      </div>
      <h2>Your Tests</h2>
      <table>
        <thead>
          <tr>
            <th>Test ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tests.map((test) => (
            <tr key={test.test_id}>
              <td>{test.test_id}</td>
              <td>{test.test_title}</td>
              <td>{test.test_description}</td>
              <td className="actions">
                <button onClick={() => handleDeleteTest(test.test_id)}>
                  Delete
                </button>
                <button onClick={() => handleViewTest(test.test_id)}>
                  View Test
                </button>
                <button onClick={() => handleEditTest(test.test_id)}>
                  Edit
                </button>
                <button onClick={() => handleManageParticipants(test.test_id)}>
                  Manage Participants
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserDashboard;
