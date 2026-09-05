import React from "react";
import { Menu, Bell, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const routeTitles = {
  "/": "Dashboard",
  "/employees": "Employees",
  "/attendance": "Attendance",
  "/leaves": "Leave Management",
  "/projects": "Projects",
  "/departments": "Departments",
  "/payroll": "Payroll",
  "/performance": "Performance",
  "/announcements": "Announcements",
  "/reports": "Reports",
  "/settings": "Settings",
};

const Topbar = ({ onMenuClick, pathname }) => {
  const { theme, toggleTheme } = useTheme();

  const baseTitle =
    routeTitles[pathname] ||
    Object.keys(routeTitles).find((k) => k !== "/" && pathname.startsWith(k));
  const title = routeTitles[baseTitle] || routeTitles[pathname] || "SCMS";

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="menu-toggle" onClick={onMenuClick}>
          <Menu size={22} />
        </button>
        <span className="topbar-title">{title}</span>
      </div>
      <div className="topbar-right">
        <button className="icon-btn" onClick={toggleTheme} title="Toggle theme">
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <button className="icon-btn" title="Notifications">
          <Bell size={18} />
          <span className="notif-dot" />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
