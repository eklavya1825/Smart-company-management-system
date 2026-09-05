import React from "react";
import { useNavigate } from "react-router-dom";
import { SearchX } from "lucide-react";

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="state-box" style={{ minHeight: "60vh" }}>
      <SearchX size={44} strokeWidth={1.5} />
      <h4>Page not found</h4>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate("/")}>
        Go to Dashboard
      </button>
    </div>
  );
};

export default NotFoundPage;
