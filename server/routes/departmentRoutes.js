const express = require("express");
const router = express.Router();
const {
  getDepartments,
  getDepartmentById,
  createDepartment,
} = require("../controllers/departmentController");
const { protect, allowRoles } = require("../middleware/auth");

router.use(protect);

router.get("/", getDepartments);
router.get("/:id", getDepartmentById);
router.post("/", allowRoles("Admin"), createDepartment);

module.exports = router;
