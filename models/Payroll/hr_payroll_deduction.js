import mongoose from "mongoose";

const DeductionSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Example: "Income Tax", "Health Insurance"
    percentage: { type: Number, required: true }, // Percentage deduction
    fixedAmount: { type: Number, default: 0 } // Fixed deduction if applicable
  }, { timestamps: true });

export default mongoose.model("Deduction", DeductionSchema);
