// import FullAndFinalLetter from "../documentModel/FullAndFinalLetter.js";

// /* ================= CREATE ================= */
// export const createFullAndFinalLetter = async (req, res) => {
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
//       employeeName,
//       employeeId,
//       designation,
//       fnfDate,
//       month,
//       totalSalary,
//       doj,
//       resignationDate,
//       leavingDate,
//       paidDays,
//       finalType,
//       workdays,
//     } = body;

//     /* ===== REQUIRED FIELD VALIDATION ===== */
//     if (
//       !company ||
//       !issuedTo ||
//       !employeeName ||
//       !employeeId ||
//       !designation ||
//       !fnfDate ||
//       !month ||
//       !totalSalary ||
//       !doj ||
//       !resignationDate ||
//       !leavingDate ||
//       !paidDays ||
//       !finalType ||
//       !workdays
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Please fill all required fields",
//       });
//     }

//     /* ===== CHECK DUPLICATE ===== */
//     const existing = await FullAndFinalLetter.findOne({
//       company,
//       employeeId,
//       leavingDate,
//     });

//     if (existing) {
//       return res.status(409).json({
//         success: false,
//         message:
//           "Full & Final already exists for this employee with this leaving date",
//       });
//     }

//     /* ===== GENERATE DOCUMENT NUMBER ===== */
//     body.documentNumber = `FNF-${employeeId}-${Date.now()}`;

//     /* ===== CREATE DOCUMENT ===== */
//     const newLetter = await FullAndFinalLetter.create(body);

//     res.status(201).json({
//       success: true,
//       message: "Full & Final Letter created successfully",
//       data: newLetter,
//     });
//   } catch (error) {
//     console.error("CREATE ERROR:", error);

//     if (error.code === 11000) {
//       return res.status(400).json({
//         success: false,
//         message: "Duplicate document detected",
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//       error: error.message,
//     });
//   }
// };

// /* ================= GET ALL ================= */
// export const getAllFullAndFinalLetters = async (req, res) => {
//   try {
//     const letters = await FullAndFinalLetter.find().sort({ createdAt: -1 });

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
// export const getFullAndFinalLetterById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const letter = await FullAndFinalLetter.findById(id);

//     if (!letter) {
//       return res.status(404).json({
//         success: false,
//         message: "Full & Final Letter not found",
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
// export const updateFullAndFinalLetter = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const updatedLetter = await FullAndFinalLetter.findByIdAndUpdate(
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
//         message: "Full & Final Letter not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Full & Final Letter updated successfully",
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
// export const deleteFullAndFinalLetter = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const deletedLetter = await FullAndFinalLetter.findByIdAndDelete(id);

//     if (!deletedLetter) {
//       return res.status(404).json({
//         success: false,
//         message: "Full & Final Letter not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Full & Final Letter deleted successfully",
//     });
//   } catch (error) {
//     console.error("DELETE ERROR:", error);

//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// };





import FullAndFinalLetter from "../documentModel/FullAndFinalLetter.js";
import AppError from "../../../utlis/apiError.js";
import sendResponse from "../../../utlis/apiResponse.js";
import { generateEmployeeId } from "../../../utlis/generateEmployeedId.js";


/* ================= CREATE ================= */
export const createFullAndFinalLetter = async (req, res) => {
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
      "employeeName",
      "designation",
      "fnfDate",
      "month",
      "totalSalary",
      "doj",
      "resignationDate",
      "leavingDate",
      "paidDays",
      "finalType",
      "workdays"
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
    const exists = await FullAndFinalLetter.findOne({
      employeeId: employeeId,
      leavingDate: body.leavingDate
    });

    if (exists) {
      throw new AppError(
        "Full & Final letter already exists for this employee",
        409
      );
    }

    /* CREATE DOCUMENT */
    const letter = await FullAndFinalLetter.create({
      ...body,
      employeeId: employeeId,
      documentNumber: `FNF-${Date.now()}`
    });

    console.log("Full & Final Letter", letter);

    sendResponse(
      res,
      201,
      "Full & Final letter created successfully",
      letter
    );

  } catch (err) {
    throw new AppError(err.message, 409);
  }
};


/* ================= READ ALL ================= */
export const getAllFullAndFinalLetters = async (req, res) => {
  try {

    const letters = await FullAndFinalLetter.find()
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
export const getFullAndFinalLetterById = async (req, res) => {
  try {

    const letter = await FullAndFinalLetter.findById(req.params.id)
      .populate("company");

    if (!letter) {
      return res.status(404).json({
        success: false,
        message: "Full & Final letter not found",
      });
    }

    res.status(200).json({
      success: true,
      data: letter,
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: "Invalid Full & Final letter ID",
    });

  }
};


/* ================= UPDATE ================= */
export const updateFullAndFinalLetter = async (req, res) => {
  try {

    const updated = await FullAndFinalLetter.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Full & Final letter not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Full & Final letter updated successfully",
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
export const deleteFullAndFinalLetter = async (req, res) => {
  try {

    const deleted = await FullAndFinalLetter.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Full & Final letter not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Full & Final letter deleted successfully",
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};