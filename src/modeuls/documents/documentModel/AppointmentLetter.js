import mongoose from "mongoose";
import Document from "./BaseDocument.js";

const appointmentLetterSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
    },

    position: {
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

    probationPeriod: {
      type: Number,
      required: true,
      set: (v) => parseInt(v),
    },

    salary: {
      type: Number,
      required: true,
      set: (v) => parseInt(v),
    },

    workLocation: {
      type: String,
      required: true,
    },

    reportingManager: {
      type: String,
    },

    workHours: {
      type: String,
      default: "9:30 AM – 6:30 PM",
    },

    appointmentType: {
      type: String,
      enum: ["withPF", "withoutPF"],
      required: true,
    },

    issueDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

export default Document.discriminator(
  "AppointmentLetter",
  appointmentLetterSchema,
);
