const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    employeeId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, default: "" },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    position: { type: String, default: "" },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", default: null },
    joiningDate: { type: Date, default: Date.now },
    employmentType: {
      type: String,
      enum: ["Full-Time", "Part-Time", "Intern", "Contract"],
      default: "Full-Time",
    },
    salary: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Active", "On Leave", "Inactive"],
      default: "Active",
    },
    avatar: { type: String, default: "" },
    role: {
      type: String,
      enum: ["Admin", "HR", "Manager", "Employee"],
      default: "Employee",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
