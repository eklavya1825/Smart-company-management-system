import React, { createContext, useState, useContext, useEffect } from "react";
//  Import your custom API instance instead of standard axios
import api from "../services/api"; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user session exists on app load
    const storedUser = localStorage.getItem("scms_user");
    const storedToken = localStorage.getItem("scms_token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Updated login function routing requests cleanly to Render
  const login = async (email, password) => {
    try {
      // Changed from axios.post('http://localhost...') to api.post
      const response = await api.post("/api/auth/login", { email, password });
      
      if (response.data.token) {
        localStorage.setItem("scms_token", response.data.token);
        localStorage.setItem("scms_user", JSON.stringify(response.data.user));
        setUser(response.data.user);
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("scms_token");
    localStorage.removeItem("scms_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
