const asyncHandler = require("../middleware/asyncHandler");
const Leave = require("../models/Leave");
const { mockLeaves, mockEmployees } = require("../seed/mockData");

let demoLeaves = [...mockLeaves]; // mutable copy so demo approve/reject "sticks" for the session

const withMockEmployee = (rec) => ({
  ...rec,
  employee: mockEmployees.find((e) => e._id === rec.employee) || null,
});

// @route GET /api/leaves
const getLeaves = asyncHandler(async (req, res) => {
  const { employee, status } = req.query;

  if (req.demoMode) {
    let results = demoLeaves.map(withMockEmployee);
    if (employee) results = results.filter((r) => r.employee && r.employee._id === employee);
    if (status) results = results.filter((r) => r.status === status);
    return res.json(results);
  }

  const query = {};
  if (employee) query.employee = employee;
  if (status) query.status = status;
  const leaves = await Leave.find(query).populate("employee");
  res.json(leaves);
});

// @route POST /api/leaves
const applyLeave = asyncHandler(async (req, res) => {
  const { employee, leaveType, startDate, endDate, reason } = req.body;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1);

  if (req.demoMode) {
    const newLeave = {
      _id: `l${demoLeaves.length + 1}`,
      employee,
      leaveType,
      startDate,
      endDate,
      days,
      reason,
      status: "Pending",
    };
    demoLeaves.push(newLeave);
    return res.status(201).json(withMockEmployee(newLeave));
  }

  const leave = await Leave.create({ employee, leaveType, startDate, endDate, days, reason });
  res.status(201).json(leave);
});

// @route PUT /api/leaves/:id  (approve / reject)
const updateLeaveStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!["Approved", "Rejected", "Pending"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value." });
  }

  if (req.demoMode) {
    const leave = demoLeaves.find((l) => l._id === req.params.id);
    if (!leave) return res.status(404).json({ message: "Leave request not found." });
    leave.status = status;
    return res.json(withMockEmployee(leave));
  }

  const leave = await Leave.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate(
    "employee"
  );
  if (!leave) return res.status(404).json({ message: "Leave request not found." });
  res.json(leave);
});

module.exports = { getLeaves, applyLeave, updateLeaveStatus };
