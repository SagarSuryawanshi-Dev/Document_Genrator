import AppointmentLetter from "../documentModel/AppointmentLetter.js";
import AppError from "../../../utlis/apiError.js";
import sendResponse from "../../../utlis/apiResponse.js";
import { getOrCreateEmployeeId } from "../../../serviceController/getOrCreateEmployeeId.js";

/* ================= CREATE ================= */

export const createAppointmentLetter = async (req, res, next) => {
  try {
    const body = req.body;

    /* 1️⃣ Check request body */
    if (!body || Object.keys(body).length === 0) {
      throw new AppError("Request body is missing", 400);
    }

    const {
      title,
      company,
      issuedTo,
      employeeName,
      employeeEmail,
      address,
      position,
      joiningDate,
      probationPeriod,
      salary,
      workLocation,
      reportingManager,
      appointmentType,
      issueDate,
    } = body;

    const requiredFields = [
      "title",
      "employeeName",
      "employeeEmail",
      "employeeNumber",
      "company",
      "issuedTo",
      "employeeName",
      "address",
      "position",
      "joiningDate",
      "probationPeriod",
      "salary",
      "workLocation",
      "appointmentType",
      "issueDate",
    ];

    const missingFields = requiredFields.filter(
      (field) => body[field] === undefined,
    );

    if (missingFields.length > 0) {
      throw new AppError(
        `Missing required fields: ${missingFields.join(", ")}`,
        400
      );
    }

    /* ===== GENERATE OR FETCH EMPLOYEE ID ===== */

    const employeeId = await getOrCreateEmployeeId(email, company);
    body.employeeId = employeeId;

    /* ===== DUPLICATE CHECK ===== */

    const exists = await AppointmentLetter.findOne({
      company,
      employeeId,
      joiningDate,
    });

    if (existingEmployee) {
      employeeId = existingEmployee.employeeId;
    } else {
      employeeId = await generateEmployeeId(body.company);
    }

    /* ===== CREATE DOCUMENT ===== */

    const letter = await AppointmentLetter.create({
      ...body,
      documentNumber: `AL-${employeeId}-${Date.now()}`,
    });

    return sendResponse(
      res,
      201,
      "Appointment letter created successfully",
      letter,
    );
  } catch (error) {
    next(error);
  }
};
/* ================= READ ALL ================= */
export const getAllAppointmentLetters = async (req, res) => {
  try {
    const letters = await AppointmentLetter.find()
      .populate("company")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: letters.length,
      data: letters,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAppointmentLetterById = async (req, res) => {
  try {
    const letter = await AppointmentLetter.findById(req.params.id).populate(
      "company",
    );

    if (!letter) {
      return res.status(404).json({
        success: false,
        message: "Appointment letter not found",
      });
    }

    res.status(200).json({
      success: true,
      data: letter,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid appointment letter ID",
    });
  }
};

export const updateAppointmentLetter = async (req, res) => {
  try {
    const updated = await AppointmentLetter.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Appointment letter not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment letter updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteAppointmentLetter = async (req, res) => {
  try {
    const deleted = await AppointmentLetter.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Appointment letter not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Appointment letter deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
