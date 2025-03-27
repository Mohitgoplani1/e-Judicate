import React, { useState } from "react";
import { registerCase } from "../services/caseService";

const PDashboard = ({ token }) => {
  const [caseNumber, setCaseNumber] = useState("");
  const [defendant, setDefendant] = useState("");
  const [caseDetails, setCaseDetails] = useState("");
  const [message, setMessage] = useState("");

  const handleRegisterCase = async (e) => {
    e.preventDefault();
  
    console.log("Sending Data:", { caseNumber, defendant, caseDetails });
  
    try {
      const caseData = { caseNumber, defendant, caseDetails };
      const response = await registerCase(caseData, token);
      console.log(response.message);
    } catch (error) {
      console.error("Error:", error.response?.data?.message || error.message);
    }
  };  

  return (
    <div>
      <h2>Petitioner Dashboard</h2>
      <form onSubmit={handleRegisterCase}>
        <input
          type="text"
          placeholder="Case Number"
          value={caseNumber}
          onChange={(e) => setCaseNumber(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Defendant ID"
          value={defendant}
          onChange={(e) => setDefendant(e.target.value)}
          required
        />
        <textarea
          placeholder="Case Details"
          value={caseDetails}
          onChange={(e) => setCaseDetails(e.target.value)}
          required
        />
        <button type="submit">Register Case</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default PDashboard;
