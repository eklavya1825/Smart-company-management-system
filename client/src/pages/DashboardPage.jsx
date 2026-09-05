import React, { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  CalendarClock,
  FolderKanban,
  UserPlus,
  CheckCircle2,
  FileEdit,
  Megaphone,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import api from "../services/api";
import StatCard from "../components/StatCard";
import ChartCard from "../components/ChartCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorState from "../components/ErrorState";
import Avatar from "../components/Avatar";
import StatusBadge from "../components/StatusBadge";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../context/AuthContext";

const COLORS = ["#4f46e5", "#0284c7", "#16a34a", "#d97706", "#dc2626", "#7c3aed"];

const activityIcons = {
  employee: UserPlus,
  project: FolderKanban,
  performance: CheckCircle2,
  announcement: Megaphone,
};

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/dashboard/stats");
      setStats(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner label="Loading dashboard..." />;
  if (error) return <ErrorState message={error} onRetry={fetchStats} />;
  if (!stats) return null;

  return (
    <>
      <PageHeader title={`Welcome back, ${user?.name?.split(" ")[0] || ""} 👋`} subtitle="Here's what's happening at your company today." />

      <div className="grid grid-4" style={{ marginBottom: 20 }}>
        <StatCard label="Total Employees" value={stats.totalEmployees} icon={Users} color="#4f46e5" />
        <StatCard label="Present Today" value={stats.presentToday} icon={UserCheck} color="#16a34a" />
        <StatCard label="Pending Leaves" value={stats.pendingLeaves} icon={CalendarClock} color="#d97706" />
        <StatCard label="Active Projects" value={stats.activeProjects} icon={FolderKanban} color="#0284c7" />
      </div>

      <div className="grid grid-2" style={{ marginBottom: 20 }}>
        <ChartCard title="Attendance Overview" subtitle="Breakdown of attendance statuses">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={stats.attendanceOverview}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={85}
                label={(entry) => entry.name}
              >
                {stats.attendanceOverview.map((entry, i) => (
                  <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Department Distribution" subtitle="Employees per department">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.departmentDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={60} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="grid grid-2" style={{ marginBottom: 20 }}>
        <div className="card">
          <h3 className="card-title">Recent Employees</h3>
          <p className="card-subtitle">Latest additions to the team</p>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Employee ID</th>
                  <th>Department</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentEmployees.map((emp) => (
                  <tr key={emp._id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <Avatar name={emp.name} size={30} />
                        {emp.name}
                      </div>
                    </td>
                    <td>{emp.employeeId}</td>
                    <td>{emp.department?.name || "-"}</td>
                    <td>
                      <StatusBadge status={emp.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Recent Activities</h3>
          <p className="card-subtitle">What's been happening lately</p>
          <div className="flex-col gap-3">
            {(stats.recentActivities || []).map((act, i) => {
              const Icon = activityIcons[act.type] || CheckCircle2;
              return (
                <div key={i} className="flex items-center gap-2">
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: "var(--color-primary-light)",
                      color: "var(--color-primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13.5 }}>{act.text}</div>
                    <div className="text-muted" style={{ fontSize: 12 }}>
                      {act.time}
                    </div>
                  </div>
                </div>
              );
            })}
            {(!stats.recentActivities || stats.recentActivities.length === 0) && (
              <p className="text-muted" style={{ fontSize: 13 }}>
                No recent activity to show.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Upcoming Events</h3>
        <p className="card-subtitle">Meetings, reviews, and holidays coming up</p>
        <div className="grid grid-3">
          {(stats.upcomingEvents || []).map((ev, i) => (
            <div
              key={i}
              style={{
                border: "1px solid var(--color-border)",
                borderRadius: 10,
                padding: 14,
              }}
            >
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{ev.title}</div>
              <div className="text-muted" style={{ fontSize: 12.5 }}>
                {ev.date}
              </div>
            </div>
          ))}
          {(!stats.upcomingEvents || stats.upcomingEvents.length === 0) && (
            <p className="text-muted" style={{ fontSize: 13 }}>
              No upcoming events.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
