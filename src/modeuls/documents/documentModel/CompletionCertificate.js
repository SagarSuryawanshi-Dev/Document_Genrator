import mongoose from "mongoose";
import  Document  from "./BaseDocument.js";

const CompletionCertificateSchema = new mongoose.Schema(
  {
<<<<<<< HEAD
=======
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
>>>>>>> 7986e84ca647eb300c95b161d244b7d8d65c5b45
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
      validate: {
        validator: function (value) {
          return value >= this.startDate;
        },
        message: "Completion date must be after start date",
      },
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
<<<<<<< HEAD
  { employeeId: 1,projectName: 1},
  { unique: true }
  
=======
  { employeeId: 1, projectName: 1 },
  { unique: true },
>>>>>>> 7986e84ca647eb300c95b161d244b7d8d65c5b45
);

export const CompletionCertificate = Document.discriminator(
  "CompletionCertificate",
  CompletionCertificateSchema,
);
