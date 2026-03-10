import mongoose from "mongoose";
import Document from "./BaseDocument.js";

const internshipCertificateSchema = new mongoose.Schema({
  

  designation: {
    type: String,
    required: true,
  },

  address: {
    type: String,
  },

  internshipType: {
    type: String,
    enum: ["paid", "unpaid"],
    required: true,
  },

  stipend: {
    type: Number,
    default: 0,
  },

  startDate: {
    type: Date,
    required: true,
  },

  endDate: {
    type: Date,
    required: true,
  },

  issueDate: {
    type: Date,
    required: true,
  },
});

/**
 * One internship certificate per company per employee per internship period
 */
internshipCertificateSchema.index(
  { company: 1, employeeId: 1, startDate: 1, endDate: 1 },
  { unique: true }
);

export default Document.discriminator(
  "InternshipCertificate",
  internshipCertificateSchema
);