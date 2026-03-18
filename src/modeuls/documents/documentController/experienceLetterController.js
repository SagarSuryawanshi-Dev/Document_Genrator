import ExperienceLetter from "../documentModel/ExperienceLetter.js";
import { getOrCreateEmployeeId } from "../../../serviceController/getOrCreateEmployeeId.js";
import AppError from "../../../utlis/apiError.js";
import sendResponse from "../../../utlis/apiResponse.js";

export const createExperienceLetter = async (req, res, next) => {
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
      joiningDate,
      relievingDate,
      issueDate,
    } = body;

    const employeeId = await getOrCreateEmployeeId(email, company);
    body.employeeId = employeeId;

    if (
      !company ||
      !issuedTo ||
      !title ||
      !employeeName ||
      !designation ||
      !joiningDate ||
      !relievingDate ||
      !issueDate
    ) {
      throw new AppError("Please fill all required fields", 400);
    }

    const existingLetter = await ExperienceLetter.findOne({
      company,
      employeeId,
      relievingDate,
    });

    if (existingLetter) {
      throw new AppError(
        "Experience letter already exists for this employee with this relieving date",
        409,
      );
    }

    body.documentNumber = `EXP-${employeeId}-${Date.now()}`;

    const newLetter = await ExperienceLetter.create(body);

    return sendResponse(
      res,
      201,
      "Experience Letter created successfully",
      newLetter,
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
