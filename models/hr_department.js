import mongoose from "mongoose";
import Employee from './hr_employee.js'

const DepartmentSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    avatar: { type: String },
  }, { timestamps: true });

DepartmentSchema.pre("findOneAndDelete", async function (next) {
  const departmentId = this.getQuery()._id;
  const employees = await Employee.findOne({ department: departmentId });

  if (employees) {
    return next(new Error("Cannot delete department: Employees are assigned to it."));
  }

  next();
});

export default mongoose.model("Department", DepartmentSchema);
