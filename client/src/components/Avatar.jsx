import React from "react";
import { getInitials, getAvatarColor } from "../utils/helpers";

const Avatar = ({ name, size = 38 }) => {
  const color = getAvatarColor(name || "?");
  return (
    <div
      className="avatar"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: `${color}22`,
        color,
      }}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
