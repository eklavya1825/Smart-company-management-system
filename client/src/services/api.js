import axios from "axios";

// Automatically uses your Render URL on Vercel, and falls back to localhost during local development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL, 
  withCredentials: true, // Crucial for handling cookies/sessions across domains safely
});

// Attach the JWT token (if present) to every outgoing request heading to Render
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("scms_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token is invalid/expired, clear it and redirect the user back to the login route
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("scms_token");
      localStorage.removeItem("scms_user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
