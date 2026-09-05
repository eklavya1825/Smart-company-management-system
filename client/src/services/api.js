import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL,
});

// Attach the JWT token (if present) to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("scms_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token is invalid/expired, clear it and send the user back to login
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
