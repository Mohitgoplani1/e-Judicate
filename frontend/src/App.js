import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import JudgeDashboard from "./pages/JudgeDashboard";
import DefendantDashboard from "./pages/DefendantDashboard";
import Pdashboard from "./pages/Pdashboard";

const App = () => {
  const [role, setRole] = useState(localStorage.getItem("role")); // Get role from localStorage

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole) setRole(storedRole);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/judge-dashboard" element={role === "judge" ? <JudgeDashboard /> : <Navigate to="/login" />} />
        <Route path="/petitioner-dashboard" element={role === "petitioner" ? <Pdashboard /> : <Navigate to="/login" />} />
        <Route path="/defendant-dashboard" element={role === "defendant" ? <DefendantDashboard /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
