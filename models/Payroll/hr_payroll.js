import mongoose from "mongoose";

const PayrollSchema = new mongoose.Schema({
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    period: { type: String, required: true }, // Example: "March 2025"
    grossSalary: { type: Number, required: true }, // Total before deductions
    netSalary: { type: Number, required: true }, // Salary after deductions
    taxAmount: { type: Number, required: true },
    deductions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Deduction" }], // List of deductions
    paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
    paymentDate: { type: Date }
  }, { timestamps: true });


export default mongoose.model("Payroll", PayrollSchema);
