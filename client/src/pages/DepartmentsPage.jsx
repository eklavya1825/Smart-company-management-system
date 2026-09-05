import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Users, FolderKanban, Plus } from "lucide-react";
import api from "../services/api";
import PageHeader from "../components/PageHeader";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import Avatar from "../components/Avatar";
import Modal from "../components/Modal";
import { FormInput, FormTextarea } from "../components/FormInput";
import { useAuth } from "../context/AuthContext";

const DepartmentsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const canManage = user?.role === "Admin";

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/departments");
      setDepartments(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load departments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async () => {
    try {
      await api.post("/departments", form);
      setModalOpen(false);
      setForm({ name: "", description: "" });
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create department.");
    }
  };

  return (
    <>
      <PageHeader
        title="Departments"
        subtitle={`${departments.length} departments`}
        actions={
          canManage && (
            <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
              <Plus size={16} /> Add Department
            </button>
          )
        }
      />

      {loading ? (
        <LoadingSpinner label="Loading departments..." />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : departments.length === 0 ? (
        <div className="card">
          <EmptyState icon={Building2} title="No departments found" />
        </div>
      ) : (
        <div className="grid grid-3">
          {departments.map((d) => (
            <div key={d._id} className="card" style={{ cursor: "pointer" }} onClick={() => navigate(`/departments/${d._id}`)}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 10,
                  background: "var(--color-primary-light)",
                  color: "var(--color-primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 14,
                }}
              >
                <Building2 size={20} />
              </div>
              <h3 style={{ margin: "0 0 4px", fontSize: 16 }}>{d.name}</h3>
              <p className="text-muted" style={{ fontSize: 13, margin: "0 0 16px", minHeight: 34 }}>
                {d.description}
              </p>

              <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
                <div className="flex items-center gap-1 text-muted" style={{ fontSize: 12.5 }}>
                  <Users size={14} /> {d.employeeCount ?? 0} employees
                </div>
                <div className="flex items-center gap-1 text-muted" style={{ fontSize: 12.5 }}>
                  <FolderKanban size={14} /> {d.activeProjects ?? 0} active
                </div>
              </div>

              {d.head && (
                <div className="flex items-center gap-2" style={{ paddingTop: 12, borderTop: "1px solid var(--color-border)" }}>
                  <Avatar name={d.head.name} size={28} />
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 600 }}>{d.head.name}</div>
                    <div className="text-muted" style={{ fontSize: 11.5 }}>
                      Department Head
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal
        title="Add Department"
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleCreate}>
              Create Department
            </button>
          </>
        }
      >
        <FormInput label="Department Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <FormTextarea label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </Modal>
    </>
  );
};

export default DepartmentsPage;
