const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    date: { type: Date, required: true },
    checkIn: { type: String, default: null }, // stored as "HH:MM"
    checkOut: { type: String, default: null },
    workingHours: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Present", "Absent", "Late", "Half Day", "On Leave"],
      default: "Present",
    },
  },
  { timestamps: true }
);

// One attendance record per employee per day
attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
