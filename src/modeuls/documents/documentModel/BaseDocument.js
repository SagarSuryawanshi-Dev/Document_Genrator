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








//   import mongoose from "mongoose";

// const options = {
//   discriminatorKey: "documentType",
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
//       type: String,
//       required: true,
//       trim: true,
//     },

//     // 🔥 FIX FOR DUPLICATE KEY ERROR
//     documentNumber: {
//       type: String,
//       trim: true,
//     },
//   },
//   options
// );

// // 🔐 UNIQUE ONLY WHEN VALUE EXISTS
// baseDocumentSchema.index(
//   { documentNumber: 1 },
//   {
//     unique: true,
//     partialFilterExpression: {
//       documentNumber: { $exists: true, $ne: null },
//     },
//   }
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

    documentNumber: {
      type: String,
      trim: true,
    },
  },
  options
);

// 🔐 UNIQUE documentNumber ONLY when exists
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