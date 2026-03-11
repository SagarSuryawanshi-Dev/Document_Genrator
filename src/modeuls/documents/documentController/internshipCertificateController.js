// import InternshipCertificate from "../models/InternshipCertificate.js";

// /* ================= CREATE ================= */

// export const createInternshipCertificate = async (req, res) => {
//   try {
//     const data = req.body;

//     const {
//       mrms,
//       employeeName,
//       employeeId,
//       designation,
//       internshipType,
//       startDate,
//       endDate,
//       issueDate,
//       company,
//     } = data;

//     if (
//       !mrms ||
//       !employeeName ||
//       !employeeId ||
//       !designation ||
//       !internshipType ||
//       !startDate ||
//       !endDate ||
//       !issueDate ||
//       !company
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Required fields are missing",
//       });
//     }

//     /* prevent duplicate */
//     const existing = await InternshipCertificate.findOne({
//       company,
//       employeeId,
//       startDate,
//       endDate,
//     });

//     if (existing) {
//       return res.status(409).json({
//         success: false,
//         message: "Internship certificate already exists for this employee",
//       });
//     }

//     /* attach logged-in user if available */
//     if (req.user) {
//       data.createdBy = req.user.id;
//     }

//     const certificate = await InternshipCertificate.create(data);

//     res.status(201).json({
//       success: true,
//       message: "Internship Certificate created successfully",
//       data: certificate,
//     });
//   } catch (error) {
//     console.error("CREATE ERROR:", error);

//     if (error.code === 11000) {
//       return res.status(400).json({
//         success: false,
//         message: "Duplicate internship certificate detected",
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

// /* ================= GET ALL ================= */

// export const getAllInternshipCertificates = async (req, res) => {
//   try {
//     const certificates = await InternshipCertificate.find()
//       .populate("createdBy", "name email")
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
//       message: "Server error",
//     });
//   }
// };

// /* ================= GET BY ID ================= */

// export const getInternshipCertificateById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const certificate = await InternshipCertificate.findById(id).populate(
//       "createdBy",
//       "name email"
//     );

//     if (!certificate) {
//       return res.status(404).json({
//         success: false,
//         message: "Internship certificate not found",
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
//       message: "Server error",
//     });
//   }
// };

// /* ================= UPDATE ================= */

// export const updateInternshipCertificate = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const updated = await InternshipCertificate.findByIdAndUpdate(
//       id,
//       req.body,
//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//     if (!updated) {
//       return res.status(404).json({
//         success: false,
//         message: "Internship certificate not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Internship certificate updated successfully",
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

// export const deleteInternshipCertificate = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const deleted = await InternshipCertificate.findByIdAndDelete(id);

//     if (!deleted) {
//       return res.status(404).json({
//         success: false,
//         message: "Internship certificate not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Internship certificate deleted successfully",
//     });
//   } catch (error) {
//     console.error("DELETE ERROR:", error);

//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };








import InternshipCertificate from "../documentModel/InternshipCertificate.js";
import AppError from "../../../utlis/apiError.js";
import sendResponse from "../../../utlis/apiResponse.js";
import { generateEmployeeId } from "../../../utlis/generateEmployeedId.js";

/* ================= CREATE ================= */

export const createInternshipCertificate = async (req, res) => {
  console.log("Internship Certificate Controller hit");

  try {
    const body = req.body;

    /* BODY CHECK */
    if (!body || Object.keys(body).length === 0) {
      throw new AppError("Request body is missing", 400);
    }

    /* REQUIRED FIELDS */
    const requiredFields = [
      "title",
      "company",
      "issuedTo",
      "mrms",
      "employeeName",
      "designation",
      "internshipType",
      "startDate",
      "endDate",
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

    /* DUPLICATE CHECK */
    const exists = await InternshipCertificate.findOne({
      company: body.company,
      employeeId: employeeId,
      startDate: body.startDate,
      endDate: body.endDate,
    });

    if (exists) {
      throw new AppError(
        "Internship certificate already exists for this employee",
        409
      );
    }

    /* CREATE DOCUMENT */
    const certificate = await InternshipCertificate.create({
      ...body,
      employeeId: employeeId,
      documentNumber: `IC-${Date.now()}`
    });

    console.log("Internship Certificate created:", certificate);

    sendResponse(
      res,
      201,
      "Internship certificate created successfully",
      certificate
    );

  } catch (error) {
    throw new AppError(error.message, error.statusCode || 500);
  }
};


/* ================= GET ALL ================= */

export const getAllInternshipCertificates = async (req, res) => {
  try {

    const certificates = await InternshipCertificate.find()
      .populate("company")
      .sort({ createdAt: -1 });

    sendResponse(
      res,
      200,
      "Internship certificates fetched successfully",
      certificates
    );

  } catch (error) {
    throw new AppError(error.message, 500);
  }
};


/* ================= GET BY ID ================= */

export const getInternshipCertificateById = async (req, res) => {
  try {

    const certificate = await InternshipCertificate.findById(req.params.id)
      .populate("company");

    if (!certificate) {
      throw new AppError("Internship certificate not found", 404);
    }

    sendResponse(
      res,
      200,
      "Internship certificate fetched successfully",
      certificate
    );

  } catch (error) {
    throw new AppError("Invalid internship certificate ID", 400);
  }
};


/* ================= UPDATE ================= */

export const updateInternshipCertificate = async (req, res) => {
  try {

    const updated = await InternshipCertificate.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updated) {
      throw new AppError("Internship certificate not found", 404);
    }

    sendResponse(
      res,
      200,
      "Internship certificate updated successfully",
      updated
    );

  } catch (error) {
    throw new AppError(error.message, 400);
  }
};


/* ================= DELETE ================= */

export const deleteInternshipCertificate = async (req, res) => {
  try {

    const deleted = await InternshipCertificate.findByIdAndDelete(req.params.id);

    if (!deleted) {
      throw new AppError("Internship certificate not found", 404);
    }

    sendResponse(
      res,
      200,
      "Internship certificate deleted successfully",
      null
    );

  } catch (error) {
    throw new AppError(error.message, 400);
  }
};