import mongoose from "mongoose";

const SalaryStructureSchema = new mongoose.Schema({
    title: { type: String, required: true },
    basicSalary: { type: Number, required: true }, // Base salary amount
    bonuses: { type: Number, default: 0 }, // Additional pay
    deductions: { type: Number, default: 0 }, // Default deductions
    taxRate: { type: Number, default: 0.1 }, // Default tax rate (10%)
  }, { timestamps: true });

export default mongoose.model("SalaryStructure", SalaryStructureSchema);
