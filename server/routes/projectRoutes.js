const express = require("express");
const router = express.Router();
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addTask,
} = require("../controllers/projectController");
const { protect, allowRoles } = require("../middleware/auth");

router.use(protect);

router.get("/", getProjects);
router.get("/:id", getProjectById);
router.post("/", allowRoles("Admin", "Manager"), createProject);
router.put("/:id", allowRoles("Admin", "Manager"), updateProject);
router.delete("/:id", allowRoles("Admin", "Manager"), deleteProject);
router.post("/:id/tasks", allowRoles("Admin", "Manager"), addTask);

module.exports = router;
