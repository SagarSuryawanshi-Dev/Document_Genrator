import InternshipCertificate from "../documentModel/InternshipCertificate.js";
import { getOrCreateEmployeeId } from "../../../serviceController/getOrCreateEmployeeId.js";
import AppError from "../../../utlis/apiError.js";
import sendResponse from "../../../utlis/apiResponse.js";

/* ================ CREATE ================ */

export const createInternshipCertificate = async (req, res, next) => {
  try {
    const body = req.body;

    // ✅ Auth check
    if (!req.user) {
      throw new AppError("User not authenticated", 401);
    }

    const issuedBy = req.user._id;

    // ✅ Body check
    if (!body || Object.keys(body).length === 0) {
      throw new AppError("Request body is missing", 400);
    }

    // ✅ Destructure (use consistent naming)
    const {
      company,
      issuedTo,
      title,
      employeeName,
      employeeNumber,
      employeeEmail, // FIX: use consistent field
      designation,
      address,
      internshipType,
      stipend,
      startDate,
      endDate,
      issueDate,
    } = body;

    // ✅ Required fields (clean validation)
    const requiredFields = [
      "company",
      "issuedTo",
      "title",
      "employeeName",
      "employeeNumber",
      "employeeEmail",
      "designation",
      "internshipType",
      "startDate",
      "endDate",
      "issueDate",
    ];

    const missingFields = requiredFields.filter((field) => {
      const value = body[field];

      return (
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "")
      );
    });

    if (missingFields.length > 0) {
      throw new AppError(
        `Missing required fields: ${missingFields.join(", ")}`,
        400
      );
    }

    // ✅ Normalize company
    const cleanCompany = company.trim();

    // ✅ Generate employeeId
    const employeeId = await getOrCreateEmployeeId(
      employeeEmail,
      cleanCompany
    );

    // ✅ Duplicate check
    const existing = await InternshipCertificate.findOne({
      employeeEmail,
      company: cleanCompany,
      startDate,
      endDate,
    });

    if (existing) {
      throw new AppError(
        "Internship certificate already exists for this employee",
        409
      );
    }

    // ✅ Generate document number
    const documentNumber = `INT-${employeeId}-${Date.now()}`;

    // ✅ Create document (explicit fields only)
    const certificate = await InternshipCertificate.create({
      company: cleanCompany,
      issuedTo,
      title,
      employeeName,
      employeeNumber,
      employeeEmail,
      designation,
      address,
      internshipType,
      stipend,
      startDate,
      endDate,
      issueDate,
      issuedBy,
      employeeId,
      documentNumber,
    });

    // ✅ Populate issuedBy name
    const populatedCertificate = await InternshipCertificate.findById(
      certificate._id
    ).populate("issuedBy", "name");

    // ✅ Clean response
    const finalResponse = {
      ...populatedCertificate.toObject(),
      issuedBy: populatedCertificate.issuedBy.name,
    };

    return sendResponse(
      res,
      201,
      "Internship Certificate created successfully",
      finalResponse
    );

  } catch (error) {
    next(error);
  }
};
/* ================= GET ALL ================= */

export const getAllInternshipCertificates = async (req, res, next) => {
  try {
    const certificates = await InternshipCertificate.find().sort({
      createdAt: -1,
    });

    return sendResponse(
      res,
      200,
      "Internship certificates fetched successfully",
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

export const getInternshipCertificateById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const certificate = await InternshipCertificate.findById(id);

    if (!certificate) {
      throw new AppError("Internship certificate not found", 404);
    }

    return sendResponse(
      res,
      200,
      "Internship certificate fetched",
      certificate,
    );
  } catch (error) {
    next(error);
  }
};

/* ================= UPDATE ================= */

export const updateInternshipCertificate = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updated = await InternshipCertificate.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!updated) {
      throw new AppError("Internship certificate not found", 404);
    }

    return sendResponse(
      res,
      200,
      "Internship certificate updated successfully",
      updated,
    );
  } catch (error) {
    next(error);
  }
};

/* ================= DELETE ================= */

export const deleteInternshipCertificate = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await InternshipCertificate.findByIdAndDelete(id);

    if (!deleted) {
      throw new AppError("Internship certificate not found", 404);
    }

    return sendResponse(
      res,
      200,
      "Internship certificate deleted successfully",
    );
  } catch (error) {
    next(error);
  }
};
