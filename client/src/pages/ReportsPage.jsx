import React, { useEffect, useState } from "react";
import { Download, Printer } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import api from "../services/api";
import PageHeader from "../components/PageHeader";
import ChartCard from "../components/ChartCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorState from "../components/ErrorState";
import { exportToCSV } from "../utils/helpers";

const COLORS = ["#4f46e5", "#0284c7", "#16a34a", "#d97706", "#dc2626", "#7c3aed"];

const ReportsPage = () => {
  const [stats, setStats] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [projects, setProjects] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [statsRes, empRes, leaveRes, projRes, perfRes] = await Promise.all([
        api.get("/dashboard/stats"),
        api.get("/employees"),
        api.get("/leaves"),
        api.get("/projects"),
        api.get("/performance"),
      ]);
      setStats(statsRes.data);
      setEmployees(empRes.data);
      setLeaves(leaveRes.data);
      setProjects(projRes.data);
      setPerformance(perfRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load report data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <LoadingSpinner label="Loading reports..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!stats) return null;

  const leaveStats = ["Pending", "Approved", "Rejected"].map((s) => ({
    name: s,
    value: leaves.filter((l) => l.status === s).length,
  }));

  const projectStats = ["Planning", "In Progress", "On Hold", "Completed"].map((s) => ({
    name: s,
    value: projects.filter((p) => p.status === s).length,
  }));

  const performanceDistribution = [1, 2, 3, 4, 5].map((score) => ({
    name: `${score} star`,
    value: performance.filter((p) => Math.round(Number(p.score)) === score).length,
  }));

  const employeeGrowth = employees
    .map((e) => ({ date: e.joiningDate?.slice(0, 7) }))
    .filter((e) => e.date)
    .reduce((acc, e) => {
      const found = acc.find((a) => a.month === e.date);
      if (found) found.count += 1;
      else acc.push({ month: e.date, count: 1 });
      return acc;
    }, [])
    .sort((a, b) => (a.month > b.month ? 1 : -1));

  const handleExportEmployees = () => {
    exportToCSV(
      "employees_report.csv",
      employees.map((e) => ({
        EmployeeID: e.employeeId,
        Name: e.name,
        Email: e.email,
        Department: e.department?.name || "",
        Position: e.position,
        Status: e.status,
        Salary: e.salary,
      }))
    );
  };

  return (
    <>
      <PageHeader
        title="Reports"
        subtitle="Company-wide analytics and insights"
        actions={
          <>
            <button className="btn btn-secondary" onClick={handleExportEmployees}>
              <Download size={16} /> Export CSV
            </button>
            <button className="btn btn-secondary" onClick={() => window.print()}>
              <Printer size={16} /> Print Report
            </button>
          </>
        }
      />

      <div className="grid grid-2" style={{ marginBottom: 20 }}>
        <ChartCard title="Employee Growth" subtitle="New hires by month">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={employeeGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Department Distribution" subtitle="Employees per department">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={stats.departmentDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} label={(e) => e.name}>
                {stats.departmentDistribution.map((entry, i) => (
                  <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-2" style={{ marginBottom: 20 }}>
        <ChartCard title="Attendance Trend" subtitle="Status breakdown across all records">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.attendanceOverview}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#0284c7" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Leave Statistics" subtitle="Requests by status">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={leaveStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#d97706" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-2">
        <ChartCard title="Project Completion" subtitle="Projects by status">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={projectStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" tick={{ fontSize: 10.5 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#16a34a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Performance Distribution" subtitle="Reviews grouped by rating">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#7c3aed" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </>
  );
};

export default ReportsPage;
