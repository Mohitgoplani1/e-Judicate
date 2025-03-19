import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import JudgeDashboard from "./pages/JudgeDashboard";
import Pdashboard from "./pages/Pdashboard";
import DefendantDashboard from "./pages/DefendantDashboard";
import "./App.css"; // Import CSS

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to e-Judicate</h1>
      <p className="home-description">Your digital court hearing system</p>
      <div className="home-buttons">
        <button className="login-btn" onClick={() => navigate("/login")}>Login</button>
        <button className="register-btn" onClick={() => navigate("/register")}>Register</button>
      </div>
    </div>
  );
};

const App = () => {
  const role = localStorage.getItem("role");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/judge-dashboard" element={role === "judge" ? <JudgeDashboard /> : <Navigate to="/login" />} />
        <Route path="/petitioner-dashboard" element={role === "petitioner" ? <Pdashboard /> : <Navigate to="/login" />} />
        <Route path="/defendant-dashboard" element={role === "defendant" ? <DefendantDashboard /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
