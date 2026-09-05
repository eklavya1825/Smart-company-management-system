import React from "react";

const StatCard = ({ label, value, icon: Icon, color = "#4f46e5" }) => {
  return (
    <div className="card stat-card">
      <div className="stat-card-info">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
      </div>
      <div className="stat-card-icon" style={{ background: `${color}1a`, color }}>
        <Icon size={22} />
      </div>
    </div>
  );
};

export default StatCard;
