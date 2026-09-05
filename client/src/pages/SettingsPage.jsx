import React, { useState } from "react";
import { User, Lock, Bell, Palette, Save } from "lucide-react";
import PageHeader from "../components/PageHeader";
import Avatar from "../components/Avatar";
import { FormInput } from "../components/FormInput";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "password", label: "Password", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
];

const SettingsPage = () => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("profile");
  const [notifPrefs, setNotifPrefs] = useState({
    email: true,
    announcements: true,
    leaveUpdates: true,
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <PageHeader title="Settings" subtitle="Manage your account preferences" />

      <div className="settings-section">
        <div className="flex-col gap-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`sidebar-link ${activeTab === t.id ? "active" : ""}`}
              style={{ color: activeTab === t.id ? "var(--color-primary)" : "var(--color-text-muted)", background: activeTab === t.id ? "var(--color-primary-light)" : "transparent" }}
              onClick={() => setActiveTab(t.id)}
            >
              <t.icon size={16} />
              {t.label}
            </button>
          ))}
        </div>

        <div className="card">
          {activeTab === "profile" && (
            <>
              <h3 className="card-title">Profile Information</h3>
              <p className="card-subtitle">Update your personal details</p>
              <div className="flex items-center gap-3" style={{ marginBottom: 20 }}>
                <Avatar name={user?.name} size={60} />
                <div>
                  <div style={{ fontWeight: 700 }}>{user?.name}</div>
                  <div className="text-muted" style={{ fontSize: 13 }}>
                    {user?.role}
                  </div>
                </div>
              </div>
              <div className="form-row">
                <FormInput label="Full Name" defaultValue={user?.name} />
                <FormInput label="Email" type="email" defaultValue={user?.email} />
              </div>
              <FormInput label="Phone" defaultValue={user?.employee?.phone || ""} />
              <button className="btn btn-primary" onClick={handleSave}>
                <Save size={16} /> {saved ? "Saved!" : "Save Changes"}
              </button>
            </>
          )}

          {activeTab === "password" && (
            <>
              <h3 className="card-title">Change Password</h3>
              <p className="card-subtitle">Choose a strong, unique password</p>
              <FormInput label="Current Password" type="password" />
              <FormInput label="New Password" type="password" />
              <FormInput label="Confirm New Password" type="password" />
              <button className="btn btn-primary" onClick={handleSave}>
                <Save size={16} /> {saved ? "Saved!" : "Update Password"}
              </button>
            </>
          )}

          {activeTab === "notifications" && (
            <>
              <h3 className="card-title">Notification Preferences</h3>
              <p className="card-subtitle">Choose what you want to be notified about</p>
              {[
                { key: "email", label: "Email notifications" },
                { key: "announcements", label: "Company announcements" },
                { key: "leaveUpdates", label: "Leave request updates" },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-center justify-between"
                  style={{ padding: "12px 0", borderBottom: "1px solid var(--color-border)", cursor: "pointer" }}
                >
                  <span style={{ fontSize: 14 }}>{item.label}</span>
                  <input
                    type="checkbox"
                    checked={notifPrefs[item.key]}
                    onChange={(e) => setNotifPrefs({ ...notifPrefs, [item.key]: e.target.checked })}
                  />
                </label>
              ))}
              <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={handleSave}>
                <Save size={16} /> {saved ? "Saved!" : "Save Preferences"}
              </button>
            </>
          )}

          {activeTab === "appearance" && (
            <>
              <h3 className="card-title">Appearance</h3>
              <p className="card-subtitle">Choose how SCMS looks for you</p>
              <div className="flex gap-3">
                <div
                  onClick={() => setTheme("light")}
                  style={{
                    border: `2px solid ${theme === "light" ? "var(--color-primary)" : "var(--color-border)"}`,
                    borderRadius: 10,
                    padding: 16,
                    cursor: "pointer",
                    textAlign: "center",
                    width: 140,
                    background: "#fff",
                    color: "#1f2430",
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: 13 }}>Light</div>
                </div>
                <div
                  onClick={() => setTheme("dark")}
                  style={{
                    border: `2px solid ${theme === "dark" ? "var(--color-primary)" : "var(--color-border)"}`,
                    borderRadius: 10,
                    padding: 16,
                    cursor: "pointer",
                    textAlign: "center",
                    width: 140,
                    background: "#111827",
                    color: "#fff",
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: 13 }}>Dark</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
