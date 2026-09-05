import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Calendar, User } from "lucide-react";
import api from "../services/api";
import StatusBadge from "../components/StatusBadge";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorState from "../components/ErrorState";
import Avatar from "../components/Avatar";
import Modal from "../components/Modal";
import { FormInput, FormTextarea, SelectInput } from "../components/FormInput";
import { formatDate } from "../utils/helpers";
import { useAuth } from "../context/AuthContext";

const emptyTask = { title: "", description: "", priority: "Medium", status: "To Do", deadline: "" };

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const canManage = ["Admin", "Manager"].includes(user?.role);

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskForm, setTaskForm] = useState(emptyTask);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(`/projects/${id}`);
      setProject(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load project.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAddTask = async () => {
    try {
      await api.post(`/projects/${id}/tasks`, taskForm);
      setTaskModalOpen(false);
      setTaskForm(emptyTask);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add task.");
    }
  };

  if (loading) return <LoadingSpinner label="Loading project..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!project) return null;

  return (
    <>
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: 14 }} onClick={() => navigate("/projects")}>
        <ArrowLeft size={15} /> Back to Projects
      </button>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 10, flexWrap: "wrap", gap: 10 }}>
          <div>
            <span className="text-muted" style={{ fontSize: 12.5 }}>
              {project.projectCode}
            </span>
            <h1 style={{ margin: "2px 0 6px", fontSize: 21 }}>{project.name}</h1>
          </div>
          <StatusBadge status={project.status} />
        </div>
        <p className="text-muted" style={{ fontSize: 14, marginBottom: 18 }}>
          {project.description}
        </p>

        <div style={{ marginBottom: 18 }}>
          <div className="flex justify-between" style={{ fontSize: 13, marginBottom: 6 }}>
            <span className="text-muted">Overall Progress</span>
            <strong>{project.progress}%</strong>
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${project.progress}%` }} />
          </div>
        </div>

        <div className="grid grid-4">
          <div>
            <div className="text-muted" style={{ fontSize: 12 }}>
              Client
            </div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{project.client}</div>
          </div>
          <div>
            <div className="text-muted" style={{ fontSize: 12 }}>
              Priority
            </div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{project.priority}</div>
          </div>
          <div>
            <div className="text-muted" style={{ fontSize: 12 }}>
              Start Date
            </div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{formatDate(project.startDate)}</div>
          </div>
          <div>
            <div className="text-muted" style={{ fontSize: 12 }}>
              Deadline
            </div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{formatDate(project.deadline)}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-2" style={{ alignItems: "start" }}>
        <div className="card">
          <h3 className="card-title">Team Members</h3>
          <p className="card-subtitle">Managed by {project.manager?.name || "Unassigned"}</p>
          <div className="flex-col gap-3">
            {(project.teamMembers || []).map((m) => (
              <div key={m._id} className="flex items-center gap-2">
                <Avatar name={m.name} size={32} />
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>{m.name}</div>
                  <div className="text-muted" style={{ fontSize: 12 }}>
                    {m.position}
                  </div>
                </div>
              </div>
            ))}
            {(!project.teamMembers || project.teamMembers.length === 0) && (
              <p className="text-muted" style={{ fontSize: 13 }}>
                No team members assigned yet.
              </p>
            )}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
            <h3 className="card-title" style={{ marginBottom: 0 }}>
              Tasks
            </h3>
            {canManage && (
              <button className="btn btn-secondary btn-sm" onClick={() => setTaskModalOpen(true)}>
                <Plus size={14} /> Add Task
              </button>
            )}
          </div>
          <p className="card-subtitle">{(project.tasks || []).length} tasks total</p>
          <div className="flex-col gap-2">
            {(project.tasks || []).map((t) => (
              <div key={t._id} style={{ border: "1px solid var(--color-border)", borderRadius: 10, padding: 12 }}>
                <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
                  <span style={{ fontWeight: 600, fontSize: 13.5 }}>{t.title}</span>
                  <StatusBadge status={t.status} />
                </div>
                <div className="flex items-center justify-between text-muted" style={{ fontSize: 12 }}>
                  <span className="flex items-center gap-1">
                    <User size={12} /> {t.assignedTo?.name || "Unassigned"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} /> {formatDate(t.deadline)}
                  </span>
                </div>
              </div>
            ))}
            {(!project.tasks || project.tasks.length === 0) && (
              <p className="text-muted" style={{ fontSize: 13 }}>
                No tasks yet.
              </p>
            )}
          </div>
        </div>
      </div>

      <Modal
        title="Add Task"
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setTaskModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleAddTask}>
              Add Task
            </button>
          </>
        }
      >
        <FormInput label="Task Title" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} />
        <FormTextarea
          label="Description"
          value={taskForm.description}
          onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
        />
        <div className="form-row">
          <SelectInput
            label="Priority"
            value={taskForm.priority}
            onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
            options={["Low", "Medium", "High"]}
          />
          <SelectInput
            label="Status"
            value={taskForm.status}
            onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
            options={["To Do", "In Progress", "Done"]}
          />
        </div>
        <FormInput
          label="Deadline"
          type="date"
          value={taskForm.deadline}
          onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })}
        />
      </Modal>
    </>
  );
};

export default ProjectDetailsPage;
