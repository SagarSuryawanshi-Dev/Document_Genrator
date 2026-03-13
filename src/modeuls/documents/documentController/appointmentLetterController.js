import AppointmentLetter from "../documentModel/AppointmentLetter.js";
import AppError from "../../../utlis/apiError.js";
import sendResponse from "../../../utlis/apiResponse.js";
import Document from "../documentModel/BaseDocument.js"
import { generateEmployeeId } from "../../../utlis/generateEmployeedId.js";

export const createAppointmentLetter = async (req, res) => {
  try {
    const body = req.body;

    /* 1️⃣ Check request body */
    if (!body || Object.keys(body).length === 0) {
      throw new AppError("Request body is missing", 400);
    }

    /* 2️⃣ Required fields */
    const requiredFields = [
      "title",
      "employeeName",
      "employeeEmail",
      "employeeNumber",
      "company",
      "issuedTo",
      "address",
      "position",
      "joiningDate",
      "probationPeriod",
      "salary",
      "workLocation",
      "appointmentType",
      "issueDate",
      "paymentStatus"
    ];

    const missingFields = requiredFields.filter(
      (field) => body[field] === undefined || body[field] === null
    );

    if (missingFields.length > 0) {
      throw new AppError(
        `Missing required fields: ${missingFields.join(", ")}`,
        400
      );
    }

    /* 3️⃣ Check if employee already exists */
    const existingEmployee = await Document.findOne({
      employeeEmail: body.employeeEmail,
      company: body.company
    });

    let employeeId;

    if (existingEmployee) {
      employeeId = existingEmployee.employeeId;
    } else {
      employeeId = await generateEmployeeId(body.company);
    }

    /* 4️⃣ Create appointment letter */
    const appointmentLetter = await AppointmentLetter.create({
      ...body,
      employeeId,
      documentNumber: `AL-${Date.now()}`
    });

    res.status(201).json({
      success: true,
      message: "Appointment letter created successfully",
      data: appointmentLetter
    });

  } catch (error) {
    next(error);
  }
};

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
