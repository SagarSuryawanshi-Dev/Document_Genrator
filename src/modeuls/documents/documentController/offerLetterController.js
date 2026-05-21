import OfferLetter from "../documentModel/OfferLetter.js";
import { getOrCreateEmployeeId } from "../../../serviceController/getOrCreateEmployeeId.js";
import AppError from "../../../utlis/apiError.js";
import sendResponse from "../../../utlis/apiResponse.js";
import mongoose from "mongoose";

/* ================= CREATE ================= */
export const createOfferLetter = async (req, res, next) => {
  try {
    const body = req.body;

    // ================= AUTH CHECK =================
    if (!req.user) {
      throw new AppError("User not authenticated", 401);
    }

    const issuedBy = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(issuedBy)) {
      throw new AppError("Invalid issuedBy ID", 400);
    }

    // ================= BODY CHECK =================
    if (!body || Object.keys(body).length === 0) {
      throw new AppError("Request body is missing", 400);
    }

    const {
      company,
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
    } = body;

    console.log("📥 BODY RECEIVED:", body);

    // ================= REQUIRED FIELDS =================
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

    // ================= ENUM VALIDATION =================
    const validEmploymentTypes = [
      "Full-time",
      "Part-time",
      "Contract",
      "Internship",
    ];

    const validOfferTypes = ["withPF", "withoutPF"];

    if (!validEmploymentTypes.includes(employmentType)) {
      throw new AppError("Invalid employmentType value", 400);
    }

    if (!validOfferTypes.includes(offerType)) {
      throw new AppError("Invalid offerType value", 400);
    }

    // ================= NORMALIZE DATA =================
    const cleanCompany = company.trim();

    // ================= SAFE DATE CONVERSION =================
    let parsedJoiningDate, parsedOfferValidTill, parsedIssueDate;

    try {
      parsedJoiningDate = new Date(joiningDate);
      parsedOfferValidTill = new Date(offerValidTill);
      parsedIssueDate = new Date(issueDate);

      if (
        isNaN(parsedJoiningDate) ||
        isNaN(parsedOfferValidTill) ||
        isNaN(parsedIssueDate)
      ) {
        throw new Error("Invalid date format");
      }
    } catch (err) {
      throw new AppError("Invalid date format provided", 400);
    }

    // ================= EMPLOYEE ID =================
    let employeeId;

    try {
      employeeId = await getOrCreateEmployeeId(
        employeeEmail,
        cleanCompany
      );
    } catch (err) {
      console.error("❌ Employee ID ERROR:", err);
      throw new AppError("Failed to generate employee ID", 500);
    }

    console.log("🆔 Employee ID:", employeeId);

    // ================= DUPLICATE CHECK =================
    // const exists = await OfferLetter.findOne({
    //   employeeEmail,
    //   company: cleanCompany,
    //   joiningDate: parsedJoiningDate,
    // });

    // if (exists) {
    //   throw new AppError(
    //     "Offer letter already exists for this candidate and joining date",
    //     409
    //   );
    // }

    // ================= DOCUMENT NUMBER =================
    const documentNumber = `OL-${employeeId}-${Date.now()}`;
    console.log("📄 Document Number:", documentNumber);

    // ================= DUPLICATE CHECK =================
    let letter;

    const exists = await OfferLetter.findOne({
      employeeEmail,
      company: cleanCompany,
      joiningDate: parsedJoiningDate,
    });

    if (exists) {
      console.log("⚠️ Existing offer letter found, reusing it");

      letter = exists; // ✅ reuse existing record

    } else {
      console.log("✅ No existing record, creating new one");

      const documentNumber = `OL-${employeeId}-${Date.now()}`;

      letter = await OfferLetter.create({
        company: cleanCompany,
        issuedTo,
        title,
        employeeName,
        employeeNumber,
        employeeEmail,
        position,
        department,
        employmentType,
        joiningDate: parsedJoiningDate,
        probationPeriod,
        salary,
        location,
        workHours,
        reportingManager,
        offerValidTill: parsedOfferValidTill,
        offerType,
        issueDate: parsedIssueDate,
        issuedBy,
        employeeId,
        documentNumber,
      });
    }
    // ================= POPULATE =================
    const populatedLetter = await OfferLetter.findById(letter._id)
      .populate("issuedBy", "name");

    const finalResponse = {
      ...populatedLetter.toObject(),
      issuedBy: populatedLetter.issuedBy?.name || "Unknown",
    };

    // ================= RESPONSE =================
    return sendResponse(
      res,
      201,
      "Offer letter created successfully",
      finalResponse
    );

  } catch (error) {
    console.error("🔥 FINAL ERROR:", error);
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