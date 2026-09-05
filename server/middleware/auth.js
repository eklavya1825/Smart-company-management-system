const jwt = require("jsonwebtoken");

// Verifies the JWT sent in the Authorization header and attaches
// the decoded user info to req.user for later use in controllers.
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role, employeeId, name, email }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized. Invalid or expired token." });
  }
};

// Usage: allowRoles("Admin", "HR")
const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied. Insufficient permissions." });
    }
    next();
  };
};

module.exports = { protect, allowRoles };
