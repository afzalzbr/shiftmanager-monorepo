// models/shiftsModel.js
import mongoose from "mongoose";
import "./locationModel.js";
import "./userModel.js";

const ShiftSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    role: { type: String, required: true },
    typeOfShift: [{ type: String }],

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    startTime: { type: String, required: true },
    finishTime: { type: String, required: true },
    numOfShiftsPerDay: { type: Number, default: 1 },

    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },

    date: { type: Date, required: true },

    // Clock in/out tracking
    clockInTime: { type: Date },
    clockOutTime: { type: Date },
    isClockedIn: { type: Boolean, default: false },
    totalHoursWorked: { type: Number, default: 0 }, // in minutes
  },
  { timestamps: true }
);

export default mongoose.model("Shift", ShiftSchema);
