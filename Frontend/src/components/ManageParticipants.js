import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ManageParticipants.css";
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const ManageParticipants = () => {
  const [email, setEmail] = useState("");
  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState("");
  const { testId } = useParams();

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/participants/${testId}`
        );
        setParticipants(response.data);
      } catch (error) {
        console.error("Error fetching participants:", error);
        setError("Error fetching participants");
      }
    };

    fetchParticipants();
  }, [testId]);

  const handleAddParticipant = async () => {
    try {
      // to validate email format
      if (!validateEmail(email)) {
        setError("Please enter a valid email address");
        return;
      }

      const participantId = uuidv4();
      const userId = localStorage.getItem("user_id");

      await axios.post(
        "http://localhost:5000/add-participant",
        {
          participant_id: participantId,
          user_id: userId,
          email: email,
          test_id: testId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // to clear the email input and any previous error messages
      setEmail("");
      setError("");
      window.location.reload();
    } catch (error) {
      console.error("Error adding participant:", error.response.data);
      setError(error.response.data.error);
    }
  };

  const handleDeleteParticipant = async (participantId) => {
    try {
      await axios.delete(
        `http://localhost:5000/participants/${participantId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // now fetch updated list of participants after deletion
      const response = await axios.get(
        `http://localhost:5000/participants/${testId}`
      );
      setParticipants(response.data);
    } catch (error) {
      console.error("Error deleting participant:", error);
      setError("Error deleting participant");
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleGoToDashboard = () => {
    window.location.href = `/user/dashboard/${localStorage.getItem("user_id")}`;
  };

  return (
    <div className="manage-participants-container">
      <h2>Manage Participants</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button onClick={handleAddParticipant}>Add Participant</button>

      <div className="participants-list">
        <h3>Participants of Test:</h3>
        <ul>
          {participants.map((participant) => (
            <li key={participant.participant_id}>
              {participant.email}
              <button
                onClick={() =>
                  handleDeleteParticipant(participant.participant_id)
                }
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
      <button onClick={handleGoToDashboard}>Go To Dashboard</button>
    </div>
  );
};

export default ManageParticipants;
