import OfferLetter from "../documentModel/OfferLetter.js";
import { getOrCreateEmployeeId } from "../../../serviceController/getOrCreateEmployeeId.js";
import { getOrCreateEmployeeNumber } from "../../../serviceController/getOrCreateEmployeeNumber.js";
import AppError from "../../../utlis/apiError.js";
import sendResponse from "../../../utlis/apiResponse.js";

/* ================= CREATE ================= */
export const createOfferLetter = async (req, res, next) => {
  try {
    const body = req.body;
    if (!body || Object.keys(body).length === 0)
      throw new AppError("Request body is missing", 400);

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
      salary,
      location,
      offerValidTill,
      offerType,
      issueDate,
    } = body;

    if (
      [
        company,
        issuedTo,
        title,
        employeeName,
        email,
        position,
        department,
        employmentType,
        joiningDate,
        salary,
        location,
        offerValidTill,
        offerType,
        issueDate,
      ].some((f) => !f)
    ) {
      throw new AppError("Please fill all required fields", 400);
    }

    body.employeeId = await getOrCreateEmployeeId(email, company);
    body.employeeEmail = email;
    body.employeeNumber = await getOrCreateEmployeeNumber(body.employeeId);
    body.documentNumber = `OL-${body.employeeId}-${Date.now()}`;

    const letter = await OfferLetter.create(body);

    console.log("EMAIL:", email);
    console.log("EMPLOYEE ID GENERATED:", body.employeeId); 
    console.log("Fields received:", {
      company,
      issuedTo,
      title,
      employeeName,
      email,
      position,
      department,
      employmentType,
      joiningDate,
      salary,
      location,
      offerValidTill,
      offerType,
      issueDate,
    });

    return sendResponse(res, 201, "Offer letter created successfully", letter);
  } catch (error) {
    // Explicitly handle MongoDB duplicate key error
    if (error.code === 11000) {
      return sendResponse(
        res,
        409,
        `Offer letter already exists for this combination: ${JSON.stringify(
          error.keyValue
        )}`
      );
    }

    console.error("❌ BACKEND ERROR:", error);
    next(error); // Other errors
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
