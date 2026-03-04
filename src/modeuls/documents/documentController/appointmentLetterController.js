// import AppointmentLetter from "../documentModel/AppointmentLetter.js";

// /* ================= CREATE ================= */
// export const createAppointmentLetter = async (req, res) => {
//   try {
//     const body = req.body;

//     if (!body || Object.keys(body).length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Request body is missing",
//       });
//     }

//     const requiredFields = [
//       "title",
//       "company",        // ObjectId
//       "issuedTo",       // REQUIRED by BaseDocument
//       "employeeName",
//       "employeeId",
//       "address",
//       "position",
//       "joiningDate",
//       "probationPeriod",
//       "salary",
//       "workLocation",
//       "reportingManager",
//       "appointmentType",
//       "issueDate",
//     ];

//     const missingFields = requiredFields.filter(
//       (field) => !body[field]
//     );

//     if (missingFields.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: `Missing required fields: ${missingFields.join(", ")}`,
//       });
//     }

//     const exists = await AppointmentLetter.findOne({
//       employeeId: body.employeeId,
//     });

//     if (exists) {
//       return res.status(409).json({
//         success: false,
//         message: "Appointment letter already exists for this employeeId",
//       });
//     }

//     const letter = await AppointmentLetter.create({
//       ...body,
//       issuedTo: body.issuedTo,  // ✅ REQUIRED
//       company: body.company,    // ✅ ObjectId
//     });

//     res.status(201).json({
//       success: true,
//       message: "Appointment letter created successfully",
//       data: letter,
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };
// /* ================= READ ALL ================= */
// export const getAllAppointmentLetters = async (req, res) => {
//   try {
//     const letters = await AppointmentLetter.find().sort({
//       createdAt: -1,
//     });

//     res.status(200).json({
//       success: true,
//       count: letters.length,
//       data: letters,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// /* ================= READ ONE ================= */
// export const getAppointmentLetterById = async (req, res) => {
//   try {
//     const letter = await AppointmentLetter.findById(req.params.id);

//     if (!letter) {
//       return res.status(404).json({
//         success: false,
//         message: "Appointment letter not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: letter,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: "Invalid appointment letter ID",
//     });
//   }
// };

// /* ================= UPDATE ================= */
// export const updateAppointmentLetter = async (req, res) => {
//   try {
//     if (!req.body || Object.keys(req.body).length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Request body is missing",
//       });
//     }

//     const updated = await AppointmentLetter.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     );

//     if (!updated) {
//       return res.status(404).json({
//         success: false,
//         message: "Appointment letter not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Appointment letter updated successfully",
//       data: updated,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// /* ================= DELETE ================= */
// export const deleteAppointmentLetter = async (req, res) => {
//   try {
//     const deleted = await AppointmentLetter.findByIdAndDelete(
//       req.params.id
//     );

//     if (!deleted) {
//       return res.status(404).json({
//         success: false,
//         message: "Appointment letter not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Appointment letter deleted successfully",
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };









import AppointmentLetter from "../documentModel/AppointmentLetter.js";

/* ================= CREATE ================= */
export const createAppointmentLetter = async (req, res) => {
  try {
    const body = req.body;

    if (!body || Object.keys(body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body is missing",
      });
    }

    const requiredFields = [
      "title",
      "company",
      "issuedTo",
      "employeeName",
      "employeeId",
      "address",
      "position",
      "joiningDate",
      "probationPeriod",
      "salary",
      "workLocation",
      "reportingManager",
      "appointmentType",
      "issueDate",
    ];

    const missingFields = requiredFields.filter(
      (field) => !body[field]
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    const exists = await AppointmentLetter.findOne({
      employeeId: body.employeeId,
    });

    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Appointment letter already exists for this employee",
      });
    }

    // ✅ CREATE DOCUMENT NUMBER
    const letter = await AppointmentLetter.create({
      ...body,
      documentNumber: `AL-${Date.now()}`, // 🔥 UNIQUE
    });

    res.status(201).json({
      success: true,
      message: "Appointment letter created successfully",
      data: letter,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* ================= READ ALL ================= */
export const getAllAppointmentLetters = async (req, res) => {
  try {
    const letters = await AppointmentLetter.find()
      .populate("company")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: letters.length,
      data: letters,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= READ ONE ================= */
export const getAppointmentLetterById = async (req, res) => {
  try {
    const letter = await AppointmentLetter.findById(req.params.id).populate(
      "company"
    );

    if (!letter) {
      return res.status(404).json({
        success: false,
        message: "Appointment letter not found",
      });
    }

    res.status(200).json({
      success: true,
      data: letter,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid appointment letter ID",
    });
  }
};

/* ================= UPDATE ================= */
export const updateAppointmentLetter = async (req, res) => {
  try {
    const updated = await AppointmentLetter.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Appointment letter not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment letter updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= DELETE ================= */
export const deleteAppointmentLetter = async (req, res) => {
  try {
    const deleted = await AppointmentLetter.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Appointment letter not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment letter deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};