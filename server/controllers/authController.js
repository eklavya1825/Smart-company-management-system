const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("../middleware/asyncHandler");
const User = require("../models/User");
const Employee = require("../models/Employee");
const { mockEmployees } = require("../seed/mockData");

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// Demo credentials used when MongoDB is unavailable.
// Passwords match the seeded accounts documented in the README.
const demoAccounts = [
  { email: "admin@scms.com", password: "admin123", role: "Admin", name: "System Admin", employee: null },
  { email: "hr@scms.com", password: "hr123", role: "HR", name: "Neha Kapoor", employee: "e7" },
  { email: "manager@scms.com", password: "manager123", role: "Manager", name: "Aarav Sharma", employee: "e1" },
  { email: "employee@scms.com", password: "employee123", role: "Employee", name: "Priya Nair", employee: "e2" },
];

// @route  POST /api/auth/login
// @access Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  // ---- DEMO MODE: no database connection ----
  if (req.demoMode) {
    const account = demoAccounts.find(
      (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password
    );
    if (!account) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    const employee = mockEmployees.find((e) => e._id === account.employee) || null;
    const token = generateToken({
      id: account.email,
      name: account.name,
      role: account.role,
      employeeId: account.employee,
    });
    return res.json({
      token,
      user: { name: account.name, email: account.email, role: account.role, employee },
    });
  }

  // ---- NORMAL MODE: real database ----
  const user = await User.findOne({ email: email.toLowerCase() }).populate("employee");
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const token = generateToken({
    id: user._id,
    name: user.name,
    role: user.role,
    employeeId: user.employee ? user.employee._id : null,
  });

  res.json({
    token,
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
      employee: user.employee,
    },
  });
});

// @route  GET /api/auth/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
  if (req.demoMode) {
    const account = demoAccounts.find((a) => a.email === req.user.id);
    const employee = mockEmployees.find((e) => e._id === (account && account.employee)) || null;
    return res.json({ name: req.user.name, role: req.user.role, employee });
  }

  const user = await User.findById(req.user.id).populate("employee").select("-password");
  if (!user) return res.status(404).json({ message: "User not found." });
  res.json(user);
});

module.exports = { login, getMe };
