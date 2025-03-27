import React, { useState, useEffect } from "react";
import { fetchCases } from "../services/caseService";

const DefendantDashboard = ({ token }) => {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    const getCases = async () => {
      try {
        const data = await fetchCases(token);
        console.log("🚀 Cases received in Defendant Dashboard:", data);
        setCases(data);
      } catch (error) {
        console.error(error);
      }
    };
    getCases();
  }, [token]);

  return (
    <div>
      <h2>Defendant Dashboard</h2>
      <ul>
        {cases.length === 0 ? (
          <p>No cases assigned to you.</p>
        ) : (
          cases.map((c) => (
            <li key={c._id}>
              <strong>Case:</strong> {c.caseNumber} <br />
              <strong>Details:</strong> {c.caseDetails} <br />
              <strong>Status:</strong> {c.status} <br />
              {c.hearingDate && <strong>Hearing Date:</strong>} {c.hearingDate}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default DefendantDashboard;
