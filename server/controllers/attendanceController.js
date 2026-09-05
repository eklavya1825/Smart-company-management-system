const asyncHandler = require("../middleware/asyncHandler");
const Attendance = require("../models/Attendance");
const Employee = require("../models/Employee");
const { mockAttendance, mockEmployees } = require("../seed/mockData");

const withMockEmployee = (rec) => ({
  ...rec,
  employee: mockEmployees.find((e) => e._id === rec.employee) || null,
});

// @route GET /api/attendance?date=YYYY-MM-DD
const getAttendance = asyncHandler(async (req, res) => {
  const { date, employee } = req.query;

  if (req.demoMode) {
    let results = mockAttendance.map(withMockEmployee);
    if (date) results = results.filter((r) => r.date === date);
    if (employee) results = results.filter((r) => r.employee && r.employee._id === employee);
    return res.json(results);
  }

  const query = {};
  if (date) {
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);
    query.date = { $gte: start, $lt: end };
  }
  if (employee) query.employee = employee;

  const records = await Attendance.find(query).populate("employee");
  res.json(records);
});

// @route POST /api/attendance (check-in / check-out / manual entry)
const markAttendance = asyncHandler(async (req, res) => {
  const { employee, date, checkIn, checkOut, status } = req.body;

  if (req.demoMode) {
    return res.status(201).json({
      _id: `a${mockAttendance.length + 1}`,
      employee,
      date,
      checkIn: checkIn || null,
      checkOut: checkOut || null,
      status: status || "Present",
    });
  }

  const existing = await Attendance.findOne({ employee, date });
  if (existing) {
    if (checkIn) existing.checkIn = checkIn;
    if (checkOut) existing.checkOut = checkOut;
    if (status) existing.status = status;
    await existing.save();
    return res.json(existing);
  }

  const record = await Attendance.create({ employee, date, checkIn, checkOut, status });
  res.status(201).json(record);
});

module.exports = { getAttendance, markAttendance };
