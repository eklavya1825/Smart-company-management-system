const asyncHandler = require("../middleware/asyncHandler");
const Payroll = require("../models/Payroll");
const { mockPayroll, mockEmployees } = require("../seed/mockData");

const withMockEmployee = (rec) => ({
  ...rec,
  employee: mockEmployees.find((e) => e._id === rec.employee) || null,
});

// @route GET /api/payroll
// Employees only see their own record; Admin/HR see everything.
const getPayroll = asyncHandler(async (req, res) => {
  const isPrivileged = ["Admin", "HR"].includes(req.user.role);
  const employeeFilter = req.query.employee;

  if (req.demoMode) {
    let results = mockPayroll.map(withMockEmployee);
    if (!isPrivileged) {
      results = results.filter((r) => r.employee && r.employee._id === req.user.employeeId);
    } else if (employeeFilter) {
      results = results.filter((r) => r.employee && r.employee._id === employeeFilter);
    }
    return res.json(results);
  }

  const query = {};
  if (!isPrivileged) {
    query.employee = req.user.employeeId;
  } else if (employeeFilter) {
    query.employee = employeeFilter;
  }
  const records = await Payroll.find(query).populate("employee");
  res.json(records);
});

module.exports = { getPayroll };
