import mongoose from "mongoose";
import Document from "./BaseDocument.js";

const relievingLetterSchema = new mongoose.Schema({
  
  designation: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    default: "",
  },
  joiningDate: {
    type: Date,
    required: true,
  },
  lastWorkingDay: {
    type: Date,
    required: true,
  },
  noticePeriod: {
    type: String,
    default: "",
  },
  handoverStatus: {
    type: String,
    enum: ["Completed", "Partially Completed", "Not Applicable"],
    default: "Not Applicable",
  },
  issueDate: {
    type: Date,
    required: true,
  },
});

/**
 * Better unique rule:
 * One employee → one relieving letter per company per joining cycle
 */
relievingLetterSchema.index(
  { company: 1, employeeId: 1, lastWorkingDay: 1 },
  { unique: true }
);

export default Document.discriminator("RelievingLetter", relievingLetterSchema);