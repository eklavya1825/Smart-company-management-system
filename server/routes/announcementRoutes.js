const express = require("express");
const router = express.Router();
const { getAnnouncements, createAnnouncement } = require("../controllers/announcementController");
const { protect, allowRoles } = require("../middleware/auth");

router.use(protect);

router.get("/", getAnnouncements);
router.post("/", allowRoles("Admin", "HR"), createAnnouncement);

module.exports = router;
