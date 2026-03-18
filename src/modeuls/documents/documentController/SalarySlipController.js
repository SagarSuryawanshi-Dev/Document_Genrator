import SalarySlip from "../documentModel/SalarySlip.js";
import { getOrCreateEmployeeId } from "../../../serviceController/getOrCreateEmployeeId.js";
import AppError from "../../../utlis/apiError.js";
import sendResponse from "../../../utlis/apiResponse.js";

/* ================= CREATE ================= */

export const createSalarySlip = async (req, res, next) => {
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

    /* ===== GENERATE OR FETCH EMPLOYEE ID ===== */
    const employeeId = await getOrCreateEmployeeId(email, company);
    body.employeeId = employeeId;

    /* ===== REQUIRED FIELD VALIDATION ===== */

    if (
      !company ||
      !issuedTo ||
      !title ||
      !employeeName ||
      !designation ||
      !department ||
      !month ||
      !totalSalary ||
      !doj ||
      !pan ||
      !gender ||
      !mode ||
      !workdays ||
      !dob ||
      !salaryType ||
      !accountNo
    ) {
      throw new AppError("Please fill all required fields", 400);
    }

    /* ===== DUPLICATE CHECK ===== */

    const existing = await SalarySlip.findOne({
      company,
      employeeId,
      month,
    });

    if (existing) {
      throw new AppError(
        "Salary slip already exists for this employee in this month",
        409,
      );
    }

    /* ===== DOCUMENT NUMBER ===== */

    body.documentNumber = `SAL-${employeeId}-${Date.now()}`;

    /* ===== CREATE ===== */

    const slip = await SalarySlip.create(body);

    return sendResponse(res, 201, "Salary Slip created successfully", slip);
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
