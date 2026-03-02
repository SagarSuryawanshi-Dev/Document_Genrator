import mongoose from "mongoose";
import Document from "./BaseDocument.js";

const employmentVerificationSchema = new mongoose.Schema({
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

  designation: {
    type: String,
    required: true,
  },

  department: {
    type: String,
    required: true,
  },

  joiningDate: {
    type: Date,
    required: true,
  },

  employmentStatus: {
    type: String,
    enum: ["Active", "Former"],
    required: true,
  },

  currentSalary: {
    type: Number,
    default: null,
  },

  workLocation: {
    type: String,
    required: true,
  },

  requestedBy: {
    type: String,
    required: true,
  },

  purpose: {
    type: String,
    default: "",
  },

  issueDate: {
    type: Date,
    required: true,
  },
});

/**
 * Allow multiple verifications but prevent exact duplicate issue
 */
employmentVerificationSchema.index(
  { company: 1, employeeId: 1, issueDate: 1, requestedBy: 1 },
  { unique: true }
);

export default Document.discriminator(
  "EmploymentVerification",
  employmentVerificationSchema
);