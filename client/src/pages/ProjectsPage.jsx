import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, FolderKanban, Calendar, Users as UsersIcon } from "lucide-react";
import api from "../services/api";
import PageHeader from "../components/PageHeader";
import StatusBadge from "../components/StatusBadge";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import FilterDropdown from "../components/FilterDropdown";
import Modal from "../components/Modal";
import { FormInput, FormTextarea, SelectInput } from "../components/FormInput";
import { formatDate } from "../utils/helpers";
import { useAuth } from "../context/AuthContext";

const emptyForm = {
  name: "",
  projectCode: "",
  description: "",
  client: "",
  deadline: "",
  priority: "Medium",
  status: "Planning",
};

const ProjectsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const canManage = ["Admin", "Manager"].includes(user?.role);

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/projects");
      setProjects(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = statusFilter ? projects.filter((p) => p.status === statusFilter) : projects;

  const handleCreate = async () => {
    try {
      await api.post("/projects", form);
      setModalOpen(false);
      setForm(emptyForm);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create project.");
    }
  };

  return (
    <>
      <PageHeader
        title="Projects"
        subtitle={`${projects.length} total projects`}
        actions={
          canManage && (
            <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
              <Plus size={16} /> New Project
            </button>
          )
        }
      />

      <div className="toolbar">
        <FilterDropdown
          value={statusFilter}
          onChange={setStatusFilter}
          placeholder="All Statuses"
          options={["Planning", "In Progress", "On Hold", "Completed"]}
        />
      </div>

      {loading ? (
        <LoadingSpinner label="Loading projects..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadData} />
      ) : filtered.length === 0 ? (
        <div className="card">
          <EmptyState icon={FolderKanban} title="No projects found" />
        </div>
      ) : (
        <div className="grid grid-3">
          {filtered.map((p) => (
            <div key={p._id} className="card" style={{ cursor: "pointer" }} onClick={() => navigate(`/projects/${p._id}`)}>
              <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                <span className="text-muted" style={{ fontSize: 12 }}>
                  {p.projectCode}
                </span>
                <StatusBadge status={p.status} />
              </div>
              <h3 style={{ margin: "0 0 6px", fontSize: 15.5 }}>{p.name}</h3>
              <p className="text-muted" style={{ fontSize: 13, margin: "0 0 14px", minHeight: 36 }}>
                {p.description}
              </p>

              <div style={{ marginBottom: 12 }}>
                <div className="flex justify-between" style={{ fontSize: 12, marginBottom: 4 }}>
                  <span className="text-muted">Progress</span>
                  <strong>{p.progress}%</strong>
                </div>
                <div className="progress-bar-track">
                  <div className="progress-bar-fill" style={{ width: `${p.progress}%` }} />
                </div>
              </div>

              <div className="flex items-center justify-between text-muted" style={{ fontSize: 12.5 }}>
                <div className="flex items-center gap-1">
                  <Calendar size={13} /> {formatDate(p.deadline)}
                </div>
                <div className="flex items-center gap-1">
                  <UsersIcon size={13} /> {p.teamMembers?.length || 0}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        title="Create New Project"
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleCreate}>
              Create Project
            </button>
          </>
        }
      >
        <div className="form-row">
          <FormInput label="Project Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <FormInput label="Project Code" value={form.projectCode} onChange={(e) => setForm({ ...form, projectCode: e.target.value })} />
        </div>
        <FormTextarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <div className="form-row">
          <FormInput label="Client" value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} />
          <FormInput label="Deadline" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
        </div>
        <div className="form-row">
          <SelectInput label="Priority" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} options={["Low", "Medium", "High"]} />
          <SelectInput label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} options={["Planning", "In Progress", "On Hold", "Completed"]} />
        </div>
      </Modal>
    </>
  );
};

export default ProjectsPage;
