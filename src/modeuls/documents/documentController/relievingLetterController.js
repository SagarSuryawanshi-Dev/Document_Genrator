import RelievingLetter from "../documentModel/RelievingLetter.js";
import { getOrCreateEmployeeId } from "../../../serviceController/getOrCreateEmployeeId.js";
import AppError from "../../../utlis/apiError.js";
import sendResponse from "../../../utlis/apiResponse.js";

/* ================ CREATE ================ */

export const createRelievingLetter = async (req, res, next) => {
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
      employeeEmail, // FIX: consistent naming
      designation,
      joiningDate,
      lastWorkingDay,
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
      "designation",
      "joiningDate",
      "lastWorkingDay",
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
    const existingLetter = await RelievingLetter.findOne({
      employeeEmail,
      company: cleanCompany,
      lastWorkingDay,
    });

    if (existingLetter) {
      throw new AppError(
        "Relieving letter already exists for this employee",
        409
      );
    }

    // ✅ Generate document number
    const documentNumber = `REL-${employeeId}-${Date.now()}`;

    // ✅ Create document (explicit fields only)
    const newLetter = await RelievingLetter.create({
      company: cleanCompany,
      issuedTo,
      title,
      employeeName,
      employeeNumber,
      employeeEmail,
      designation,
      joiningDate,
      lastWorkingDay,
      issueDate,
      issuedBy,
      employeeId,
      documentNumber,
    });

    // ✅ Populate issuedBy name
    const populatedLetter = await RelievingLetter.findById(newLetter._id)
      .populate("issuedBy", "name");

    // ✅ Clean response
    const finalResponse = {
      ...populatedLetter.toObject(),
      issuedBy: populatedLetter.issuedBy.name,
    };

    return sendResponse(
      res,
      201,
      "Relieving Letter created successfully",
      finalResponse
    );

  } catch (error) {
    next(error);
  }
};

/* ================= GET ALL ================= */

export const getAllRelievingLetters = async (req, res, next) => {
  try {
    const letters = await RelievingLetter.find().sort({ createdAt: -1 });

    return sendResponse(res, 200, "Relieving letters fetched successfully", {
      count: letters.length,
      letters,
    });
  } catch (error) {
    next(error);
  }
};

/* ================ GET BY ID ================ */

export const getRelievingLetterById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const letter = await RelievingLetter.findById(id);

    if (!letter) {
      throw new AppError("Relieving Letter not found", 404);
    }

    return sendResponse(res, 200, "Relieving letter fetched", letter);
  } catch (error) {
    next(error);
  }
};

/* ================= UPDATE ================= */

export const updateRelievingLetter = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedLetter = await RelievingLetter.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!updatedLetter) {
      throw new AppError("Relieving Letter not found", 404);
    }

    return sendResponse(
      res,
      200,
      "Relieving Letter updated successfully",
      updatedLetter,
    );
  } catch (error) {
    next(error);
  }
};

/* ================= DELETE ================= */

export const deleteRelievingLetter = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedLetter = await RelievingLetter.findByIdAndDelete(id);

    if (!deletedLetter) {
      throw new AppError("Relieving Letter not found", 404);
    }

    return sendResponse(res, 200, "Relieving Letter deleted successfully");
  } catch (error) {
    next(error);
  }
};
