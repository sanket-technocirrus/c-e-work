import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginForm.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email: email,
        password: password,
      });
      if (response.data.error === null) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role); // Store user role
        if (response.data.role === 1) {
          navigate("/admin/dashboard"); // Redirect to admin dashboard if role is admin
        } else {
          // navigate("/landing"); // Redirect to landing page if role is user
          navigate("/questions");
        }
      }
    } catch (error) {
      console.error("Error logging in:", error);
      window.alert("Invalid Username or Password");
      window.location.reload();
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-header">Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          required
        />
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
