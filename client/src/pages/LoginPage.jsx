import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Boxes, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const demoAccounts = [
  { label: "Admin", email: "admin@scms.com", password: "admin123" },
  { label: "HR", email: "hr@scms.com", password: "hr123" },
  { label: "Manager", email: "manager@scms.com", password: "manager123" },
  { label: "Employee", email: "employee@scms.com", password: "employee123" },
];

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">
            <Boxes size={22} color="#fff" />
          </div>
        </div>
        <h1 className="login-title">Welcome to SCMS</h1>
        <p className="login-subtitle">Sign in to access your company dashboard</p>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@scms.com"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
            <LogIn size={16} />
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="demo-accounts">
          <p>Demo Accounts (click to autofill)</p>
          {demoAccounts.map((acc) => (
            <button key={acc.email} className="demo-account-btn" onClick={() => fillDemo(acc)} type="button">
              <span>{acc.label}</span>
              <span className="text-muted">{acc.email}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
