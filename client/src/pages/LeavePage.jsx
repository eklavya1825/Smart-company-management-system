import React, { useEffect, useState } from "react";
import { Plus, Check, X, CalendarDays } from "lucide-react";
import api from "../services/api";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import Avatar from "../components/Avatar";
import StatusBadge from "../components/StatusBadge";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import { FormInput, FormTextarea, SelectInput } from "../components/FormInput";
import FilterDropdown from "../components/FilterDropdown";
import { formatDate } from "../utils/helpers";
import { useAuth } from "../context/AuthContext";

const leaveTypes = ["Casual Leave", "Sick Leave", "Earned Leave", "Work From Home"];
const leaveBalanceDefaults = { "Casual Leave": 12, "Sick Leave": 8, "Earned Leave": 15, "Work From Home": 10 };

const emptyForm = { leaveType: "Casual Leave", startDate: "", endDate: "", reason: "" };

const LeavePage = () => {
  const { user } = useAuth();
  const canReview = ["Admin", "HR", "Manager"].includes(user?.role);

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const endpoint = canReview ? "/leaves" : `/leaves?employee=${user?.employee?._id}`;
      const { data } = await api.get(endpoint);
      setLeaves(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load leave requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = statusFilter ? leaves.filter((l) => l.status === statusFilter) : leaves;

  const handleApply = async () => {
    try {
      await api.post("/leaves", { ...form, employee: user.employee?._id });
      setModalOpen(false);
      setForm(emptyForm);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit leave request.");
    }
  };

  const handleReview = async (id, status) => {
    try {
      await api.put(`/leaves/${id}`, { status });
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update leave status.");
    }
  };

  const myApprovedLeaves = leaves.filter((l) => l.employee?._id === user?.employee?._id && l.status === "Approved");

  return (
    <>
      <PageHeader
        title="Leave Management"
        subtitle="Apply for leave and track approval status"
        actions={
          <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
            <Plus size={16} /> Apply for Leave
          </button>
        }
      />

      {!canReview && (
        <div className="grid grid-4" style={{ marginBottom: 20 }}>
          {leaveTypes.map((type) => {
            const used = myApprovedLeaves.filter((l) => l.leaveType === type).reduce((s, l) => s + l.days, 0);
            const total = leaveBalanceDefaults[type];
            return <StatCard key={type} label={type} value={`${Math.max(total - used, 0)}/${total}`} icon={CalendarDays} color="#4f46e5" />;
          })}
        </div>
      )}

      <div className="toolbar">
        <FilterDropdown value={statusFilter} onChange={setStatusFilter} placeholder="All Statuses" options={["Pending", "Approved", "Rejected"]} />
      </div>

      <div className="card">
        {loading ? (
          <LoadingSpinner label="Loading leave requests..." />
        ) : error ? (
          <ErrorState message={error} onRetry={loadData} />
        ) : filtered.length === 0 ? (
          <EmptyState icon={CalendarDays} title="No leave requests found" />
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Status</th>
                  {canReview && <th></th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => (
                  <tr key={l._id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <Avatar name={l.employee?.name} size={28} />
                        {l.employee?.name || "-"}
                      </div>
                    </td>
                    <td>{l.leaveType}</td>
                    <td>{formatDate(l.startDate)}</td>
                    <td>{formatDate(l.endDate)}</td>
                    <td>{l.days}</td>
                    <td style={{ maxWidth: 220, whiteSpace: "normal" }}>{l.reason}</td>
                    <td>
                      <StatusBadge status={l.status} />
                    </td>
                    {canReview && (
                      <td>
                        {l.status === "Pending" && (
                          <div className="flex gap-1">
                            <button className="icon-btn" style={{ width: 30, height: 30, color: "var(--color-success)" }} onClick={() => handleReview(l._id, "Approved")}>
                              <Check size={14} />
                            </button>
                            <button className="icon-btn" style={{ width: 30, height: 30, color: "var(--color-danger)" }} onClick={() => handleReview(l._id, "Rejected")}>
                              <X size={14} />
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        title="Apply for Leave"
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleApply}>
              Submit Request
            </button>
          </>
        }
      >
        <SelectInput label="Leave Type" value={form.leaveType} onChange={(e) => setForm({ ...form, leaveType: e.target.value })} options={leaveTypes} />
        <div className="form-row">
          <FormInput label="Start Date" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          <FormInput label="End Date" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
        </div>
        <FormTextarea label="Reason" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Briefly describe your reason for leave" />
      </Modal>
    </>
  );
};

export default LeavePage;
