import React, { useEffect, useState } from "react";
import { Megaphone, Plus } from "lucide-react";
import api from "../services/api";
import PageHeader from "../components/PageHeader";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import { FormInput, FormTextarea, SelectInput } from "../components/FormInput";
import { formatDate } from "../utils/helpers";
import { useAuth } from "../context/AuthContext";

const priorityColor = { High: "danger", Medium: "warning", Low: "info" };

const emptyForm = { title: "", description: "", priority: "Medium" };

const AnnouncementsPage = () => {
  const { user } = useAuth();
  const canPost = ["Admin", "HR"].includes(user?.role);

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/announcements");
      setAnnouncements(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load announcements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    try {
      await api.post("/announcements", form);
      setModalOpen(false);
      setForm(emptyForm);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to post announcement.");
    }
  };

  return (
    <>
      <PageHeader
        title="Announcements"
        subtitle="Company-wide news and updates"
        actions={
          canPost && (
            <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
              <Plus size={16} /> New Announcement
            </button>
          )
        }
      />

      {loading ? (
        <LoadingSpinner label="Loading announcements..." />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : announcements.length === 0 ? (
        <div className="card">
          <EmptyState icon={Megaphone} title="No announcements yet" />
        </div>
      ) : (
        <div className="flex-col gap-3">
          {announcements.map((a) => (
            <div key={a._id} className="card">
              <div className="flex items-center justify-between" style={{ marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
                <h3 style={{ margin: 0, fontSize: 15.5 }}>{a.title}</h3>
                <span className={`badge badge-${priorityColor[a.priority] || "neutral"}`}>{a.priority} Priority</span>
              </div>
              <p style={{ fontSize: 14, margin: "0 0 12px", color: "var(--color-text-muted)" }}>{a.description}</p>
              <div className="flex items-center justify-between text-muted" style={{ fontSize: 12.5 }}>
                <span>Posted by {a.postedBy?.name || "System"}</span>
                <span>{formatDate(a.date)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        title="New Announcement"
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleCreate}>
              Post Announcement
            </button>
          </>
        }
      >
        <FormInput label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <FormTextarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <SelectInput
          label="Priority"
          value={form.priority}
          onChange={(e) => setForm({ ...form, priority: e.target.value })}
          options={["Low", "Medium", "High"]}
        />
      </Modal>
    </>
  );
};

export default AnnouncementsPage;
