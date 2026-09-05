const express = require("express");
const router = express.Router();
const { getPayroll } = require("../controllers/payrollController");
const { protect } = require("../middleware/auth");

router.use(protect);

router.get("/", getPayroll);

module.exports = router;
