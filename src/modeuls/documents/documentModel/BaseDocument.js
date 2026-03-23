

import mongoose from "mongoose";

const options = {
  discriminatorKey: "documentType",
  timestamps: true,
};

const baseDocumentSchema = new mongoose.Schema(
  {
    title: {
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
    employeeEmail: {
      type: String,
      required: true,
      trim: true
    },
    employeeNumber: {
      type: Number,
      required: true,
      trim:true
    },
    company: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "Nimbja Security Solutions Pvt. Ltd.",
        "Smart Software Services Pvt. Ltd.",
        "SmartMatrix Digital Services Pvt. Ltd.",
        "Devcons Software Solutions Pvt. Ltd.",
        "Penta Software Consultancy Services Pvt. Ltd.",
        "Cubeage Technologies Services Pvt. Ltd.",
        "Quick Management Service Pvt. Ltd.",
        "Neweage Cloud Solution Pvt. Ltd.",
        "RP Business Solutions LLP",
        "JDIT Software Solutions Pvt. Ltd.",
      ],
    },

    issuedTo: {
      type: String,
      required: true,
      trim: true,
    },
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    documentNumber: {
      type: String,
      trim: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Pending"],
      default: "Pending",
      required:true
    }

  },
  options,
);

// 🔐 UNIQUE documentNumber ONLY when exists
baseDocumentSchema.index(
  { documentNumber: 1 },
  {
    unique: true,
    partialFilterExpression: {
      documentNumber: { $exists: true, $ne: null },
    },
  },
);
baseDocumentSchema.index({
  employeeEmail: 1,
  company: 1,
});

const Document = mongoose.model("Document", baseDocumentSchema);

export default Document;