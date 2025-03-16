import axios from "axios";

// Set the base URL of the backend
const API_URL = "http://localhost:5000/api/auth";

// Register User
export const registerUser = async (userData) => {
  return axios.post(`${API_URL}/register`, userData);
};

// Login User
export const loginUser = async (userData) => {
  return axios.post(`${API_URL}/login`, userData);
};
