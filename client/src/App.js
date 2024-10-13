import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import LoginPage from "./LoginPage";
import AdminDashboard from "./Dashboard";
import "./App.css";
import UserDashboard from "./userdashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/userdashboard" element={<UserDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
