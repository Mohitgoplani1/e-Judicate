import React, { useState, useEffect } from "react";
import { fetchCases, assignHearingDate } from "../services/caseService";

const JudgeDashboard = ({ token }) => {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState("");
  const [hearingDate, setHearingDate] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getCases = async () => {
      try {
        const data = await fetchCases();
        setCases(data);
      } catch (error) {
        console.error(error);
      }
    };
    getCases();
  }, [token]);

  const handleAssignHearing = async () => {
    if (!selectedCase) {
      setMessage("No case selected.");
      return;
    }

    try {
      const response = await assignHearingDate(selectedCase, hearingDate);
      setMessage(response.message || "Hearing date assigned.");
    } catch (error) {
      setMessage("Error assigning hearing date.");
    }
  };

  return (
    <div>
      <h2>Judge Dashboard</h2>
      {cases.length === 0 ? (
        <p>No cases available</p>
      ) : (
        <select onChange={(e) => setSelectedCase(e.target.value)}>
          <option value="">Select a Case</option>
          {cases.map((c) => (
            <option key={c._id} value={c._id}>
              {c.caseNumber} - {c.caseDetails}
            </option>
          ))}
        </select>
      )}
      <input
        type="datetime-local"
        value={hearingDate}
        onChange={(e) => setHearingDate(e.target.value)}
      />
      <button onClick={handleAssignHearing}>Assign Hearing Date</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default JudgeDashboard;
