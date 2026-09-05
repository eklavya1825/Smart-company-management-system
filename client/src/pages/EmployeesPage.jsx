import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import api from "../services/api";
import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import FilterDropdown from "../components/FilterDropdown";
import Avatar from "../components/Avatar";
import StatusBadge from "../components/StatusBadge";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import { FormInput, SelectInput } from "../components/FormInput";
import { formatCurrency, formatDate } from "../utils/helpers";
import { useAuth } from "../context/AuthContext";
import { Users } from "lucide-react";

const emptyForm = {
  employeeId: "",
  name: "",
  email: "",
  phone: "",
  position: "",
  department: "",
  employmentType: "Full-Time",
  salary: "",
  status: "Active",
  joiningDate: "",
};

const EmployeesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const canManage = ["Admin", "HR"].includes(user?.role);

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [empRes, deptRes] = await Promise.all([api.get("/employees"), api.get("/departments")]);
      setEmployees(empRes.data);
      setDepartments(deptRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load employees.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = employees.filter((emp) => {
    const matchesSearch =
      !search ||
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(search.toLowerCase());
    const matchesDept = !deptFilter || emp.department?._id === deptFilter;
    const matchesStatus = !statusFilter || emp.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (emp) => {
    setEditingId(emp._id);
    setForm({
      employeeId: emp.employeeId,
      name: emp.name,
      email: emp.email,
      phone: emp.phone || "",
      position: emp.position || "",
      department: emp.department?._id || "",
      employmentType: emp.employmentType,
      salary: emp.salary,
      status: emp.status,
      joiningDate: emp.joiningDate ? emp.joiningDate.slice(0, 10) : "",
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingId) {
        await api.put(`/employees/${editingId}`, form);
      } else {
        await api.post("/employees", form);
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save employee.");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/employees/${deleteTarget._id}`);
      setDeleteTarget(null);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete employee.");
    }
  };

  return (
    <>
      <PageHeader
        title="Employees"
        subtitle={`${employees.length} total employees`}
        actions={
          canManage && (
            <button className="btn btn-primary" onClick={openAddModal}>
              <Plus size={16} /> Add Employee
            </button>
          )
        }
      />

      <div className="toolbar">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by name or ID..." />
        <FilterDropdown
          value={deptFilter}
          onChange={setDeptFilter}
          placeholder="All Departments"
          options={departments.map((d) => ({ value: d._id, label: d.name }))}
        />
        <FilterDropdown
          value={statusFilter}
          onChange={setStatusFilter}
          placeholder="All Statuses"
          options={["Active", "On Leave", "Inactive"]}
        />
      </div>

      <div className="card">
        {loading ? (
          <LoadingSpinner label="Loading employees..." />
        ) : error ? (
          <ErrorState message={error} onRetry={loadData} />
        ) : filtered.length === 0 ? (
          <EmptyState icon={Users} title="No employees found" message="Try adjusting your search or filters." />
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Employee ID</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Status</th>
                  <th>Salary</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp) => (
                  <tr key={emp._id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <Avatar name={emp.name} size={32} />
                        {emp.name}
                      </div>
                    </td>
                    <td>{emp.employeeId}</td>
                    <td>{emp.department?.name || "-"}</td>
                    <td>{emp.position}</td>
                    <td>
                      <StatusBadge status={emp.status} />
                    </td>
                    <td>{formatCurrency(emp.salary)}</td>
                    <td>
                      <div className="flex gap-1">
                        <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={() => navigate(`/employees/${emp._id}`)}>
                          <Eye size={15} />
                        </button>
                        {canManage && (
                          <>
                            <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={() => openEditModal(emp)}>
                              <Pencil size={15} />
                            </button>
                            <button
                              className="icon-btn"
                              style={{ width: 32, height: 32, color: "var(--color-danger)" }}
                              onClick={() => setDeleteTarget(emp)}
                            >
                              <Trash2 size={15} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        title={editingId ? "Edit Employee" : "Add Employee"}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              Save Employee
            </button>
          </>
        }
      >
        <div className="form-row">
          <FormInput label="Employee ID" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} />
          <FormInput label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="form-row">
          <FormInput label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <FormInput label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div className="form-row">
          <SelectInput
            label="Department"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            options={[{ value: "", label: "Select department" }, ...departments.map((d) => ({ value: d._id, label: d.name }))]}
          />
          <FormInput label="Position" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
        </div>
        <div className="form-row">
          <SelectInput
            label="Employment Type"
            value={form.employmentType}
            onChange={(e) => setForm({ ...form, employmentType: e.target.value })}
            options={["Full-Time", "Part-Time", "Intern", "Contract"]}
          />
          <FormInput label="Salary" type="number" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
        </div>
        <div className="form-row">
          <FormInput label="Joining Date" type="date" value={form.joiningDate} onChange={(e) => setForm({ ...form, joiningDate: e.target.value })} />
          <SelectInput
            label="Status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            options={["Active", "On Leave", "Inactive"]}
          />
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Employee"
        message={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
};

export default EmployeesPage;
