import FullAndFinalLetter from "../documentModel/FullAndFinalLetter.js";
import { getOrCreateEmployeeId } from "../../../serviceController/getOrCreateEmployeeId.js";
import AppError from "../../../utlis/apiError.js";
import sendResponse from "../../../utlis/apiResponse.js";

/* ================= CREATE ================= */

export const createFullAndFinalLetter = async (req, res, next) => {
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
      fnfDate,
      month,
      totalSalary,
      doj,
      resignationDate,
      leavingDate,
      paidDays,
      finalType,
      workdays,
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
      !fnfDate ||
      !month ||
      !totalSalary ||
      !doj ||
      !resignationDate ||
      !leavingDate ||
      !paidDays ||
      !finalType ||
      !workdays
    ) {
      throw new AppError("Please fill all required fields", 400);
    }

    /* ===== CHECK DUPLICATE ===== */

    const existing = await FullAndFinalLetter.findOne({
      company,
      employeeId,
      leavingDate,
    });

    if (existing) {
      throw new AppError(
        "Full & Final already exists for this employee with this leaving date",
        409,
      );
    }

    /* ===== GENERATE DOCUMENT NUMBER ===== */

    body.documentNumber = `FNF-${employeeId}-${Date.now()}`;

    /* ===== CREATE DOCUMENT ===== */

    const newLetter = await FullAndFinalLetter.create(body);

    return sendResponse(
      res,
      201,
      "Full & Final Letter created successfully",
      newLetter,
    );
  } catch (error) {
    next(error);
  }
};

/* ================= GET ALL ================= */
export const getAllFullAndFinalLetters = async (req, res, next) => {
  try {
    const letters = await FullAndFinalLetter.find().sort({ createdAt: -1 });

    return sendResponse(res, 200, "Full & Final letters fetched successfully", {
      count: letters.length,
      letters,
    });
  } catch (error) {
    next(error);
  }
};
/* ================= GET BY ID ================= */
export const getFullAndFinalLetterById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const letter = await FullAndFinalLetter.findById(id);

    if (!letter) {
      throw new AppError("Full & Final Letter not found", 404);
    }

    return sendResponse(res, 200, "Full & Final letter fetched", letter);
  } catch (error) {
    next(error);
  }
};
/* ================= UPDATE ================= */
export const updateFullAndFinalLetter = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedLetter = await FullAndFinalLetter.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!updatedLetter) {
      throw new AppError("Full & Final Letter not found", 404);
    }

    return sendResponse(
      res,
      200,
      "Full & Final Letter updated successfully",
      updatedLetter,
    );
  } catch (error) {
    next(error);
  }
};

/* ================= DELETE ================= */
export const deleteFullAndFinalLetter = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedLetter = await FullAndFinalLetter.findByIdAndDelete(id);

    if (!deletedLetter) {
      throw new AppError("Full & Final Letter not found", 404);
    }

    return sendResponse(res, 200, "Full & Final Letter deleted successfully");
  } catch (error) {
    next(error);
  }
};
