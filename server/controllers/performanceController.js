const asyncHandler = require("../middleware/asyncHandler");
const Performance = require("../models/Performance");
const { mockPerformance, mockEmployees } = require("../seed/mockData");

const withMockEmployee = (rec) => ({
  ...rec,
  employee: mockEmployees.find((e) => e._id === rec.employee) || null,
});

// @route GET /api/performance
const getPerformance = asyncHandler(async (req, res) => {
  const { employee } = req.query;

  if (req.demoMode) {
    let results = mockPerformance.map(withMockEmployee);
    if (employee) results = results.filter((r) => r.employee && r.employee._id === employee);
    return res.json(results);
  }

  const query = {};
  if (employee) query.employee = employee;
  const records = await Performance.find(query).populate("employee reviewedBy");
  res.json(records);
});

// @route POST /api/performance
const createPerformance = asyncHandler(async (req, res) => {
  if (req.demoMode) {
    return res.status(201).json({ ...req.body, _id: `perf${mockPerformance.length + 1}` });
  }
  const record = await Performance.create(req.body);
  res.status(201).json(record);
});

module.exports = { getPerformance, createPerformance };
