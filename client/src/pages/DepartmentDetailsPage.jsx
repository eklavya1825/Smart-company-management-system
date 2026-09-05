import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import api from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorState from "../components/ErrorState";
import Avatar from "../components/Avatar";
import StatusBadge from "../components/StatusBadge";

const DepartmentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dept, setDept] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(`/departments/${id}`);
      setDept(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load department.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <LoadingSpinner label="Loading department..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!dept) return null;

  return (
    <>
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: 14 }} onClick={() => navigate("/departments")}>
        <ArrowLeft size={15} /> Back to Departments
      </button>

      <div className="card" style={{ marginBottom: 20 }}>
        <h1 style={{ margin: "0 0 6px", fontSize: 21 }}>{dept.name}</h1>
        <p className="text-muted" style={{ fontSize: 14, marginBottom: 16 }}>
          {dept.description}
        </p>
        {dept.head && (
          <div className="flex items-center gap-2">
            <Avatar name={dept.head.name} size={36} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{dept.head.name}</div>
              <div className="text-muted" style={{ fontSize: 12.5 }}>
                Department Head · {dept.head.position}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <h3 className="card-title">Team Members</h3>
        <p className="card-subtitle">{(dept.employees || []).length} employees in this department</p>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Employee ID</th>
                <th>Position</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(dept.employees || []).map((e) => (
                <tr key={e._id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <Avatar name={e.name} size={30} />
                      {e.name}
                    </div>
                  </td>
                  <td>{e.employeeId}</td>
                  <td>{e.position}</td>
                  <td>
                    <StatusBadge status={e.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default DepartmentDetailsPage;
