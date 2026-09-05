const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    basicSalary: { type: Number, required: true },
    allowances: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    netSalary: { type: Number, required: true },
    payDate: { type: Date, default: Date.now },
    month: { type: String, required: true }, // e.g. "August 2026"
    status: {
      type: String,
      enum: ["Paid", "Pending", "Processing"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payroll", payrollSchema);
