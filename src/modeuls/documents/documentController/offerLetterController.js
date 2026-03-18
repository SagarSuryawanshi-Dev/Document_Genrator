import OfferLetter from "../documentModel/OfferLetter.js";
import { getOrCreateEmployeeId } from "../../../serviceController/getOrCreateEmployeeId.js";
import AppError from "../../../utlis/apiError.js";
import sendResponse from "../../../utlis/apiResponse.js";

/* ================= CREATE ================= */

export const createOfferLetter = async (req, res, next) => {
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
      position,
      department,
      employmentType,
      joiningDate,
      probationPeriod,
      salary,
      location,
      workHours,
      reportingManager,
      offerValidTill,
      offerType,
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
      !position ||
      !department ||
      !employmentType ||
      !joiningDate ||
      !salary ||
      !location ||
      !offerValidTill ||
      !offerType ||
      !issueDate
    ) {
      throw new AppError("Please fill all required fields", 400);
    }

    /* ===== DUPLICATE CHECK ===== */
    const exists = await OfferLetter.findOne({
      company,
      employeeId,
      joiningDate,
    });

    if (exists) {
      throw new AppError(
        "Offer letter already exists for this candidate and joining date",
        409,
      );
    }

    /* ===== DOCUMENT NUMBER ===== */
    body.documentNumber = `OL-${employeeId}-${Date.now()}`;

    /* ===== CREATE ===== */
    const letter = await OfferLetter.create(body);

    return sendResponse(res, 201, "Offer letter created successfully", letter);
  } catch (error) {
    next(error);
  }
};
/* ================= READ ALL ================= */
export const getAllOfferLetters = async (req, res, next) => {
  try {
    const letters = await OfferLetter.find().sort({ createdAt: -1 });

    return sendResponse(res, 200, "Offer letters fetched successfully", {
      count: letters.length,
      letters,
    });
  } catch (error) {
    next(error);
  }
};
/* ================= READ ONE ================= */
export const getOfferLetterById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const letter = await OfferLetter.findById(id);

    if (!letter) {
      throw new AppError("Offer letter not found", 404);
    }

    return sendResponse(res, 200, "Offer letter fetched", letter);
  } catch (error) {
    next(error);
  }
};
/* ================= UPDATE ================= */
export const updateOfferLetter = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updated = await OfferLetter.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      throw new AppError("Offer letter not found", 404);
    }

    return sendResponse(res, 200, "Offer letter updated successfully", updated);
  } catch (error) {
    next(error);
  }
};

/* ================= DELETE ================= */
export const deleteOfferLetter = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await OfferLetter.findByIdAndDelete(id);

    if (!deleted) {
      throw new AppError("Offer letter not found", 404);
    }

    return sendResponse(res, 200, "Offer letter deleted successfully");
  } catch (error) {
    next(error);
  }
};
