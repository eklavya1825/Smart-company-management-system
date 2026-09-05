const asyncHandler = require("../middleware/asyncHandler");
const Employee = require("../models/Employee");
const Attendance = require("../models/Attendance");
const Leave = require("../models/Leave");
const Project = require("../models/Project");
const Department = require("../models/Department");
const {
  mockEmployees,
  mockAttendance,
  mockLeaves,
  mockProjects,
  mockDepartments,
} = require("../seed/mockData");

// @route GET /api/dashboard/stats
const getStats = asyncHandler(async (req, res) => {
  const todayStr = new Date().toISOString().slice(0, 10);

  if (req.demoMode) {
    const totalEmployees = mockEmployees.length;
    const presentToday = mockAttendance.filter(
      (a) => a.date === todayStr && ["Present", "Late", "Half Day"].includes(a.status)
    ).length;
    const pendingLeaves = mockLeaves.filter((l) => l.status === "Pending").length;
    const activeProjects = mockProjects.filter((p) => p.status === "In Progress").length;

    const departmentDistribution = mockDepartments.map((d) => ({
      name: d.name,
      value: mockEmployees.filter((e) => e.department === d._id).length,
    }));

    const attendanceOverview = [
      { name: "Present", value: mockAttendance.filter((a) => a.status === "Present").length },
      { name: "Late", value: mockAttendance.filter((a) => a.status === "Late").length },
      { name: "Absent", value: mockAttendance.filter((a) => a.status === "Absent").length },
      { name: "Half Day", value: mockAttendance.filter((a) => a.status === "Half Day").length },
      { name: "On Leave", value: mockAttendance.filter((a) => a.status === "On Leave").length },
    ];

    const recentEmployees = [...mockEmployees]
      .sort((a, b) => new Date(b.joiningDate) - new Date(a.joiningDate))
      .slice(0, 5)
      .map((e) => ({
        ...e,
        department: mockDepartments.find((d) => d._id === e.department) || null,
      }));

    const recentActivities = [
      { type: "employee", text: "Kabir Singh's leave request was approved", time: "2 hours ago" },
      { type: "project", text: "Mobile Banking App progress updated to 80%", time: "5 hours ago" },
      { type: "performance", text: "Q2 performance review completed for Sneha Reddy", time: "1 day ago" },
      { type: "announcement", text: "New announcement: All-Hands Team Meeting", time: "2 days ago" },
      { type: "employee", text: "Ishita Verma checked in late", time: "2 days ago" },
    ];

    const upcomingEvents = [
      { title: "Team Meeting - Engineering", date: "Sep 8, 2026", type: "meeting" },
      { title: "Q3 Performance Review Cycle", date: "Sep 15, 2026", type: "review" },
      { title: "Company Holiday - Gandhi Jayanti", date: "Oct 2, 2026", type: "holiday" },
    ];

    return res.json({
      totalEmployees,
      presentToday,
      pendingLeaves,
      activeProjects,
      departmentDistribution,
      attendanceOverview,
      recentEmployees,
      recentActivities,
      upcomingEvents,
    });
  }

  // ---- Real database mode ----
  const totalEmployees = await Employee.countDocuments();
  const start = new Date(todayStr);
  const end = new Date(todayStr);
  end.setDate(end.getDate() + 1);

  const presentToday = await Attendance.countDocuments({
    date: { $gte: start, $lt: end },
    status: { $in: ["Present", "Late", "Half Day"] },
  });
  const pendingLeaves = await Leave.countDocuments({ status: "Pending" });
  const activeProjects = await Project.countDocuments({ status: "In Progress" });

  const departments = await Department.find();
  const departmentDistribution = await Promise.all(
    departments.map(async (d) => ({
      name: d.name,
      value: await Employee.countDocuments({ department: d._id }),
    }))
  );

  const attendanceAgg = await Attendance.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  const attendanceOverview = attendanceAgg.map((a) => ({ name: a._id, value: a.count }));

  const recentEmployees = await Employee.find()
    .sort({ joiningDate: -1 })
    .limit(5)
    .populate("department");

  res.json({
    totalEmployees,
    presentToday,
    pendingLeaves,
    activeProjects,
    departmentDistribution,
    attendanceOverview,
    recentEmployees,
    recentActivities: [], // populated as the app grows; kept simple for now
    upcomingEvents: [],
  });
});

module.exports = { getStats };
