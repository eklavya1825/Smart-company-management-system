require("dotenv").config();
const express = require("express");
const cors = require("cors");

const { connectDB } = require("./config/db");
const demoMode = require("./middleware/demoMode");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const projectRoutes = require("./routes/projectRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const payrollRoutes = require("./routes/payrollRoutes");
const performanceRoutes = require("./routes/performanceRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// ---- Core middleware ----
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());
app.use(demoMode); // attaches req.demoMode based on DB connection status

// ---- Health check ----
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", demoMode: req.demoMode });
});

// ---- API routes ----
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/performance", performanceRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ---- Error handling (must be last) ----
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB(); // attempts real DB connection; falls back to demo mode if it fails
  app.listen(PORT, () => {
    console.log(`🚀 SCMS server running on http://localhost:${PORT}`);
  });
};

start();
