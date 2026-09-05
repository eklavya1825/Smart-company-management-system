import React from "react";
import { AlertTriangle } from "lucide-react";

const ErrorState = ({ message = "Something went wrong.", onRetry }) => {
  return (
    <div className="state-box">
      <AlertTriangle size={36} strokeWidth={1.5} color="var(--color-danger)" />
      <h4>Unable to load data</h4>
      <p>{message}</p>
      {onRetry && (
        <button className="btn btn-secondary btn-sm" style={{ marginTop: 14 }} onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
