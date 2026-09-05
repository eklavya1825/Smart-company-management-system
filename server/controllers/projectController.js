const asyncHandler = require("../middleware/asyncHandler");
const Project = require("../models/Project");
const Task = require("../models/Task");
const { mockProjects, mockEmployees, mockTasks } = require("../seed/mockData");

const withMockRefs = (proj) => ({
  ...proj,
  manager: mockEmployees.find((e) => e._id === proj.manager) || null,
  teamMembers: proj.teamMembers.map((id) => mockEmployees.find((e) => e._id === id)).filter(Boolean),
});

// @route GET /api/projects
const getProjects = asyncHandler(async (req, res) => {
  const { status } = req.query;

  if (req.demoMode) {
    let results = mockProjects.map(withMockRefs);
    if (status) results = results.filter((p) => p.status === status);
    return res.json(results);
  }

  const query = {};
  if (status) query.status = status;
  const projects = await Project.find(query).populate("manager teamMembers");
  res.json(projects);
});

// @route GET /api/projects/:id
const getProjectById = asyncHandler(async (req, res) => {
  if (req.demoMode) {
    const proj = mockProjects.find((p) => p._id === req.params.id);
    if (!proj) return res.status(404).json({ message: "Project not found." });
    const tasks = mockTasks.filter((t) => t.project === proj._id);
    return res.json({ ...withMockRefs(proj), tasks });
  }

  const project = await Project.findById(req.params.id).populate("manager teamMembers");
  if (!project) return res.status(404).json({ message: "Project not found." });
  const tasks = await Task.find({ project: project._id }).populate("assignedTo");
  res.json({ ...project.toObject(), tasks });
});

// @route POST /api/projects
const createProject = asyncHandler(async (req, res) => {
  if (req.demoMode) return res.status(201).json({ ...req.body, _id: `p${mockProjects.length + 1}` });
  const project = await Project.create(req.body);
  res.status(201).json(project);
});

// @route PUT /api/projects/:id
const updateProject = asyncHandler(async (req, res) => {
  if (req.demoMode) return res.json({ ...req.body, _id: req.params.id });
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!project) return res.status(404).json({ message: "Project not found." });
  res.json(project);
});

// @route DELETE /api/projects/:id
const deleteProject = asyncHandler(async (req, res) => {
  if (req.demoMode) return res.json({ message: "Project deleted (demo mode - not persisted)." });
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) return res.status(404).json({ message: "Project not found." });
  res.json({ message: "Project deleted successfully." });
});

// @route POST /api/projects/:id/tasks
const addTask = asyncHandler(async (req, res) => {
  if (req.demoMode) {
    return res.status(201).json({ ...req.body, _id: `t${mockTasks.length + 1}`, project: req.params.id });
  }
  const task = await Task.create({ ...req.body, project: req.params.id });
  res.status(201).json(task);
});

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addTask,
};
