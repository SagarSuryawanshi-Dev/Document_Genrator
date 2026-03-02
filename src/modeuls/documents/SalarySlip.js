import mongoose from "mongoose";
import Document from "./BaseDocument.js";

const salarySlipSchema = new mongoose.Schema({
  mrms: {
    type: String,
    enum: ["Mr.", "Mrs.", "Miss.", "Mx."],
    required: true,
  },
  employeeName: {
    type: String,
    required: true,
    trim: true,
  },
  employeeId: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  totalSalary: {
    type: Number,
    required: true,
  },
  doj: {
    type: Date,
    required: true,
  },
  pan: {
    type: String,
    required: true,
    uppercase: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true,
  },
  mode: {
    type: String,
    required: true,
  },
  workdays: {
    type: Number,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  salaryType: {
    type: String,
    enum: ["withPF", "withoutPF"],
    required: true,
  },
  accountNo: {
    type: String,
    required: true,
  },
});

/**
 * ✅ Compound index
 * One employee → one salary slip per month
 */
salarySlipSchema.index(
  { employeeId: 1, month: 1, company: 1 },
  { unique: true }
);

/**
 * 🔥 THIS IS IMPORTANT
 * Use discriminator — not mongoose.model()
 */
export default Document.discriminator("SalarySlip", salarySlipSchema);