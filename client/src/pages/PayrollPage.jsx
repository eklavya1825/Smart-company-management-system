import React, { useEffect, useState } from "react";
import { Wallet, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import api from "../services/api";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import Avatar from "../components/Avatar";
import { formatCurrency, formatDate } from "../utils/helpers";
import { useAuth } from "../context/AuthContext";

const PayrollPage = () => {
  const { user } = useAuth();
  const isPrivileged = ["Admin", "HR"].includes(user?.role);

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/payroll");
      setRecords(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load payroll data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const totalBasic = records.reduce((sum, r) => sum + (r.basicSalary || 0), 0);
  const totalAllowances = records.reduce((sum, r) => sum + (r.allowances || 0), 0);
  const totalDeductions = records.reduce((sum, r) => sum + (r.deductions || 0), 0);
  const totalNet = records.reduce((sum, r) => sum + (r.netSalary || 0), 0);

  return (
    <>
      <PageHeader
        title="Payroll"
        subtitle={isPrivileged ? "Company-wide salary information" : "Your salary information"}
      />

      <div className="grid grid-4" style={{ marginBottom: 20 }}>
        <StatCard label="Total Basic Salary" value={formatCurrency(totalBasic)} icon={Wallet} color="#4f46e5" />
        <StatCard label="Total Allowances" value={formatCurrency(totalAllowances)} icon={TrendingUp} color="#16a34a" />
        <StatCard label="Total Deductions" value={formatCurrency(totalDeductions)} icon={TrendingDown} color="#dc2626" />
        <StatCard label="Net Payout" value={formatCurrency(totalNet)} icon={DollarSign} color="#0284c7" />
      </div>

      <div className="card">
        <h3 className="card-title">Salary Records</h3>
        <p className="card-subtitle">{records.length} records{records[0]?.month ? ` for ${records[0].month}` : ""}</p>

        {loading ? (
          <LoadingSpinner label="Loading payroll..." />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : records.length === 0 ? (
          <EmptyState icon={Wallet} title="No payroll records found" />
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  {isPrivileged && <th>Employee</th>}
                  <th>Basic Salary</th>
                  <th>Allowances</th>
                  <th>Deductions</th>
                  <th>Net Salary</th>
                  <th>Pay Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r._id}>
                    {isPrivileged && (
                      <td>
                        <div className="flex items-center gap-2">
                          <Avatar name={r.employee?.name} size={28} />
                          {r.employee?.name || "-"}
                        </div>
                      </td>
                    )}
                    <td>{formatCurrency(r.basicSalary)}</td>
                    <td style={{ color: "var(--color-success)" }}>+{formatCurrency(r.allowances)}</td>
                    <td style={{ color: "var(--color-danger)" }}>-{formatCurrency(r.deductions)}</td>
                    <td style={{ fontWeight: 700 }}>{formatCurrency(r.netSalary)}</td>
                    <td>{formatDate(r.payDate)}</td>
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

export default PayrollPage;
