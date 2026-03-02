import mongoose from "mongoose";

const options = {
  discriminatorKey: "documentType", // 🔥 important
  timestamps: true,
};

const baseDocumentSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    issuedTo: {
      type: String, // candidate name
      required: true,
    },

    documentNumber: {
      type: String,
      unique: true,
    },
  },
  options
);

export default mongoose.model("Document", baseDocumentSchema);