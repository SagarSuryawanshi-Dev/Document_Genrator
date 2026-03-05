// import ExperienceLetter from "../documentModel/ExperienceLetter.js";

// /* ================= CREATE ================= */
// export const createExperienceLetter = async (req, res) => {
//   try {
//     const body = req.body;

//     if (!body || Object.keys(body).length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Request body is missing",
//       });
//     }

//     const {
//       company,
//       issuedTo,
//       mrms,
//       employeeName,
//       employeeId,
//       designation,
//       joiningDate,
//       relievingDate,
//       issueDate,
//     } = body;

//     /* ===== REQUIRED FIELD VALIDATION ===== */
//     if (
//       !company ||
//       !issuedTo ||
//       !mrms ||
//       !employeeName ||
//       !employeeId ||
//       !designation ||
//       !joiningDate ||
//       !relievingDate ||
//       !issueDate
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Please fill all required fields",
//       });
//     }

//     /* ===== CHECK DUPLICATE BEFORE INSERT ===== */
//     const existingLetter = await ExperienceLetter.findOne({
//       company,
//       employeeId,
//       relievingDate,
//     });

//     if (existingLetter) {
//       return res.status(409).json({
//         success: false,
//         message:
//           "Experience letter already exists for this employee with this relieving date",
//       });
//     }

//     /* ===== CREATE DOCUMENT ===== */
//     const newLetter = await ExperienceLetter.create(body);

//     res.status(201).json({
//       success: true,
//       message: "Experience Letter created successfully",
//       data: newLetter,
//     });
//   } catch (error) {
//     console.error("CREATE ERROR:", error);

//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//       error: error.message,
//     });
//   }
// };

// /* ================= GET ALL ================= */
// export const getAllExperienceLetters = async (req, res) => {
//   try {
//     const letters = await ExperienceLetter.find().sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       count: letters.length,
//       data: letters,
//     });
//   } catch (error) {
//     console.error("GET ALL ERROR:", error);

//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// };

// /* ================= GET BY ID ================= */
// export const getExperienceLetterById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const letter = await ExperienceLetter.findById(id);

//     if (!letter) {
//       return res.status(404).json({
//         success: false,
//         message: "Experience Letter not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: letter,
//     });
//   } catch (error) {
//     console.error("GET BY ID ERROR:", error);

//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// };

// /* ================= UPDATE ================= */
// export const updateExperienceLetter = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const updatedLetter = await ExperienceLetter.findByIdAndUpdate(
//       id,
//       req.body,
//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//     if (!updatedLetter) {
//       return res.status(404).json({
//         success: false,
//         message: "Experience Letter not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Experience Letter updated successfully",
//       data: updatedLetter,
//     });
//   } catch (error) {
//     console.error("UPDATE ERROR:", error);

//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// };

// /* ================= DELETE ================= */
// export const deleteExperienceLetter = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const deletedLetter = await ExperienceLetter.findByIdAndDelete(id);

//     if (!deletedLetter) {
//       return res.status(404).json({
//         success: false,
//         message: "Experience Letter not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Experience Letter deleted successfully",
//     });
//   } catch (error) {
//     console.error("DELETE ERROR:", error);

//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// };



import ExperienceLetter from "../documentModel/ExperienceLetter.js";

/* ================= CREATE ================= */
export const createExperienceLetter = async (req, res) => {
  try {
    const body = req.body;

    if (!body || Object.keys(body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body is missing",
      });
    }

    const {
      company,
      issuedTo,
      mrms,
      employeeName,
      employeeId,
      designation,
      joiningDate,
      relievingDate,
      issueDate,
    } = body;

    /* ===== REQUIRED FIELD VALIDATION ===== */
    if (
      !company ||
      !issuedTo ||
      !mrms ||
      !employeeName ||
      !employeeId ||
      !designation ||
      !joiningDate ||
      !relievingDate ||
      !issueDate
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    /* ===== CHECK DUPLICATE BEFORE INSERT ===== */
    const existingLetter = await ExperienceLetter.findOne({
      company,
      employeeId,
      relievingDate,
    });

    if (existingLetter) {
      return res.status(409).json({
        success: false,
        message:
          "Experience letter already exists for this employee with this relieving date",
      });
    }

    /* ===== GENERATE DOCUMENT NUMBER ===== */
    body.documentNumber = `EXP-${employeeId}-${Date.now()}`;

    /* ===== CREATE DOCUMENT ===== */
    const newLetter = await ExperienceLetter.create(body);

    res.status(201).json({
      success: true,
      message: "Experience Letter created successfully",
      data: newLetter,
    });

  } catch (error) {
    console.error("CREATE ERROR:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate document number detected",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

/* ================= GET ALL ================= */
export const getAllExperienceLetters = async (req, res) => {
  try {
    const letters = await ExperienceLetter.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: letters.length,
      data: letters,
    });

  } catch (error) {
    console.error("GET ALL ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ================= GET BY ID ================= */
export const getExperienceLetterById = async (req, res) => {
  try {
    const { id } = req.params;

    const letter = await ExperienceLetter.findById(id);

    if (!letter) {
      return res.status(404).json({
        success: false,
        message: "Experience Letter not found",
      });
    }

    res.status(200).json({
      success: true,
      data: letter,
    });

  } catch (error) {
    console.error("GET BY ID ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ================= UPDATE ================= */
export const updateExperienceLetter = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedLetter = await ExperienceLetter.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedLetter) {
      return res.status(404).json({
        success: false,
        message: "Experience Letter not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Experience Letter updated successfully",
      data: updatedLetter,
    });

  } catch (error) {
    console.error("UPDATE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ================= DELETE ================= */
export const deleteExperienceLetter = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedLetter = await ExperienceLetter.findByIdAndDelete(id);

    if (!deletedLetter) {
      return res.status(404).json({
        success: false,
        message: "Experience Letter not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Experience Letter deleted successfully",
    });

  } catch (error) {
    console.error("DELETE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};