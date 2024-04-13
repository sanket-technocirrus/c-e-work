import React from "react";
import "./App.css";
import SignupForm from "./components/SignupForm";
import LoginForm from "./components/LoginForm";
import Landing from "./components/Landing";
import AdminDashboard from "./components/AdminDashboard";
import QuestionUi from "./components/QuestionUI";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<SignupForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/questions" element={<QuestionUi />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
