const asyncHandler = require("../middleware/asyncHandler");
const Announcement = require("../models/Announcement");
const { mockAnnouncements, mockEmployees } = require("../seed/mockData");

let demoAnnouncements = [...mockAnnouncements];

const withMockEmployee = (rec) => ({
  ...rec,
  postedBy: mockEmployees.find((e) => e._id === rec.postedBy) || null,
});

// @route GET /api/announcements
const getAnnouncements = asyncHandler(async (req, res) => {
  if (req.demoMode) {
    const results = [...demoAnnouncements]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map(withMockEmployee);
    return res.json(results);
  }

  const announcements = await Announcement.find().sort({ date: -1 }).populate("postedBy");
  res.json(announcements);
});

// @route POST /api/announcements
const createAnnouncement = asyncHandler(async (req, res) => {
  const { title, description, priority } = req.body;

  if (req.demoMode) {
    const newItem = {
      _id: `an${demoAnnouncements.length + 1}`,
      title,
      description,
      priority: priority || "Medium",
      date: new Date().toISOString().slice(0, 10),
      postedBy: req.user.employeeId,
    };
    demoAnnouncements.push(newItem);
    return res.status(201).json(withMockEmployee(newItem));
  }

  const announcement = await Announcement.create({
    title,
    description,
    priority,
    postedBy: req.user.employeeId,
  });
  res.status(201).json(announcement);
});

module.exports = { getAnnouncements, createAnnouncement };
