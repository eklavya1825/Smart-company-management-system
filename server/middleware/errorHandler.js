// Handles routes that don't exist
const notFound = (req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

// Central error handler - catches errors passed via next(error)
// or thrown inside async route handlers (see utils/asyncHandler.js pattern below).
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid ID format." });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(", ") });
  }

  // Duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    return res.status(400).json({ message: `Duplicate value for field: ${field}` });
  }

  res.status(err.statusCode || 500).json({
    message: err.message || "Something went wrong on the server.",
  });
};

module.exports = { notFound, errorHandler };
