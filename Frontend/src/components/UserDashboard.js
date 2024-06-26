import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UserDashboard.css";

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
        {}, // no request body here
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
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
      // after successful deletion, fetch the updated list of tests
      fetchTests();
    } catch (error) {
      console.error("Error deleting test:", error);
    }
  };

  const handleViewTest = (testId) => {
    window.location.href = `/test/${testId}/view-questions`;
  };

  const handleEditTest = (testId) => {
    window.location.href = `/edit-test/${testId}`;
  };

  const handleManageParticipants = (testId) => {
    window.location.href = `/manage-participants/${testId}`;
  };

  return (
    <div className="user-dashboard-container">
      <h1 className="user-dashboard-header">Welcome to User Dashboard</h1>
      <div>
        <button
          onClick={handleCreateNewTest}
          className="user-dashboard-create-button"
        >
          Create New Test
        </button>
      </div>
      <h2>Your Tests</h2>
      <table className="user-dashboard-table">
        <thead>
          <tr>
            <th className="user-dashboard-th">Test ID</th>
            <th className="user-dashboard-th">Title</th>
            <th className="user-dashboard-th">Description</th>
            <th className="user-dashboard-th">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tests.map((test) => (
            <tr key={test.test_id}>
              <td className="user-dashboard-td">{test.test_id}</td>
              <td className="user-dashboard-td">{test.test_title}</td>
              <td className="user-dashboard-td">{test.test_description}</td>
              <td className="user-dashboard-td user-dashboard-actions">
                <button
                  onClick={() => handleDeleteTest(test.test_id)}
                  className="user-dashboard-button"
                >
                  Delete
                </button>
                <button
                  onClick={() => handleViewTest(test.test_id)}
                  className="user-dashboard-button"
                >
                  View Test
                </button>
                <button
                  onClick={() => handleEditTest(test.test_id)}
                  className="user-dashboard-button"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleManageParticipants(test.test_id)}
                  className="user-dashboard-button"
                >
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
