import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(""); // Add OTP state
  const [showOtpInput, setShowOtpInput] = useState(false);
  const navigate = useNavigate();

  const requestOTP = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/otp/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (data.success) {
        alert("OTP sent to your email.");
        setShowOtpInput(true);
      } else {
        alert("Failed to send OTP.");
      }
    } catch (error) {
      console.error("OTP request error:", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        alert("Login successful!");

        setTimeout(() => {
          if (data.role === "judge") navigate("/judge-dashboard");
          else if (data.role === "petitioner") navigate("/petitioner-dashboard");
          else if (data.role === "defendant") navigate("/defendant-dashboard");
        }, 100);
      } else {
        alert("Login failed. Please check your credentials and OTP.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {!showOtpInput && <button type="button" onClick={requestOTP}>Request OTP</button>}
        {showOtpInput && (
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        )}
        {showOtpInput && <button type="submit">Login</button>}
      </form>
    </div>
  );
};

export default Login;