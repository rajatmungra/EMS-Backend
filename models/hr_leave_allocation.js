import mongoose from "mongoose";
import Leave from "./hr_leave.js"

const LeaveAllocationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  leaveType: { type: mongoose.Schema.Types.ObjectId, ref: "LeaveType", required: true },
  dateFrom: { type: Date, required: true },
  dateTo: { type: Date, required: true },
  totalDays: { 
    type: Number, 
    required: true,
    min: [1, 'Allocation must be for at least 1 day']
  },
  usedDays: { type: Number, default: 0, min: 0 }
}, { timestamps: true });


LeaveAllocationSchema.pre("findOneAndDelete", async function (next) {
    const allocationId = this.getQuery()._id;
    const hasLeaves = await Leave.findOne({ allocation: allocationId });
    if (hasLeaves) {
      return next(new Error("Cannot delete leave allocation: It is referenced in leave records."));
    }
    next();
  });

export default mongoose.model("LeaveAllocation", LeaveAllocationSchema);
