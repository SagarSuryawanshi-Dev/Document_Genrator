import mongoose from "mongoose";
import Document from "./BaseDocument.js";

const experienceLetterSchema = new mongoose.Schema({
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
  },

  joiningDate: {
    type: Date,
    required: true,
  },

  relievingDate: {
    type: Date,
    required: true,
  },

  conduct: {
    type: String,
    enum: ["Excellent", "Very Good", "Good", "Satisfactory"],
  },

  issueDate: {
    type: Date,
    required: true,
  },
});

/**
 * One experience letter per company per employee per relieving date
 */
experienceLetterSchema.index(
  { company: 1, employeeId: 1, relievingDate: 1 },
  { unique: true }
);

export default Document.discriminator(
  "ExperienceLetter",
  experienceLetterSchema
);