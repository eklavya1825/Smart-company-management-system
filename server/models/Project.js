const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    projectCode: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    client: { type: String, default: "Internal" },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
    startDate: { type: Date, default: Date.now },
    deadline: { type: Date },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Planning", "In Progress", "On Hold", "Completed"],
      default: "Planning",
    },
    progress: { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
