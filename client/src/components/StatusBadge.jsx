import React from "react";

const statusMap = {
  Active: "success",
  Present: "success",
  Approved: "success",
  Completed: "success",
  Paid: "success",
  Done: "success",

  Pending: "warning",
  Late: "warning",
  Processing: "warning",
  "Half Day": "warning",
  Planning: "warning",
  "To Do": "warning",

  Absent: "danger",
  Rejected: "danger",
  Inactive: "danger",
  "On Hold": "danger",

  "In Progress": "info",
  "On Leave": "info",
  "In Review": "info",

  Draft: "neutral",
};

const StatusBadge = ({ status }) => {
  const variant = statusMap[status] || "neutral";
  return <span className={`badge badge-${variant}`}>{status}</span>;
};

export default StatusBadge;
