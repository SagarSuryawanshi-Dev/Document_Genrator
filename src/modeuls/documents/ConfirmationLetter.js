import mongoose from "mongoose";
import Document from "./BaseDocument.js";

const confirmationLetterSchema = new mongoose.Schema({
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
    trim: true,
  },

  effectiveDate: {
    type: Date,
    required: true,
  },

  issueDate: {
    type: Date,
    required: true,
  },

  totalSalary: {
    type: Number,
    required: true,
  },

  position: {
    type: String,
    required: true,
  },

  department: {
    type: String,
  },

  address: {
    type: String,
  },

  confirmationType: {
    type: String,
    enum: ["withPF", "withoutPF"],
    required: true,
  },
});

/**
 * One confirmation per company per employee per effective date
 */
confirmationLetterSchema.index(
  { company: 1, employeeId: 1, effectiveDate: 1 },
  { unique: true }
);

export default Document.discriminator(
  "ConfirmationLetter",
  confirmationLetterSchema
);