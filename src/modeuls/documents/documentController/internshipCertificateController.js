<<<<<<< HEAD
import InternshipCertificate from "../../documents/documentModel/InternshipCertificate.js";
=======
import InternshipCertificate from "../documentModel/InternshipCertificate.js";
import { getOrCreateEmployeeId } from "../../../serviceController/getOrCreateEmployeeId.js";
import AppError from "../../../utlis/apiError.js";
import sendResponse from "../../../utlis/apiResponse.js";
>>>>>>> 3333359637d5c6501f4d08b6b33816ef3c7cdb5f

/* ================= CREATE ================= */

export const createInternshipCertificate = async (req, res, next) => {
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
      designation,
      address,
      internshipType,
      stipend,
      startDate,
      endDate,
      issueDate,
    } = body;

    /* ===== GENERATE OR FETCH EMPLOYEE ID ===== */
    const employeeId = await getOrCreateEmployeeId(email, company);
    body.employeeId = employeeId;

    /* ===== REQUIRED FIELD VALIDATION ===== */
    if (
      !company ||
      !issuedTo ||
      !title ||
      !employeeName ||
      !designation ||
      !internshipType ||
      !startDate ||
      !endDate ||
      !issueDate
    ) {
      throw new AppError("Please fill all required fields", 400);
    }

    /* ===== DUPLICATE CHECK ===== */
    const existing = await InternshipCertificate.findOne({
      company,
      employeeId,
      startDate,
      endDate,
    });

    if (existing) {
      throw new AppError(
        "Internship certificate already exists for this employee",
        409,
      );
    }

    /* ===== GENERATE DOCUMENT NUMBER ===== */
    body.documentNumber = `INT-${employeeId}-${Date.now()}`;

    /* ===== CREATE DOCUMENT ===== */
    const certificate = await InternshipCertificate.create(body);

    return sendResponse(
      res,
      201,
      "Internship Certificate created successfully",
      certificate,
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

<<<<<<< HEAD
    const certificate = await InternshipCertificate.findById(id).populate(
      "createdBy",
      "name email",
    );
=======
    const certificate = await InternshipCertificate.findById(id);
>>>>>>> 3333359637d5c6501f4d08b6b33816ef3c7cdb5f

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
<<<<<<< HEAD
      {
        new: true,
        runValidators: true,
      },
=======
      { new: true, runValidators: true },
>>>>>>> 3333359637d5c6501f4d08b6b33816ef3c7cdb5f
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
