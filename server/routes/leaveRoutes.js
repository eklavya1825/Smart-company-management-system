const express = require("express");
const router = express.Router();
const { getLeaves, applyLeave, updateLeaveStatus } = require("../controllers/leaveController");
const { protect, allowRoles } = require("../middleware/auth");

router.use(protect);

router.get("/", getLeaves);
router.post("/", applyLeave);
router.put("/:id", allowRoles("Admin", "HR", "Manager"), updateLeaveStatus);

module.exports = router;
