import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
    payroll: { type: mongoose.Schema.Types.ObjectId, ref: "Payroll", required: true },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    amount: { type: Number, required: true },
    paymentDate: { type: Date, required: true },
    paymentMethod: { type: String, enum: ["bank_transfer", "cash", "check"], required: true },
    transactionId: { type: String, unique: true } // Transaction reference
  }, { timestamps: true });

export default mongoose.model("Payment", PaymentSchema);

