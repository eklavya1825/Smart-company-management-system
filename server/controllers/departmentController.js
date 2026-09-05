const asyncHandler = require("../middleware/asyncHandler");
const Department = require("../models/Department");
const Employee = require("../models/Employee");
const Project = require("../models/Project");
const { mockDepartments, mockEmployees, mockProjects } = require("../seed/mockData");

// @route GET /api/departments
const getDepartments = asyncHandler(async (req, res) => {
  if (req.demoMode) {
    const results = mockDepartments.map((d) => ({
      ...d,
      head: mockEmployees.find((e) => e._id === d.head) || null,
    }));
    return res.json(results);
  }

  const departments = await Department.find().populate("head");
  const withCounts = await Promise.all(
    departments.map(async (dept) => {
      const employeeCount = await Employee.countDocuments({ department: dept._id });
      const activeProjects = await Project.countDocuments({
        status: { $in: ["Planning", "In Progress"] },
      });
      return { ...dept.toObject(), employeeCount, activeProjects };
    })
  );
  res.json(withCounts);
});

// @route GET /api/departments/:id
const getDepartmentById = asyncHandler(async (req, res) => {
  if (req.demoMode) {
    const dept = mockDepartments.find((d) => d._id === req.params.id);
    if (!dept) return res.status(404).json({ message: "Department not found." });
    const employees = mockEmployees.filter((e) => e.department === dept._id);
    const head = mockEmployees.find((e) => e._id === dept.head) || null;
    return res.json({ ...dept, head, employees });
  }

  const dept = await Department.findById(req.params.id).populate("head");
  if (!dept) return res.status(404).json({ message: "Department not found." });
  const employees = await Employee.find({ department: dept._id });
  res.json({ ...dept.toObject(), employees });
});

// @route POST /api/departments
const createDepartment = asyncHandler(async (req, res) => {
  if (req.demoMode) return res.status(201).json({ ...req.body, _id: `d${mockDepartments.length + 1}` });
  const dept = await Department.create(req.body);
  res.status(201).json(dept);
});

module.exports = { getDepartments, getDepartmentById, createDepartment };
