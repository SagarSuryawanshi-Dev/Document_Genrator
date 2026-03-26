

import CompletionCertificate from "../documentModel/CompletionCertificate.js";
import { getOrCreateEmployeeId } from "../../../serviceController/getOrCreateEmployeeId.js";
import AppError from "../../../utlis/apiError.js";
import sendResponse from "../../../utlis/apiResponse.js";

/* ================= CREATE ================= */

export const createCompletionCertificate = async (req, res, next) => {
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

    // ✅ Destructure
    const {
      company,
      issuedTo,
      title,
      employeeName,
      employeeEmail,
      employeeNumber,
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

    // ✅ Required fields
    const requiredFields = [
      "company",
      "issuedTo",
      "title",
      "employeeName",
      "employeeEmail",
      "employeeNumber",
      "projectName",
      "startDate",
      "completionDate",
      "designation",
      "department",
      "roleinProject",
      "technologies",
      "issueDate",
    ];

    const missingFields = requiredFields.filter((field) => {
      const value = body[field];

      return (
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "") ||
        (Array.isArray(value) && value.length === 0)
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
    const existingCertificate = await CompletionCertificate.findOne({
      employeeEmail,
      company: cleanCompany,
      projectName,
    });

    if (existingCertificate) {
      throw new AppError(
        "Completion certificate already exists for this employee",
        409
      );
    }

    // ✅ Generate document number
    const documentNumber = `COM-${employeeId}-${Date.now()}`;

    // ✅ Create document
    const certificate = await CompletionCertificate.create({
      company: cleanCompany,
      issuedTo,
      title,
      employeeName,
      employeeEmail,
      employeeNumber,
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
      issuedBy,
      employeeId,
      documentNumber,
    });

    // ✅ Populate issuedBy name
    const populatedCertificate = await CompletionCertificate.findById(
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
      "Completion Certificate created successfully",
      finalResponse
    );

  } catch (error) {
    console.error("🔥 COMPLETION ERROR:", error);
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
