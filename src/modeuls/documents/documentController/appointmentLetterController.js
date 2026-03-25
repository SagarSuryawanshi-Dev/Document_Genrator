import AppointmentLetter from "../documentModel/AppointmentLetter.js";
import AppError from "../../../utlis/apiError.js";
import sendResponse from "../../../utlis/apiResponse.js";
import { getOrCreateEmployeeId } from "../../../serviceController/getOrCreateEmployeeId.js";

/* ================= CREATE ================= */

export const createAppointmentLetter = async (req, res, next) => {
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

    // ✅ Required fields
    const requiredFields = [
      "company",
      "issuedTo",
      "title",
      "employeeName",
      "employeeNumber",
      "employeeEmail",
      "address",
      "position",
      "joiningDate",
      "probationPeriod",
      "salary",
      "workLocation",
      "appointmentType",
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
    const existingLetter = await AppointmentLetter.findOne({
      employeeEmail,
      company: cleanCompany,
      joiningDate,
    });

    if (existingLetter) {
      throw new AppError(
        "Appointment letter already exists for this employee",
        409
      );
    }

    // ✅ Generate document number
    const documentNumber = `AL-${employeeId}-${Date.now()}`;

    // ✅ Create document
    const letter = await AppointmentLetter.create({
      company: cleanCompany,
      issuedTo,
      title,
      employeeName,
      employeeNumber: Number(employeeNumber) || Date.now(),
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
      issuedBy,
      employeeId,
      documentNumber,
    });

    // ✅ Populate issuedBy name
    const populatedLetter = await AppointmentLetter.findById(letter._id)
      .populate("issuedBy", "name");

    // ✅ Clean response
    const finalResponse = {
      ...populatedLetter.toObject(),
      issuedBy: populatedLetter.issuedBy.name,
    };

    return sendResponse(
      res,
      201,
      "Appointment Letter created successfully",
      finalResponse
    );

  } catch (error) {
    console.error("🔥 APPOINTMENT ERROR:", error);
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
