import React from "react";
import { Inbox } from "lucide-react";

const EmptyState = ({ icon: Icon = Inbox, title = "Nothing here yet", message = "" }) => {
  return (
    <div className="state-box">
      <Icon size={40} strokeWidth={1.5} />
      <h4>{title}</h4>
      {message && <p>{message}</p>}
    </div>
  );
};

export default EmptyState;
