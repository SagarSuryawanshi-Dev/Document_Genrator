import IncrementLetter from "../documentModel/IncrementLetter.js";
import { getOrCreateEmployeeId } from "../../../serviceController/getOrCreateEmployeeId.js";
import AppError from "../../../utlis/apiError.js";
import sendResponse from "../../../utlis/apiResponse.js";

/* ================= CREATE ================= */

export const createIncrementLetter = async (req, res, next) => {
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
      performanceYear,
      newCTC,
      incrementPercentage,
      effectiveDate,
      incrementType,
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
      !performanceYear ||
      !newCTC ||
      !effectiveDate ||
      !incrementType ||
      !issueDate
    ) {
      throw new AppError("Please fill all required fields", 400);
    }

    /* ===== DUPLICATE CHECK ===== */

    const existing = await IncrementLetter.findOne({
      company,
      employeeId,
      effectiveDate,
    });

    if (existing) {
      throw new AppError(
        "Increment already issued for this employee on this date",
        409,
      );
    }

    /* ===== GENERATE DOCUMENT NUMBER ===== */

    body.documentNumber = `INC-${employeeId}-${Date.now()}`;

    /* ===== CREATE DOCUMENT ===== */

    const letter = await IncrementLetter.create(body);

    return sendResponse(
      res,
      201,
      "Increment Letter created successfully",
      letter,
    );
  } catch (error) {
    next(error);
  }
};
/* ================= GET ALL ================= */

export const getAllIncrementLetters = async (req, res, next) => {
  try {
    const letters = await IncrementLetter.find().sort({ createdAt: -1 });

    return sendResponse(res, 200, "Increment letters fetched successfully", {
      count: letters.length,
      letters,
    });
  } catch (error) {
    next(error);
  }
};
/* ================= GET BY ID ================= */

export const getIncrementLetterById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const letter = await IncrementLetter.findById(id);

    if (!letter) {
      throw new AppError("Increment letter not found", 404);
    }

    return sendResponse(res, 200, "Increment letter fetched", letter);
  } catch (error) {
    next(error);
  }
};
/* ================= UPDATE ================= */

export const updateIncrementLetter = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updated = await IncrementLetter.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      throw new AppError("Increment letter not found", 404);
    }

    return sendResponse(
      res,
      200,
      "Increment letter updated successfully",
      updated,
    );
  } catch (error) {
    next(error);
  }
};
/* ================= DELETE ================= */
export const deleteIncrementLetter = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await IncrementLetter.findByIdAndDelete(id);

    if (!deleted) {
      throw new AppError("Increment letter not found", 404);
    }

    return sendResponse(res, 200, "Increment letter deleted successfully");
  } catch (error) {
    next(error);
  }
};
