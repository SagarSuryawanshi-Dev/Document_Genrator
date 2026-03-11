
// import ConfirmationLetter from "../documentModel/ConfirmationLetter.js";

// /* ================= CREATE ================= */
// export const createConfirmationLetter = async (req, res) => {
//   try {
//     const body = req.body;

//     /* BODY CHECK */
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
//       effectiveDate,
//       issueDate,
//       totalSalary,
//       position,
//       department,
//       address,
//       confirmationType,
//     } = body;

//     /* REQUIRED FIELD VALIDATION */
//     if (
//       !company ||
//       !issuedTo ||
//       !mrms ||
//       !employeeName ||
//       !employeeId ||
//       !effectiveDate ||
//       !issueDate ||
//       !totalSalary ||
//       !position ||
//       !confirmationType
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Please fill all required fields",
//       });
//     }

//     /* CHECK DUPLICATE */
//     const existing = await ConfirmationLetter.findOne({
//       company,
//       employeeId,
//       effectiveDate,
//     });

//     if (existing) {
//       return res.status(409).json({
//         success: false,
//         message:
//           "Confirmation letter already exists for this employee on this effective date",
//       });
//     }

//     /* GENERATE DOCUMENT NUMBER */
//     body.documentNumber = `CONF-${employeeId}-${Date.now()}`;

//     /* CREATE LETTER */
//     const newLetter = await ConfirmationLetter.create(body);

//     res.status(201).json({
//       success: true,
//       message: "Confirmation Letter created successfully",
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
// export const getAllConfirmationLetters = async (req, res) => {
//   try {
//     const letters = await ConfirmationLetter.find().sort({ createdAt: -1 });

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
// export const getConfirmationLetterById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const letter = await ConfirmationLetter.findById(id);

//     if (!letter) {
//       return res.status(404).json({
//         success: false,
//         message: "Confirmation Letter not found",
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
// export const updateConfirmationLetter = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const updatedLetter = await ConfirmationLetter.findByIdAndUpdate(
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
//         message: "Confirmation Letter not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Confirmation Letter updated successfully",
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
// export const deleteConfirmationLetter = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const deletedLetter = await ConfirmationLetter.findByIdAndDelete(id);

//     if (!deletedLetter) {
//       return res.status(404).json({
//         success: false,
//         message: "Confirmation Letter not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Confirmation Letter deleted successfully",
//     });
//   } catch (error) {
//     console.error("DELETE ERROR:", error);

//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// };






import ConfirmationLetter from "../documentModel/ConfirmationLetter.js";
import AppError from "../../../utlis/apiError.js";
import sendResponse from "../../../utlis/apiResponse.js";
import { generateEmployeeId } from "../../../utlis/generateEmployeedId.js";

/* ================= CREATE ================= */
export const createConfirmationLetter = async (req, res) => {
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
      "position",
      "department",
      "effectiveDate",
      "totalSalary",
      "confirmationType",
      "issueDate",
      "address"
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

    const employeeId = await generateEmployeeId(body.company);

    const exists = await ConfirmationLetter.findOne({
      employeeId: employeeId,
    });

    if (exists) {
      throw new AppError(
        "Confirmation letter already exists for this employee",
        409
      );
    }

    /* CREATE DOCUMENT */
    const letter = await ConfirmationLetter.create({
      ...body,
      employeeId: employeeId,
      documentNumber: `CONF-${Date.now()}`
    });

    console.log("confirmation letter", letter);

    sendResponse(
      res,
      201,
      "Confirmation letter created successfully",
      letter
    );

  } catch (err) {
    throw new AppError(err.message, 409);
  }
};


/* ================= READ ALL ================= */
export const getAllConfirmationLetters = async (req, res) => {
  try {

    const letters = await ConfirmationLetter.find()
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
export const getConfirmationLetterById = async (req, res) => {
  try {

    const letter = await ConfirmationLetter.findById(req.params.id)
      .populate("company");

    if (!letter) {
      return res.status(404).json({
        success: false,
        message: "Confirmation letter not found",
      });
    }

    res.status(200).json({
      success: true,
      data: letter,
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: "Invalid confirmation letter ID",
    });

  }
};


/* ================= UPDATE ================= */
export const updateConfirmationLetter = async (req, res) => {
  try {

    const updated = await ConfirmationLetter.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Confirmation letter not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Confirmation letter updated successfully",
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
export const deleteConfirmationLetter = async (req, res) => {
  try {

    const deleted = await ConfirmationLetter.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Confirmation letter not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Confirmation letter deleted successfully",
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};