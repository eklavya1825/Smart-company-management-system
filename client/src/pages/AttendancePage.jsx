import React, { useEffect, useState } from "react";
import { LogIn, LogOut, ClipboardCheck } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import api from "../services/api";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import ChartCard from "../components/ChartCard";
import Avatar from "../components/Avatar";
import StatusBadge from "../components/StatusBadge";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../context/AuthContext";

const todayStr = () => new Date().toISOString().slice(0, 10);

const AttendancePage = () => {
  const { user } = useAuth();
  const [date, setDate] = useState(todayStr());
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkedIn, setCheckedIn] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get(`/attendance?date=${date}`);
      setRecords(data);
      const mine = data.find((r) => r.employee?._id === user?.employee?._id);
      setCheckedIn(!!mine?.checkIn && !mine?.checkOut);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load attendance.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const handleCheckIn = async () => {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    try {
      await api.post("/attendance", {
        employee: user.employee?._id,
        date: todayStr(),
        checkIn: time,
        status: "Present",
      });
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Check-in failed.");
    }
  };

  const handleCheckOut = async () => {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    try {
      await api.post("/attendance", {
        employee: user.employee?._id,
        date: todayStr(),
        checkOut: time,
      });
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Check-out failed.");
    }
  };

  const counts = {
    Present: records.filter((r) => r.status === "Present").length,
    Absent: records.filter((r) => r.status === "Absent").length,
    Late: records.filter((r) => r.status === "Late").length,
    "On Leave": records.filter((r) => r.status === "On Leave").length,
  };

  const chartData = Object.entries(counts).map(([name, value]) => ({ name, value }));

  return (
    <>
      <PageHeader
        title="Attendance"
        subtitle="Track daily check-ins, check-outs, and attendance status"
        actions={
          user?.employee && (
            <>
              <button className="btn btn-secondary" onClick={handleCheckIn} disabled={checkedIn}>
                <LogIn size={16} /> Check In
              </button>
              <button className="btn btn-primary" onClick={handleCheckOut} disabled={!checkedIn}>
                <LogOut size={16} /> Check Out
              </button>
            </>
          )
        }
      />

      <div className="grid grid-4" style={{ marginBottom: 20 }}>
        <StatCard label="Present" value={counts.Present} icon={ClipboardCheck} color="#16a34a" />
        <StatCard label="Absent" value={counts.Absent} icon={ClipboardCheck} color="#dc2626" />
        <StatCard label="Late" value={counts.Late} icon={ClipboardCheck} color="#d97706" />
        <StatCard label="On Leave" value={counts["On Leave"]} icon={ClipboardCheck} color="#0284c7" />
      </div>

      <ChartCard title="Attendance Chart" subtitle="Status breakdown for selected date" height={220}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="value" fill="#4f46e5" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
          <h3 className="card-title" style={{ margin: 0 }}>
            Attendance Records
          </h3>
          <input type="date" className="form-input" style={{ width: "auto" }} value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        {loading ? (
          <LoadingSpinner label="Loading attendance..." />
        ) : error ? (
          <ErrorState message={error} onRetry={loadData} />
        ) : records.length === 0 ? (
          <EmptyState icon={ClipboardCheck} title="No records for this date" />
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Working Hours</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r._id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <Avatar name={r.employee?.name} size={28} />
                        {r.employee?.name || "-"}
                      </div>
                    </td>
                    <td>{r.date?.slice ? r.date.slice(0, 10) : r.date}</td>
                    <td>{r.checkIn || "-"}</td>
                    <td>{r.checkOut || "-"}</td>
                    <td>{r.workingHours ? `${r.workingHours} hrs` : "-"}</td>
                    <td>
                      <StatusBadge status={r.status} />
                    </td>
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

export default AttendancePage;
