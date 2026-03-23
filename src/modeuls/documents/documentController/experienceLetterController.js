import ExperienceLetter from "../documentModel/ExperienceLetter.js";
import { getOrCreateEmployeeId } from "../../../serviceController/getOrCreateEmployeeId.js";
import AppError from "../../../utlis/apiError.js";
import sendResponse from "../../../utlis/apiResponse.js";


export const createExperienceLetter = async (req, res, next) => {
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
      employeeEmail,
      designation,
      department, // optional
      joiningDate,
      relievingDate,
      issueDate,
    } = body;

    // ✅ Required fields (department removed — optional)
    const requiredFields = [
      "company",
      "issuedTo",
      "title",
      "employeeName",
      "employeeNumber",
      "employeeEmail",
      "employeeNumber",
      "designation",
      "joiningDate",
      "relievingDate",
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

    // ✅ Duplicate check (single clean check)
    const existingLetter = await ExperienceLetter.findOne({
      employeeEmail,
      company: cleanCompany,
      relievingDate,
    });

    if (existingLetter) {
      throw new AppError(
        "Experience Letter already exists for this employee",
        409
      );
    }

    // ✅ Generate document number
    const documentNumber = `EXP-${employeeId}-${Date.now()}`;

    // ✅ Create document
    const letter = await ExperienceLetter.create({
      company: cleanCompany,
      issuedTo,
      title,
      employeeName,
      employeeNumber,
      employeeEmail,
      employeeNumber,
      designation,
      department, // optional
      joiningDate,
      relievingDate,
      issueDate,
      issuedBy,
      employeeId,
      documentNumber,
    });

    // ✅ Populate issuedBy name
    const populatedLetter = await ExperienceLetter.findById(letter._id)
      .populate("issuedBy", "name");

    // ✅ Clean response
    const finalResponse = {
      ...populatedLetter.toObject(),
      issuedBy: populatedLetter.issuedBy.name,
    };

    return sendResponse(
      res,
      201,
      "Experience Letter created successfully",
      finalResponse
    );

  } catch (error) {
    next(error);
  }
};
/* ================= GET ALL ================= */
export const getAllExperienceLetters = async (req, res, next) => {
  try {
    const letters = await ExperienceLetter.find().sort({ createdAt: -1 });

    return sendResponse(res, 200, "Experience letters fetched successfully", {
      count: letters.length,
      letters,
    });
  } catch (error) {
    next(error);
  }
};

/* ================= GET BY ID ================= */
export const getExperienceLetterById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const letter = await ExperienceLetter.findById(id);

    if (!letter) {
      throw new AppError("Experience Letter not found", 404);
    }

    return sendResponse(res, 200, "Experience letter fetched", letter);
  } catch (error) {
    next(error);
  }
};

/* ================= UPDATE ================= */
export const updateExperienceLetter = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedLetter = await ExperienceLetter.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!updatedLetter) {
      throw new AppError("Experience Letter not found", 404);
    }

    return sendResponse(
      res,
      200,
      "Experience Letter updated successfully",
      updatedLetter,
    );
  } catch (error) {
    next(error);
  }
};

/* ================= DELETE ================= */
export const deleteExperienceLetter = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedLetter = await ExperienceLetter.findByIdAndDelete(id);

    if (!deletedLetter) {
      throw new AppError("Experience Letter not found", 404);
    }

    return sendResponse(res, 200, "Experience Letter deleted successfully");
  } catch (error) {
    next(error);
  }
};
