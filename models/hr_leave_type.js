import mongoose from "mongoose";
import LeaveAllocation from "./hr_leave_allocation.js"

const LeaveTypeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    approval_required: { type: Boolean, required: true }
  }, { timestamps: true });

LeaveTypeSchema.pre("deleteOne", async function (next) {
  console.log(this.getQuery())
    const leaveTypeId = this.getQuery()._id;
    const hasAllocations = await LeaveAllocation.findOne({ leaveType: leaveTypeId });
    if (hasAllocations) {
      return next(new Error("Cannot delete leave type: It is assigned in leave allocations."));
    }
    next();
  });

export default  mongoose.model("LeaveType", LeaveTypeSchema);
