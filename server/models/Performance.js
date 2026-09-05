const mongoose = require("mongoose");

const performanceSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    reviewCycle: { type: String, required: true }, // e.g. "Q2 2026"
    score: { type: Number, min: 1, max: 5, required: true },
    managerFeedback: { type: String, default: "" },
    strengths: [{ type: String }],
    improvements: [{ type: String }],
    goals: [{ type: String }],
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    status: {
      type: String,
      enum: ["Draft", "In Review", "Completed"],
      default: "Completed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Performance", performanceSchema);
