import SalarySlip from "../documentModel/SalarySlip.js";
import { getOrCreateEmployeeId } from "../../../serviceController/getOrCreateEmployeeId.js";
import AppError from "../../../utlis/apiError.js";
import sendResponse from "../../../utlis/apiResponse.js";

/* ================ CREATE ================ */

export const createSalarySlip = async (req, res, next) => {
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
      employeeEmail, // FIX
      designation,
      department,
      month,
      totalSalary,
      doj,
      pan,
      gender,
      mode,
      workdays,
      dob,
      salaryType,
      accountNo,
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
      "department",
      "month",
      "totalSalary",
      "doj",
      "pan",
      "gender",
      "mode",
      "workdays",
      "dob",
      "salaryType",
      "accountNo",
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
    const existing = await SalarySlip.findOne({
      employeeEmail,
      company: cleanCompany,
      month,
    });

    if (existing) {
      throw new AppError(
        "Salary slip already exists for this employee in this month",
        409
      );
    }

    // ✅ Generate document number
    const documentNumber = `SAL-${employeeId}-${Date.now()}`;

    // ✅ Create document
    const slip = await SalarySlip.create({
      company: cleanCompany,
      issuedTo,
      title,
      employeeName,
      employeeNumber,
      employeeEmail,
      designation,
      department,
      month,
      totalSalary,
      doj,
      pan,
      gender,
      mode,
      workdays,
      dob,
      salaryType,
      accountNo,
      issuedBy,
      employeeId,
      documentNumber,
    });

    // ✅ Populate issuedBy name
    const populatedSlip = await SalarySlip.findById(slip._id)
      .populate("issuedBy", "name");

    // ✅ Clean response
    const finalResponse = {
      ...populatedSlip.toObject(),
      issuedBy: populatedSlip.issuedBy.name,
    };

    return sendResponse(
      res,
      201,
      "Salary Slip created successfully",
      finalResponse
    );

  } catch (error) {
    next(error);
  }
};

/* ================= GET ALL ================= */

export const getAllSalarySlips = async (req, res, next) => {
  try {
    const slips = await SalarySlip.find().sort({ createdAt: -1 });

    return sendResponse(res, 200, "Salary slips fetched successfully", {
      count: slips.length,
      slips,
    });
  } catch (error) {
    next(error);
  }
};

/* ================= GET ONE ================= */
export const getSalarySlipById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const slip = await SalarySlip.findById(id);

    if (!slip) {
      throw new AppError("Salary slip not found", 404);
    }

    return sendResponse(res, 200, "Salary slip fetched", slip);
  } catch (error) {
    next(error);
  }
};

/* ================= UPDATE ================= */
export const updateSalarySlip = async (req, res, next) => {
  try {
    const { id } = req.params;

    const slip = await SalarySlip.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!slip) {
      throw new AppError("Salary slip not found", 404);
    }

    return sendResponse(res, 200, "Salary slip updated successfully", slip);
  } catch (error) {
    next(error);
  }
};
/* ================= DELETE ================= */
export const deleteSalarySlip = async (req, res, next) => {
  try {
    const { id } = req.params;

    const slip = await SalarySlip.findByIdAndDelete(id);

    if (!slip) {
      throw new AppError("Salary slip not found", 404);
    }

    return sendResponse(res, 200, "Salary slip deleted successfully");
  } catch (error) {
    next(error);
  }
};
