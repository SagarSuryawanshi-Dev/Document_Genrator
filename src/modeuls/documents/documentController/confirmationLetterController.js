import ConfirmationLetter from "../documentModel/ConfirmationLetter.js";
import { getOrCreateEmployeeId } from "../../../serviceController/getOrCreateEmployeeId.js";
import AppError from "../../../utlis/apiError.js";
import sendResponse from "../../../utlis/apiResponse.js";

/* ================ CREATE ================ */

export const createConfirmationLetter = async (req, res, next) => {
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
      effectiveDate,
      issueDate,
      totalSalary,
      position,
      department,
      confirmationType,
    } = body;

    // ✅ Required fields
    const requiredFields = [
      "company",
      "issuedTo",
      "title",
      "employeeName",
      "employeeEmail",
      "employeeNumber",
      "effectiveDate",
      "issueDate",
      "totalSalary",
      "position",
      "department",
      "confirmationType",
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
    const existing = await ConfirmationLetter.findOne({
      employeeEmail,
      company: cleanCompany,
      effectiveDate,
    });

    if (existing) {
      throw new AppError(
        "Confirmation letter already exists for this employee",
        409
      );
    }

    // ✅ Generate document number
    const documentNumber = `CONF-${employeeId}-${Date.now()}`;

    // ✅ Create document
    const letter = await ConfirmationLetter.create({
      company: cleanCompany,
      issuedTo,
      title,
      employeeName,
      employeeEmail,
      employeeNumber,
      effectiveDate,
      issueDate,
      totalSalary,
      position,
      department,
      confirmationType,
      issuedBy,
      employeeId,
      documentNumber,
    });

    // ✅ Populate issuedBy name
    const populatedLetter = await ConfirmationLetter.findById(letter._id)
      .populate("issuedBy", "name");

    // ✅ Clean response
    const finalResponse = {
      ...populatedLetter.toObject(),
      issuedBy: populatedLetter.issuedBy.name,
    };

    return sendResponse(
      res,
      201,
      "Confirmation Letter created successfully",
      finalResponse
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
