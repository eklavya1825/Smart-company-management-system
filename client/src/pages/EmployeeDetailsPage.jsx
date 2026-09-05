import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone, Calendar, Briefcase } from "lucide-react";
import api from "../services/api";
import Avatar from "../components/Avatar";
import StatusBadge from "../components/StatusBadge";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorState from "../components/ErrorState";
import { formatDate, formatCurrency } from "../utils/helpers";

const EmployeeDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [projects, setProjects] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [empRes, attRes, leaveRes, projRes, perfRes] = await Promise.all([
        api.get(`/employees/${id}`),
        api.get(`/attendance?employee=${id}`),
        api.get(`/leaves?employee=${id}`),
        api.get(`/projects`),
        api.get(`/performance?employee=${id}`),
      ]);
      setEmployee(empRes.data);
      setAttendance(attRes.data);
      setLeaves(leaveRes.data);
      setPerformance(perfRes.data);
      setProjects(projRes.data.filter((p) => p.teamMembers?.some((m) => m._id === id) || p.manager?._id === id));
    } catch (err) {
      setError(err.response?.data?.message || "Could not load employee details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <LoadingSpinner label="Loading employee details..." />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;
  if (!employee) return null;

  const presentCount = attendance.filter((a) => a.status === "Present").length;
  const leaveBalance = { "Casual Leave": 12, "Sick Leave": 8, "Earned Leave": 15, "Work From Home": 10 };
  const usedLeaves = leaves.filter((l) => l.status === "Approved");

  return (
    <>
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: 16 }} onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Back
      </button>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="flex items-center gap-3" style={{ flexWrap: "wrap" }}>
          <Avatar name={employee.name} size={64} />
          <div style={{ flex: 1, minWidth: 200 }}>
            <h2 style={{ margin: "0 0 4px", fontSize: 20 }}>{employee.name}</h2>
            <p className="text-muted" style={{ margin: 0, fontSize: 13.5 }}>
              {employee.position} · {employee.department?.name || "-"}
            </p>
          </div>
          <StatusBadge status={employee.status} />
        </div>
      </div>

      <div className="grid grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <h3 className="card-title">Personal Information</h3>
          <div className="flex-col gap-2" style={{ marginTop: 10 }}>
            <div className="flex items-center gap-2" style={{ fontSize: 14 }}>
              <Mail size={15} className="text-muted" /> {employee.email}
            </div>
            <div className="flex items-center gap-2" style={{ fontSize: 14 }}>
              <Phone size={15} className="text-muted" /> {employee.phone || "-"}
            </div>
            <div className="flex items-center gap-2" style={{ fontSize: 14 }}>
              <Calendar size={15} className="text-muted" /> Joined {formatDate(employee.joiningDate)}
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Job Information</h3>
          <div className="flex-col gap-2" style={{ marginTop: 10, fontSize: 14 }}>
            <div className="flex items-center gap-2">
              <Briefcase size={15} className="text-muted" /> {employee.employmentType}
            </div>
            <div>Employee ID: <strong>{employee.employeeId}</strong></div>
            <div>Salary: <strong>{formatCurrency(employee.salary)}</strong></div>
            <div>Manager: <strong>{employee.manager?.name || "-"}</strong></div>
          </div>
        </div>
      </div>

      <div className="grid grid-3" style={{ marginBottom: 20 }}>
        <div className="card">
          <h3 className="card-title">Attendance Summary</h3>
          <div className="stat-value" style={{ fontSize: 28, marginTop: 8 }}>
            {presentCount}
          </div>
          <p className="text-muted" style={{ fontSize: 13 }}>Days present (recorded)</p>
        </div>
        <div className="card">
          <h3 className="card-title">Leave Balance</h3>
          <div className="flex-col gap-1" style={{ marginTop: 8 }}>
            {Object.entries(leaveBalance).map(([type, total]) => {
              const used = usedLeaves.filter((l) => l.leaveType === type).reduce((sum, l) => sum + l.days, 0);
              return (
                <div key={type} className="flex justify-between" style={{ fontSize: 13 }}>
                  <span className="text-muted">{type}</span>
                  <strong>{Math.max(total - used, 0)} / {total}</strong>
                </div>
              );
            })}
          </div>
        </div>
        <div className="card">
          <h3 className="card-title">Performance Summary</h3>
          <div className="stat-value" style={{ fontSize: 28, marginTop: 8 }}>
            {performance.length > 0 ? performance[performance.length - 1].score : "-"}
            <span style={{ fontSize: 14, color: "var(--color-text-muted)" }}> / 5</span>
          </div>
          <p className="text-muted" style={{ fontSize: 13 }}>Latest review score</p>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Current Projects</h3>
        {projects.length === 0 ? (
          <p className="text-muted" style={{ fontSize: 13.5 }}>Not currently assigned to any project.</p>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Status</th>
                  <th>Progress</th>
                  <th>Deadline</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p._id}>
                    <td>{p.name}</td>
                    <td><StatusBadge status={p.status} /></td>
                    <td>{p.progress}%</td>
                    <td>{formatDate(p.deadline)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default EmployeeDetailsPage;
