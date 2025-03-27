import axios from "axios";

const API_URL = "http://localhost:5000/api/cases"; // Update backend URL if needed

// Get all cases (for Judge) or related cases (for Petitioner/Defendant)
export const fetchCases = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found! User might be logged out.");
    return [];
  }

  try {
    console.log("🔹 Fetching Cases - Sending Token:", token);
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Cases Received:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching cases:", error.response?.data || error.message);
    return [];
  }
};

// Register a new case (Petitioners only)
export const registerCase = async (caseData) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found! User might not be logged in.");
      return { error: "No token provided" };
    }

    console.log("📢 Registering Case - Sending Data:", caseData);

    const response = await axios.post(
      `${API_URL}/register`,
      caseData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Case Registered:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error registering case:", error.response?.data || error.message);
    return { error: error.response?.data || "Server error" };
  }
};

// Assign hearing date (Judges only)
export const assignHearingDate = async (caseId, hearingDate) => {
  const token = sessionStorage.getItem("token") || localStorage.getItem("token");

  if (!caseId) {
    console.error("❌ Error: caseId is missing!");
    return { error: "caseId is required" };
  }

  try {
    console.log("📅 Assigning hearing date - caseId:", caseId);

    const response = await axios.put(
      `${API_URL}/assign-hearing/${caseId}`,
      { hearingDate },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("✅ Hearing Date Assigned:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error assigning hearing date:", error.response?.data || error.message);
    return { error: error.response?.data || "Server error" };
  }
};
