// import CompletionCertificate from "../documentModel/CompletionCertificate.js";
// import AppError from "../../../utlis/apiError.js";
// import { getOrCreateEmployeeId } from "../../../utlis/getOrCreateEmployeeId.js";

// export const createCompletionCertificate = async (req, res) => {
//   try {
//     const body = req.body;

//     if (!body || Object.keys(body).length === 0) {
//       throw new AppError("Request body is Missing", 400);
//     }

//     const {
//       company,
//       issuedTo,
//       title,
//       employeeName,
//       email,
//       projectName,
//       startDate,
//       completionDate,
//       designation,
//       department,
//       roleinProject,
//       technologies,
//       achievements,
//       clientName,
//       issueDate,
//     } = body;

//     /* ===== GENERATE OR FETCH EMPLOYEE ID ===== */
//     const employeeId = await getOrCreateEmployeeId(email, company);
//     body.employeeId = employeeId;

//     /* ===== REQUIRED FIELD CHECK ===== */
//     if (
//       !company ||
//       !issuedTo ||
//       !title ||
//       !employeeName ||
//       !employeeId ||
//       !projectName ||
//       !startDate ||
//       !completionDate ||
//       !designation ||
//       !department ||
//       !roleinProject ||
//       !issueDate
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Please fill all required fields",
//       });
//     }

//     /* ===== DUPLICATE CHECK ===== */
//     const existing = await CompletionCertificate.findOne({
//       company,

//       employeeId,
//       projectName,
//     });

//     if (existing) {
//       throw new AppError(
//         "Completion certificate already exists for this employee",
//         400,
//       );
//     }

//     /* ===== GENERATE DOCUMENT NUMBER ===== */
//     body.documentNumber = `COM-${employeeId}-${Date.now()}`;

//     const certificate = await CompletionCertificate.create(body);

//     res.status(201).json({
//       success: true,
//       message: "Completion Certificate created successfully",
//       data: certificate,
//     });
//   } catch (error) {
//     console.error("CREATE ERROR:", error);

//     if (error.code === 11000) {
//       throw new AppError(
//         "Completion certificate already exists for this employee",
//         400,
//       );
//     }

//     throw new AppError(error.message, 400);
//   }
// };

// export const getAllCompletionCertificates = async (req, res) => {
//   try {
//     const certificates = await CompletionCertificate.find()
//       .populate("employee")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       count: certificates.length,
//       data: certificates,
//     });
//   } catch (error) {
//     console.error("GET ALL ERROR:", error);

//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// };

// export const getCompletionCertificateById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const certificate =
//       await CompletionCertificate.findById(id).populate("employee");

//     if (!certificate) {
//       return res.status(404).json({
//         success: false,
//         message: "Completion Certificate not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: certificate,
//     });
//   } catch (error) {
//     console.error("GET BY ID ERROR:", error);

//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// };

// export const updateCompletionCertificate = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const updatedCertificate = await CompletionCertificate.findByIdAndUpdate(
//       id,
//       req.body,
//       {
//         new: true,
//         runValidators: true,
//       },
//     );

//     if (!updatedCertificate) {
//       return res.status(404).json({
//         success: false,
//         message: "Completion Certificate not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Completion Certificate updated successfully",
//       data: updatedCertificate,
//     });
//   } catch (error) {
//     console.error("UPDATE ERROR:", error);

//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//       error: error.message,
//     });
//   }
// };

// export const deleteCompletionCertificate = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const deletedCertificate =
//       await CompletionCertificate.findByIdAndDelete(id);

//     if (!deletedCertificate) {
//       return res.status(404).json({
//         success: false,
//         message: "Completion Certificate not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Completion Certificate deleted successfully",
//     });
//   } catch (error) {
//     console.error("DELETE ERROR:", error);

//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// };

import CompletionCertificate from "../documentModel/CompletionCertificate.js";
import { getOrCreateEmployeeId } from "../../../serviceController/getOrCreateEmployeeId.js";
import AppError from "../../../utlis/apiError.js";
import sendResponse from "../../../utlis/apiResponse.js";

/* ================= CREATE ================= */

export const createCompletionCertificate = async (req, res, next) => {
  try {
    const body = req.body;

    if (!body || Object.keys(body).length === 0) {
      throw new AppError("Request body is missing", 400);
    }

    const {
      company,
      issuedTo,
      title,
      employeeName,
      email,
      projectName,
      startDate,
      completionDate,
      designation,
      department,
      roleinProject,
      technologies,
      achievements,
      clientName,
      issueDate,
    } = body;

    /* ===== GENERATE EMPLOYEE ID ===== */
    const employeeId = await getOrCreateEmployeeId(email, company);
    body.employeeId = employeeId;

    /* ===== REQUIRED FIELD VALIDATION ===== */

    if (
      !company ||
      !issuedTo ||
      !title ||
      !employeeName ||
      !projectName ||
      !startDate ||
      !completionDate ||
      !designation ||
      !department ||
      !roleinProject ||
      !issueDate
    ) {
      throw new AppError("Please fill all required fields", 400);
    }

    /* ===== DUPLICATE CHECK ===== */

    const existingCertificate = await CompletionCertificate.findOne({
      company,
      employeeId,
      projectName,
    });

    if (existingCertificate) {
      throw new AppError(
        "Completion certificate already exists for this employee",
        409,
      );
    }

    /* ===== DOCUMENT NUMBER ===== */

    body.documentNumber = `COM-${employeeId}-${Date.now()}`;

    const certificate = await CompletionCertificate.create(body);

    return sendResponse(
      res,
      201,
      "Completion Certificate created successfully",
      certificate,
    );
  } catch (error) {
    next(error);
  }
};

/* ================= GET ALL ================= */

export const getAllCompletionCertificates = async (req, res, next) => {
  try {
    const certificates = await CompletionCertificate.find().sort({
      createdAt: -1,
    });

    return sendResponse(
      res,
      200,
      "Completion certificates fetched successfully",
      {
        count: certificates.length,
        certificates,
      },
    );
  } catch (error) {
    next(error);
  }
};

/* ================= GET BY ID ================= */

export const getCompletionCertificateById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const certificate = await CompletionCertificate.findById(id);

    if (!certificate) {
      throw new AppError("Completion Certificate not found", 404);
    }

    return sendResponse(
      res,
      200,
      "Completion certificate fetched",
      certificate,
    );
  } catch (error) {
    next(error);
  }
};

/* ================= UPDATE ================= */

export const updateCompletionCertificate = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedCertificate = await CompletionCertificate.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!updatedCertificate) {
      throw new AppError("Completion Certificate not found", 404);
    }

    return sendResponse(
      res,
      200,
      "Completion Certificate updated successfully",
      updatedCertificate,
    );
  } catch (error) {
    next(error);
  }
};

/* ================= DELETE ================= */

export const deleteCompletionCertificate = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedCertificate =
      await CompletionCertificate.findByIdAndDelete(id);

    if (!deletedCertificate) {
      throw new AppError("Completion Certificate not found", 404);
    }

    return sendResponse(
      res,
      200,
      "Completion Certificate deleted successfully",
    );
  } catch (error) {
    next(error);
  }
};
