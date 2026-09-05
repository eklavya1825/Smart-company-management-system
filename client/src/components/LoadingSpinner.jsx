import React from "react";

const LoadingSpinner = ({ label = "Loading..." }) => {
  return (
    <div className="state-box">
      <div className="spinner" />
      <p style={{ marginTop: 14 }}>{label}</p>
    </div>
  );
};

export default LoadingSpinner;
