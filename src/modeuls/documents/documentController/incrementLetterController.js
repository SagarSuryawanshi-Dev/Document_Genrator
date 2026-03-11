// import IncrementLetter from "../documentModel/IncrementLetter.js";

// /* ================= CREATE ================= */

// export const createIncrementLetter = async (req, res) => {
//   try {
//     const data = req.body;

//     const {
//       mrms,
//       employeeName,
//       employeeId,
//       designation,
//       newCTC,
//       effectiveDate,
//       incrementType,
//       issueDate,
//       performanceYear,
//       company,
//     } = data;

//     if (
//       !mrms ||
//       !employeeName ||
//       !employeeId ||
//       !designation ||
//       !newCTC ||
//       !effectiveDate ||
//       !incrementType ||
//       !issueDate ||
//       !performanceYear ||
//       !company
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Required fields are missing",
//       });
//     }

//     /* check duplicate increment */
//     const existing = await IncrementLetter.findOne({
//       company,
//       employeeId,
//       effectiveDate,
//     });

//     if (existing) {
//       return res.status(409).json({
//         success: false,
//         message: "Increment already issued for this employee on this date",
//       });
//     }

//     /* attach logged in user */
//     if (req.user) {
//       data.createdBy = req.user.id;
//     }

//     /* generate document number */
//     const count = await IncrementLetter.countDocuments();

//     data.documentNumber = `INC-${new Date().getFullYear()}-${String(
//       count + 1
//     ).padStart(4, "0")}`;

//     const letter = await IncrementLetter.create(data);

//     res.status(201).json({
//       success: true,
//       message: "Increment Letter created successfully",
//       data: letter,
//     });
//   } catch (error) {
//     console.error("CREATE INCREMENT LETTER ERROR:", error);

//     if (error.code === 11000) {
//       return res.status(400).json({
//         success: false,
//         message: "Duplicate increment detected",
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

// /* ================= GET ALL ================= */

// export const getAllIncrementLetters = async (req, res) => {
//   try {
//     const letters = await IncrementLetter.find()
//       .populate("createdBy", "name email")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       count: letters.length,
//       data: letters,
//     });
//   } catch (error) {
//     console.error("GET ALL ERROR:", error);

//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

// /* ================= GET BY ID ================= */

// export const getIncrementLetterById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const letter = await IncrementLetter.findById(id).populate(
//       "createdBy",
//       "name email"
//     );

//     if (!letter) {
//       return res.status(404).json({
//         success: false,
//         message: "Increment letter not found",
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
//       message: "Server error",
//     });
//   }
// };

// /* ================= UPDATE ================= */

// export const updateIncrementLetter = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const updated = await IncrementLetter.findByIdAndUpdate(id, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     if (!updated) {
//       return res.status(404).json({
//         success: false,
//         message: "Increment letter not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Increment letter updated successfully",
//       data: updated,
//     });
//   } catch (error) {
//     console.error("UPDATE ERROR:", error);

//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

// /* ================= DELETE ================= */

// export const deleteIncrementLetter = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const deleted = await IncrementLetter.findByIdAndDelete(id);

//     if (!deleted) {
//       return res.status(404).json({
//         success: false,
//         message: "Increment letter not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Increment letter deleted successfully",
//     });
//   } catch (error) {
//     console.error("DELETE ERROR:", error);

//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };






import IncrementLetter from "../documentModel/IncrementLetter.js";
import AppError from "../../../utlis/apiError.js";
import sendResponse from "../../../utlis/apiResponse.js";
import { generateEmployeeId } from "../../../utlis/generateEmployeedId.js";

/* ================= CREATE ================= */

export const createIncrementLetter = async (req, res) => {
  console.log("Increment Controller hit");

  try {
    const body = req.body;

    /* BODY CHECK */
    if (!body || Object.keys(body).length === 0) {
      throw new AppError("Request body is Missing", 400);
    }

    /* REQUIRED FIELDS */
    const requiredFields = [
      "title",
      "company",
      "issuedTo",
      "employeeName",
      "designation",
      "performanceYear",
      "newCTC",
      "effectiveDate",
      "incrementType",
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

    /* GENERATE EMPLOYEE ID (same as appointment) */
    const employeeId = await generateEmployeeId(body.company);

    /* DUPLICATE CHECK */
    const exists = await IncrementLetter.findOne({
      company: body.company,
      employeeId: employeeId,
      effectiveDate: body.effectiveDate,
    });

    if (exists) {
      throw new AppError(
        "Increment already issued for this employee",
        409
      );
    }

    /* CREATE DOCUMENT */
    const letter = await IncrementLetter.create({
      ...body,
      employeeId: employeeId,
      documentNumber: `INC-${Date.now()}`
    });

    console.log("Increment letter", letter);

    sendResponse(
      res,
      201,
      "Increment letter created successfully",
      letter
    );

  } catch (err) {
    throw new AppError(err.message, 409);
  }
};


/* ================= READ ALL ================= */

export const getAllIncrementLetters = async (req, res) => {
  try {

    const letters = await IncrementLetter.find()
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

export const getIncrementLetterById = async (req, res) => {
  try {

    const letter = await IncrementLetter.findById(req.params.id)
      .populate("company");

    if (!letter) {
      return res.status(404).json({
        success: false,
        message: "Increment letter not found",
      });
    }

    res.status(200).json({
      success: true,
      data: letter,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid increment letter ID",
    });
  }
};


/* ================= UPDATE ================= */

export const updateIncrementLetter = async (req, res) => {
  try {

    const updated = await IncrementLetter.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Increment letter not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Increment letter updated successfully",
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

export const deleteIncrementLetter = async (req, res) => {
  try {

    const deleted = await IncrementLetter.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Increment letter not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Increment letter deleted successfully",
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};