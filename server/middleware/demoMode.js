const { isDbConnected } = require("../config/db");

// Attaches req.demoMode = true when MongoDB is not connected.
// Controllers check this flag and return mock data instead of
// querying the (unavailable) database.
const demoMode = (req, res, next) => {
  req.demoMode = !isDbConnected();
  next();
};

module.exports = demoMode;
