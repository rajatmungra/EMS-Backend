import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date },
  location: {
    type: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    required: true,
  },
}, { timestamps: true });

export default mongoose.model("Attendance", attendanceSchema);
