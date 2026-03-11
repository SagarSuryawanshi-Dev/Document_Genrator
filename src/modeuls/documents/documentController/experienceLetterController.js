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
import AppError from "../../../utlis/apiError.js";
import sendResponse from "../../../utlis/apiResponse.js";
import { generateEmployeeId } from "../../../utlis/generateEmployeedId.js";


/* ================= CREATE ================= */
export const createExperienceLetter = async (req, res) => {
  console.log("Controller hit");

  try {
    const body = req.body;

    if (!body || Object.keys(body).length === 0) {
      throw new AppError("Request body is Missing", 400);
    }

    const requiredFields = [
      "title",
      "company",
      "issuedTo",
      "mrms",
      "employeeName",
      "designation",
      "joiningDate",
      "relievingDate",
      "issueDate"
    ];

    const missingFields = requiredFields.filter(
      (field) => body[field] === undefined
    );

    if (missingFields.length > 0) {
      throw new AppError(
        `Missing required fields: ${missingFields.join(", ")}`,
        400
      );
    }

    /* GENERATE EMPLOYEE ID */
    const employeeId = await generateEmployeeId(body.company);

    /* CHECK DUPLICATE */
    const exists = await ExperienceLetter.findOne({
      employeeId: employeeId,
      relievingDate: body.relievingDate
    });

    if (exists) {
      throw new AppError(
        "Experience letter already exists for this employee",
        409
      );
    }

    /* CREATE DOCUMENT */
    const letter = await ExperienceLetter.create({
      ...body,
      employeeId: employeeId,
      documentNumber: `EXP-${Date.now()}`
    });

    console.log("Experience Letter", letter);

    sendResponse(
      res,
      201,
      "Experience letter created successfully",
      letter
    );

  } catch (err) {
    throw new AppError(err.message, 409);
  }
};


/* ================= READ ALL ================= */
export const getAllExperienceLetters = async (req, res) => {
  try {

    const letters = await ExperienceLetter.find()
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
export const getExperienceLetterById = async (req, res) => {
  try {

    const letter = await ExperienceLetter.findById(req.params.id)
      .populate("company");

    if (!letter) {
      return res.status(404).json({
        success: false,
        message: "Experience letter not found",
      });
    }

    res.status(200).json({
      success: true,
      data: letter,
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: "Invalid experience letter ID",
    });

  }
};


/* ================= UPDATE ================= */
export const updateExperienceLetter = async (req, res) => {
  try {

    const updated = await ExperienceLetter.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Experience letter not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Experience letter updated successfully",
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
export const deleteExperienceLetter = async (req, res) => {
  try {

    const deleted = await ExperienceLetter.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Experience letter not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Experience letter deleted successfully",
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};