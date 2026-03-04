  // import mongoose from "mongoose";

  // const options = {
  //   discriminatorKey: "documentType", // 🔥 important
  //   timestamps: true,
  // };

  // const baseDocumentSchema = new mongoose.Schema(
  //   {
  //     company: {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "Company",
  //       required: true,
  //     },

  //     issuedTo: {
  //       type: String, // candidate name
  //       required: true,
  //     }
      
  //   },
  //   options
  // );

  // export default mongoose.model("Document", baseDocumentSchema);








  import mongoose from "mongoose";

const options = {
  discriminatorKey: "documentType",
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
      type: String,
      required: true,
      trim: true,
    },

    // 🔥 FIX FOR DUPLICATE KEY ERROR
    documentNumber: {
      type: String,
      trim: true,
    },
  },
  options
);

// 🔐 UNIQUE ONLY WHEN VALUE EXISTS
baseDocumentSchema.index(
  { documentNumber: 1 },
  {
    unique: true,
    partialFilterExpression: {
      documentNumber: { $exists: true, $ne: null },
    },
  }
);

export default mongoose.model("Document", baseDocumentSchema);