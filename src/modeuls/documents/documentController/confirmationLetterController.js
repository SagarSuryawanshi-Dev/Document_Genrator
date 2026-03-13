import ConfirmationLetter from "../documentModel/ConfirmationLetter.js";
import { getOrCreateEmployeeId } from "../../../serviceController/getOrCreateEmployeeId.js";
import AppError from "../../../utlis/apiError.js";
import sendResponse from "../../../utlis/apiResponse.js";

/* ================= CREATE ================= */

export const createConfirmationLetter = async (req, res, next) => {
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
      effectiveDate,
      issueDate,
      totalSalary,
      position,
      department,
      confirmationType,
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
      !effectiveDate ||
      !issueDate ||
      !totalSalary ||
      !position ||
      !confirmationType
    ) {
      throw new AppError("Please fill all required fields", 400);
    }

    /* ===== DUPLICATE CHECK ===== */

    const existing = await ConfirmationLetter.findOne({
      company,
      employeeId,
      effectiveDate,
    });

    if (existing) {
      throw new AppError(
        "Confirmation letter already exists for this employee on this effective date",
        409,
      );
    }

    /* ===== GENERATE DOCUMENT NUMBER ===== */

    body.documentNumber = `CONF-${employeeId}-${Date.now()}`;

    /* ===== CREATE LETTER ===== */

    const newLetter = await ConfirmationLetter.create(body);

    return sendResponse(
      res,
      201,
      "Confirmation Letter created successfully",
      newLetter,
    );
  } catch (error) {
    next(error);
  }
};

/* ================= GET ALL ================= */
export const getAllConfirmationLetters = async (req, res, next) => {
  try {
    const letters = await ConfirmationLetter.find().sort({ createdAt: -1 });

    return sendResponse(res, 200, "Confirmation letters fetched successfully", {
      count: letters.length,
      letters,
    });
  } catch (error) {
    next(error);
  }
};
/* ================= GET BY ID ================= */
export const getConfirmationLetterById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const letter = await ConfirmationLetter.findById(id);

    if (!letter) {
      throw new AppError("Confirmation Letter not found", 404);
    }

    return sendResponse(res, 200, "Confirmation letter fetched", letter);
  } catch (error) {
    next(error);
  }
};
/* ================= UPDATE ================= */
export const updateConfirmationLetter = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedLetter = await ConfirmationLetter.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!updatedLetter) {
      throw new AppError("Confirmation Letter not found", 404);
    }

    return sendResponse(
      res,
      200,
      "Confirmation Letter updated successfully",
      updatedLetter,
    );
  } catch (error) {
    next(error);
  }
};

/* ================= DELETE ================= */
export const deleteConfirmationLetter = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedLetter = await ConfirmationLetter.findByIdAndDelete(id);

    if (!deletedLetter) {
      throw new AppError("Confirmation Letter not found", 404);
    }

    return sendResponse(res, 200, "Confirmation Letter deleted successfully");
  } catch (error) {
    next(error);
  }
};
