import OfferLetter from "../documentModel/OfferLetter.js";
import { getOrCreateEmployeeId } from "../../../serviceController/getOrCreateEmployeeId.js";
import AppError from "../../../utlis/apiError.js";
import sendResponse from "../../../utlis/apiResponse.js";

/* ================= CREATE ================= */

export const createOfferLetter = async (req, res, next) => {
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

    // ✅ Destructure (consistent naming)
    const {
      company,
      issuedTo,
      title,
      employeeName,
      employeeNumber,
      employeeEmail, // FIX: use consistent field
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

    // ✅ Required fields
    const requiredFields = [
      "company",
      "issuedTo",
      "title",
      "employeeName",
      "employeeNumber",
      "employeeEmail",
      "position",
      "department",
      "employmentType",
      "joiningDate",
      "salary",
      "location",
      "offerValidTill",
      "offerType",
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
    const exists = await OfferLetter.findOne({
      employeeEmail,
      company: cleanCompany,
      joiningDate,
    });

    if (exists) {
      throw new AppError(
        "Offer letter already exists for this candidate and joining date",
        409
      );
    }

    // ✅ Generate document number
    const documentNumber = `OL-${employeeId}-${Date.now()}`;

    // ✅ Create document (explicit fields only)
    const letter = await OfferLetter.create({
      company: cleanCompany,
      issuedTo,
      title,
      employeeName,
      employeeNumber,
      employeeEmail,
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
      issuedBy,
      employeeId,
      documentNumber,
    });

    // ✅ Populate issuedBy name
    const populatedLetter = await OfferLetter.findById(letter._id)
      .populate("issuedBy", "name");

    // ✅ Clean response
    const finalResponse = {
      ...populatedLetter.toObject(),
      issuedBy: populatedLetter.issuedBy.name,
    };

    return sendResponse(
      res,
      201,
      "Offer letter created successfully",
      finalResponse
    );

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
/* ================ UPDATE ================ */
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