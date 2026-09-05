import React from "react";

const ChartCard = ({ title, subtitle, children, height = 260 }) => (
  <div className="card">
    {title && <h3 className="card-title">{title}</h3>}
    {subtitle && <p className="card-subtitle">{subtitle}</p>}
    <div style={{ width: "100%", height }}>{children}</div>
  </div>
);

export default ChartCard;
