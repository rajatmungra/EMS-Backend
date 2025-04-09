import mongoose from "mongoose";

const PayrollSettingsSchema = new mongoose.Schema({
    defaultTaxRate: { type: Number, default: 0.1 }, // Default 10%
    defaultBonusRate: { type: Number, default: 0 },
    defaultDeductions: { type: Number, default: 0 }
  }, { timestamps: true });

export default mongoose.model("PayrollSettings", PayrollSettingsSchema);
