const express = require("express");
const router = express.Router();
const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");
const { protect, allowRoles } = require("../middleware/auth");

router.use(protect);

router.get("/", getEmployees);
router.get("/:id", getEmployeeById);
router.post("/", allowRoles("Admin", "HR"), createEmployee);
router.put("/:id", allowRoles("Admin", "HR"), updateEmployee);
router.delete("/:id", allowRoles("Admin", "HR"), deleteEmployee);

module.exports = router;
