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
      trim: true,
      lowercase: true, // ✅ better consistency
    },

    employeeNumber: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "NIMBJA SECURITY SOLUTIONS Pvt. Ltd.",
        "Smart Software Services (I) Pvt. Ltd.",
        "SmartMatrix Digital Services Pvt. Ltd.",
        "Devcons Software Solutions Pvt. Ltd.",
        "Penta Software Consultancy Services (I) Pvt Ltd",
        "Cubeage Technologies Services Pvt. Ltd.",
        "Quick Management Services",
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
      required: true,
    },

    documentNumber: {
      type: String,
      trim: true,
    },

    paymentStatus: {
      type: String,
      enum: ["Paid", "Pending"],
      default: "Pending",
      required: true,
    },
  },
  options
);


// ================= INDEXES =================

// ✅ 1. Unique documentNumber (ONLY when present)
baseDocumentSchema.index(
  { documentNumber: 1 },
  {
    unique: true,
    partialFilterExpression: {
      documentNumber: { $exists: true, $ne: null },
    },
  }
);

// ✅ 2. Fast filtering (search optimization)
baseDocumentSchema.index({
  employeeEmail: 1,
  company: 1,
});

// ✅ 3. 🔥 CRITICAL: Prevent duplicate document per employee per type
baseDocumentSchema.index(
  { employeeId: 1, documentType: 1 },
  { unique: true }
);

// ================= MODEL =================

const Document = mongoose.model("Document", baseDocumentSchema);

export default Document;