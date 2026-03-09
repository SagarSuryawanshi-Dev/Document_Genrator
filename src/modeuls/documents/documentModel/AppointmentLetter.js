// import mongoose from "mongoose";
// import Document from "./BaseDocument.js";

// const appointmentLetterSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     enum: ["Mr.", "Mrs.", "Miss.", "Mx."],
//     required: true,
//   },

//   company: {
//     type: String,
//     required: true,
//   },

//   employeeName: {
//     type: String,
//     required: true,
//     trim: true,
//   },

//   employeeId: {
//     type: String,
//     required: true,
//     unique: true,
//   },

//   address: {
//     type: String,
//     required: true,
//   },

//   position: {
//     type: String,
//     required: true,
//   },

//   department: {
//     type: String,
//     default: "",
//   },

//   joiningDate: {
//     type: Date,
//     required: true,
//   },

//   probationPeriod: {
//     type: Number,
//     required: true,
//     set: (v) => parseInt(v), // ✅ "6 Months" → 6
//   },

//   salary: {
//     type: Number,
//     required: true,
//     set: (v) => parseInt(v), // ✅ "6 LPA" → 6
//   },

//   workLocation: {
//     type: String,
//     required: true,
//   },

//   reportingManager: {
//     type: String,
//     required: true,
//   },

//   workHours: {
//     type: String,
//     default: "9:30 AM – 6:30 PM",
//   },

//   appointmentType: {
//     type: String,
//     enum: ["withPF", "withoutPF"],
//     required: true,
//   },

//   issueDate: {
//     type: Date,
//     required: true,
//   },
// }, { timestamps: true });

// export default Document.discriminator("AppointmentLetter", appointmentLetterSchema);









import mongoose from "mongoose";
import Document from "./BaseDocument.js";

const appointmentLetterSchema = new mongoose.Schema(
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

    // employeeId: {
    //   type: String,
    //   required: true,
    //   unique: true,
    //   trim: true,
    // },

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
  { timestamps: true }
);

export default Document.discriminator(
  "AppointmentLetter",
  appointmentLetterSchema
);