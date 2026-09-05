const asyncHandler = require("../middleware/asyncHandler");
const Employee = require("../models/Employee");
const { mockEmployees, mockDepartments } = require("../seed/mockData");

// Attaches a readable department object to a mock employee (demo mode only)
const withMockDept = (emp) => ({
  ...emp,
  department: mockDepartments.find((d) => d._id === emp.department) || null,
});

// @route GET /api/employees
const getEmployees = asyncHandler(async (req, res) => {
  const { search, department, status } = req.query;

  if (req.demoMode) {
    let results = mockEmployees.map(withMockDept);
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (e) => e.name.toLowerCase().includes(q) || e.employeeId.toLowerCase().includes(q)
      );
    }
    if (department) results = results.filter((e) => e.department && e.department._id === department);
    if (status) results = results.filter((e) => e.status === status);
    return res.json(results);
  }

  const query = {};
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { employeeId: { $regex: search, $options: "i" } },
    ];
  }
  if (department) query.department = department;
  if (status) query.status = status;

  const employees = await Employee.find(query).populate("department manager");
  res.json(employees);
});

// @route GET /api/employees/:id
const getEmployeeById = asyncHandler(async (req, res) => {
  if (req.demoMode) {
    const emp = mockEmployees.find((e) => e._id === req.params.id);
    if (!emp) return res.status(404).json({ message: "Employee not found." });
    return res.json(withMockDept(emp));
  }

  const employee = await Employee.findById(req.params.id).populate("department manager");
  if (!employee) return res.status(404).json({ message: "Employee not found." });
  res.json(employee);
});

// @route POST /api/employees
const createEmployee = asyncHandler(async (req, res) => {
  if (req.demoMode) {
    return res.status(201).json({ ...req.body, _id: `e${mockEmployees.length + 1}` });
  }
  const employee = await Employee.create(req.body);
  res.status(201).json(employee);
});

// @route PUT /api/employees/:id
const updateEmployee = asyncHandler(async (req, res) => {
  if (req.demoMode) {
    return res.json({ ...req.body, _id: req.params.id });
  }
  const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!employee) return res.status(404).json({ message: "Employee not found." });
  res.json(employee);
});

// @route DELETE /api/employees/:id
const deleteEmployee = asyncHandler(async (req, res) => {
  if (req.demoMode) {
    return res.json({ message: "Employee deleted (demo mode - not persisted)." });
  }
  const employee = await Employee.findByIdAndDelete(req.params.id);
  if (!employee) return res.status(404).json({ message: "Employee not found." });
  res.json({ message: "Employee deleted successfully." });
});

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
