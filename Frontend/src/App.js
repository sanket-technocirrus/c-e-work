import React from "react";
import "./App.css";
import SignupForm from "./components/SignupForm";
import LoginForm from "./components/LoginForm";
import Landing from "./components/Landing";
import AdminDashboard from "./components/AdminDashboard";
import QuestionUi from "./components/QuestionUI";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserDashboard from "./components/UserDashboard";
import CreateTest from "./components/CreateTest";
import TestView from "./components/TestView";
import EditTest from "./components/EditTest";

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
          <Route path="/user/dashboard/:user_id" element={<UserDashboard />} />
          <Route path="/create-test/:test_id" element={<CreateTest />} />
          <Route path="/test/:testId/view-questions" element={<TestView />} />
          <Route path="/edit-test/:testId" element={<EditTest />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
