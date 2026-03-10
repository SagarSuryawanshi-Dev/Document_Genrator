import mongoose from "mongoose";
import Document from "./BaseDocument.js";

const incrementLetterSchema = new mongoose.Schema({
 
  designation: {
    type: String,
    required: true,
  },

  department: {
    type: String,
  },

  // currentCTC: {
  //   type: Number,
  // },

  performanceYear:{
    type:Number,
    required:true,
  },
  newCTC: {
    type: Number,
    required: true,
  },

  incrementPercentage: {
    type: Number,
  },

  effectiveDate: {
    type: Date,
    required: true,
  },

  incrementType: {
    type: String,
    enum: ["withPF", "withoutPF"],
    required: true,
  },

  issueDate: {
    type: Date,
    required: true,
  },
});

/**
 * One increment per company per employee per effective date
 */
incrementLetterSchema.index(
  { company: 1, employeeId: 1, effectiveDate: 1 },
  { unique: true }
);

export default Document.discriminator(
  "IncrementLetter",
  incrementLetterSchema
);