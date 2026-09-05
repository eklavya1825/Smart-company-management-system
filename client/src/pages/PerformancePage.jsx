import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, Star } from "lucide-react";
import api from "../services/api";
import PageHeader from "../components/PageHeader";
import ChartCard from "../components/ChartCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import Avatar from "../components/Avatar";
import StatusBadge from "../components/StatusBadge";

const PerformancePage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/performance");
      setRecords(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load performance data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const chartData = records.map((r) => ({
    name: r.employee?.name?.split(" ")[0] || "-",
    score: Number(r.score),
  }));

  if (loading) return <LoadingSpinner label="Loading performance reviews..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <>
      <PageHeader title="Performance" subtitle="Employee performance reviews and ratings" />

      <div style={{ marginBottom: 20 }}>
        <ChartCard title="Performance Overview" subtitle="Latest review scores (out of 5)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="score" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {records.length === 0 ? (
        <div className="card">
          <EmptyState icon={TrendingUp} title="No performance reviews found" />
        </div>
      ) : (
        <div className="grid grid-2">
          {records.map((r) => (
            <div key={r._id} className="card">
              <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
                <div className="flex items-center gap-2">
                  <Avatar name={r.employee?.name} size={36} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{r.employee?.name}</div>
                    <div className="text-muted" style={{ fontSize: 12 }}>
                      {r.reviewCycle}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1" style={{ color: "var(--color-warning)", fontWeight: 700 }}>
                  <Star size={16} fill="var(--color-warning)" /> {r.score}
                </div>
              </div>

              <p style={{ fontSize: 13.5, marginBottom: 14 }}>{r.managerFeedback}</p>

              <div className="grid grid-2" style={{ gap: 12, marginBottom: 10 }}>
                <div>
                  <div className="text-muted" style={{ fontSize: 11.5, marginBottom: 4 }}>
                    STRENGTHS
                  </div>
                  {(r.strengths || []).map((s, i) => (
                    <span key={i} className="badge badge-success" style={{ marginRight: 4, marginBottom: 4 }}>
                      {s}
                    </span>
                  ))}
                </div>
                <div>
                  <div className="text-muted" style={{ fontSize: 11.5, marginBottom: 4 }}>
                    AREAS TO IMPROVE
                  </div>
                  {(r.improvements || []).map((s, i) => (
                    <span key={i} className="badge badge-warning" style={{ marginRight: 4, marginBottom: 4 }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between" style={{ paddingTop: 10, borderTop: "1px solid var(--color-border)" }}>
                <span className="text-muted" style={{ fontSize: 12 }}>
                  Goals: {(r.goals || []).join(", ") || "-"}
                </span>
                <StatusBadge status={r.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default PerformancePage;
