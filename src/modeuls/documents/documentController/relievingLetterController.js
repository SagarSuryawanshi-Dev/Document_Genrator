import RelievingLetter from "../documentModel/RelievingLetter.js";
import { getOrCreateEmployeeId } from "../../../utlis/getOrCreateEmployeeId.js";
import AppError from "../../../utlis/apiError.js";
import sendResponse from "../../../utlis/apiResponse.js";

/* ================= CREATE ================= */

export const createRelievingLetter = async (req, res, next) => {
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
      lastWorkingDay,
      issueDate,
    } = body;

    /* generate employeeId */
    const employeeId = await getOrCreateEmployeeId(email, company);
    body.employeeId = employeeId;

    /* validation */
    if (
      !company ||
      !issuedTo ||
      !title ||
      !employeeName ||
      !designation ||
      !joiningDate ||
      !lastWorkingDay ||
      !issueDate
    ) {
      throw new AppError("Please fill all required fields", 400);
    }

    /* prevent duplicate relieving letter */
    const existingLetter = await RelievingLetter.findOne({
      company,
      employeeId,
      lastWorkingDay,
    });

    if (existingLetter) {
      throw new AppError(
        "Relieving letter already exists for this employee",
        409
      );
    }

    /* generate document number */
    body.documentNumber = `REL-${employeeId}-${Date.now()}`;

    const newLetter = await RelievingLetter.create(body);

    return sendResponse(
      res,
      201,
      "Relieving Letter created successfully",
      newLetter
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

/* ================= GET BY ID ================= */

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
      { new: true, runValidators: true }
    );

    if (!updatedLetter) {
      throw new AppError("Relieving Letter not found", 404);
    }

    return sendResponse(
      res,
      200,
      "Relieving Letter updated successfully",
      updatedLetter
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