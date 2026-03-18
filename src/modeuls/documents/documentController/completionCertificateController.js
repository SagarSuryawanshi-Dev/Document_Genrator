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

    /* ===== DATE VALIDATION ===== */
    if (new Date(completionDate) < new Date(startDate)) {
      throw new AppError("Completion date cannot be before start date", 400);
    }

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
