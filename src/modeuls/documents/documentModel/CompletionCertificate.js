import mongoose from "mongoose";

const CompletionCertificateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      enum: ["Mr.", "Mrs.", "Miss.", "Mx."],
    },
    employeeId: {
      type: String,
      ref: "Employee",
      required: true,
    },
    employeeName: {
      type: String,
      required: true,
      trim: true,
    },
    projectName: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    completionDate: {
      type: Date,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    roleinProject: {
      type: String,
      required: true,
      trim: true,
    },
    technologies: [{ type: String, trim: true }],
    achievements: [{ type: String, trim: true }],
    clientName: {
      type: String,
    },
    issueDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

CompletionCertificateSchema.index(
  { employeeId: 1, projectName: 1 },
  { unique: true },
);

export default mongoose.model(
  "CompletionCertificate",
  CompletionCertificateSchema,
);
