import IncrementLetter from "../documentModel/IncrementLetter.js";
import { getOrCreateEmployeeId } from "../../../serviceController/getOrCreateEmployeeId.js";
import AppError from "../../../utlis/apiError.js";
import sendResponse from "../../../utlis/apiResponse.js";

/* ================= CREATE ================= */

export const createIncrementLetter = async (req, res, next) => {
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
      employeeNumber,
      employeeEmail, // FIX: use consistent naming
      designation,
      performanceYear,
      newCTC,
      incrementPercentage,
      effectiveDate,
      incrementType,
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
      // "designation",
      "performanceYear",
      "newCTC",
      "effectiveDate",
      "incrementType",
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
    const existing = await IncrementLetter.findOne({
      employeeEmail,
      company: cleanCompany,
      effectiveDate,
    });

    if (existing) {
      throw new AppError(
        "Increment already issued for this employee on this date",
        409
      );
    }

    // ✅ Generate document number
    const documentNumber = `INC-${employeeId}-${Date.now()}`;

    // ✅ Create document
    const letter = await IncrementLetter.create({
      company: cleanCompany,
      issuedTo,
      title,
      employeeName,
      employeeNumber,
      employeeEmail,
      designation,
      performanceYear,
      newCTC,
      incrementPercentage,
      effectiveDate,
      incrementType,
      issueDate,
      issuedBy,
      employeeId,
      documentNumber,
    });

    // ✅ Populate issuedBy name
    const populatedLetter = await IncrementLetter.findById(letter._id)
      .populate("issuedBy", "name");

    // ✅ Final response
    const finalResponse = {
      ...populatedLetter.toObject(),
      issuedBy: populatedLetter.issuedBy.name,
    };

    return sendResponse(
      res,
      201,
      "Increment Letter created successfully",
      finalResponse
    );

  } catch (error) {
    next(error);
  }
};
/* ================ GET ALL ================ */

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
