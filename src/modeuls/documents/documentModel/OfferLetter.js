import mongoose from "mongoose";
import Document from "./BaseDocument.js";

const offerLetterSchema = new mongoose.Schema({
  mrms: {
    type: String,
    enum: ["Mr.", "Mrs.", "Miss.", "Mx."],
    required: true,
  },

  candidateName: {
    type: String,
    required: true,
    trim: true,
  },

  address: {
    type: String,
    trim: true,
  },

  position: {
    type: String,
    required: true,
  },

  department: {
    type: String,
    required: true,
  },

  employmentType: {
    type: String,
    enum: ["Full-time", "Part-time", "Contract", "Internship"],
    required: true,
  },

  joiningDate: {
    type: Date,
    required: true,
  },

  probationPeriod: {
    type: Number,
  },

  salary: {
    type: Number,
    required: true,
  },

  location: {
    type: String,
    required: true,
  },

  workHours: {
    type: String,
  },

  reportingManager: {
    type: String,
    required: true,
  },

  noticePeriod: {
    type: String,
  },

  offerValidTill: {
    type: Date,
    required: true,
  },

  offerType: {
    type: String,
    enum: ["withPF", "withoutPF"],
    required: true,
  },

  issueDate: {
    type: Date,
    required: true,
  },

  status: {
    type: String,
    enum: ["Draft", "Issued", "Accepted", "Rejected"],
    default: "Draft",
  },
});

/**
 * One candidate → one offer per company per joining date
 */
offerLetterSchema.index(
  { company: 1, candidateName: 1, joiningDate: 1 },
  { unique: true }
);

export default Document.discriminator("OfferLetter", offerLetterSchema);