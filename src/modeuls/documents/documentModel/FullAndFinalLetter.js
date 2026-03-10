import mongoose from "mongoose";
import Document from "./BaseDocument.js";

const fullAndFinalSchema = new mongoose.Schema({
 

  designation: {
    type: String,
    required: true,
  },

  department: {
    type: String,
  },

  fnfDate: {
    type: Date,
    required: true,
  },

  month: {
    type: String, // YYYY-MM
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

  resignationDate: {
    type: Date,
    required: true,
  },

  leavingDate: {
    type: Date,
    required: true,
  },

  leaveEncashment: {
    type: Number,
    default: 0,
  },

  paidDays: {
    type: Number,
    required: true,
  },

  finalType: {
    type: String,
    enum: ["withPF", "withoutPF"],
    required: true,
  },

  workdays: {
    type: Number,
    required: true,
  },
});

/**
 * One FNF per company per employee per leaving date
 */
fullAndFinalSchema.index(
  { company: 1, employeeId: 1, leavingDate: 1 },
  { unique: true }
);

export default Document.discriminator(
  "FullAndFinalLetter",
  fullAndFinalSchema
);