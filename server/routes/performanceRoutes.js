const express = require("express");
const router = express.Router();
const { getPerformance, createPerformance } = require("../controllers/performanceController");
const { protect, allowRoles } = require("../middleware/auth");

router.use(protect);

router.get("/", getPerformance);
router.post("/", allowRoles("Admin", "HR", "Manager"), createPerformance);

module.exports = router;
