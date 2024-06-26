import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AttemptTest.css";

const AttemptTest = () => {
  const [email, setEmail] = useState("");
  const [testId, setTestId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.clear();
  }, []);

  const handleAttemptTest = async () => {
    try {
      const response = await axios.post("http://localhost:5000/attempt-test", {
        email: email,
        testId: testId,
      });
      const { isValid } = response.data;
      if (isValid) {
        localStorage.setItem("email", email);
        localStorage.setItem("test id", testId);
        window.location.href = `/questions`;
      } else {
        setError("Invalid email or test ID");
      }
    } catch (error) {
      console.error("Error attempting test:", error);
      setError("Error attempting test");
    }
  };

  return (
    <div className="attempt-test-container">
      {error && <p className="attempt-test-error">{error}</p>}
      <div className="attempt-test-form-group">
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="attempt-test-form-group">
        <label>Test ID:</label>
        <input
          type="text"
          value={testId}
          onChange={(e) => setTestId(e.target.value)}
        />
      </div>
      <button className="attempt-test-btn-attempt" onClick={handleAttemptTest}>
        Attempt Test
      </button>
    </div>
  );
};

export default AttemptTest;
