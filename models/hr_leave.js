import mongoose from "mongoose";

const LeaveSchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    allocation: { type: mongoose.Schema.Types.ObjectId, ref: "LeaveAllocation", required: true },
    dateFrom: { type: Date, required: true },
    dateTo: { type: Date, required: true },
    status: { type: String, enum: ["pending", "approved", "refused"], default: "pending" },
    description: { type: String },
    approver: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  }, { timestamps: true });

export default mongoose.model("Leave", LeaveSchema);
