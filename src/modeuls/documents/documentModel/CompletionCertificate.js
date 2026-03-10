import mongoose from "mongoose";

const CompletionCertificateSchema = new mongoose.Schema(
  {
    
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
    role: {
      type: String,
      required: true,
    },
    technologies: [{ type: String }],
    achievements: [{ type: String }],
    clientName: {
      type: String,
    },
    issueDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

CompletionCertificateSchema.index(
  { employee: 1, projectName: 1 },
  { unique: true }
);

export default mongoose.model(
  "CompletionCertificate",
  CompletionCertificateSchema
);