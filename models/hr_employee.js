import mongoose from "mongoose";
import Leave from './hr_leave.js'
import LeaveAllocation from "./hr_leave_allocation.js"


const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
  email: { type: String, unique: true, required: true },
  phone: { type: String },
  avatar: { type: String },
  password: {type: String, required: true},
  role: { type: String, enum: ["admin", "employee"], default: "employee", required: true },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
}, { timestamps: true });



EmployeeSchema.pre("remove", async function (next) {
  const employeeId = this.getQuery()._id;
  const hasLeaves = await Leave.findOne({ employee: employeeId });
  const hasLeaveAllocations = await LeaveAllocation.findOne({ employee: employeeId });
  const isManager = await Employee.findOne({ manager: employeeId });

  if (hasLeaves || hasLeaveAllocations || isManager) {
    return next(new Error("Cannot delete employee: They have associated leave records or subordinates."));
  }
  next();
});

export default mongoose.model("Employee", EmployeeSchema);
