import AppointmentLetter from "../documentModel/AppointmentLetter.js";
import AppError from "../../../utlis/apiError.js";
import sendResponse from "../../../utlis/apiResponse.js";
import { generateEmployeeId } from "../../../utlis/generateEmployeedId.js"
import companyPrefixes from "../../../utlis/organizationPrefix.js";


/* ================= CREATE ================= */
export const createAppointmentLetter = async (req, res) => {
  console.log("Controller hit");
  try {
    const body = req.body;

    if (!body || Object.keys(body).length === 0) {
      throw new AppError("Request body is Missing", 400);
    }

    const requiredFields = [
      "title",
      "company",
      "issuedTo",
      "employeeName",
      "address",
      "position",
      "joiningDate",
      "probationPeriod",
      "salary",
      "workLocation",
      "reportingManager",
      "appointmentType",
      "issueDate"
    ];

    const missingFields = requiredFields.filter(
  (field) => body[field] === undefined
);

    if (missingFields.length > 0) {
      throw new AppError(
        `Missing required fields: ${missingFields.join(", ")}`,
        400,
      );
    }
    const employeeId = await generateEmployeeId(body.company);
      
    

    const exists = await AppointmentLetter.findOne({
      employeeId:employeeId,
    });

    if (exists) {
      throw new AppError(
        "Appointment letter already exists for this employee",
        409,
      );
    }

    // ✅ CREATE DOCUMENT NUMBER
    const letter = await AppointmentLetter.create({
      ...body,
      employeeId: employeeId,
      documentNumber: `AL-${Date.now()}`, // 🔥 UNIQUE
    });
    console.log("appointment letter", letter )
    sendResponse(
      res,
      201,
      "Appointment letter created successfully",
      letter
    );
  } catch (err) {
    throw new AppError(err.message, 409);
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

/* ================= READ ONE ================= */
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

/* ================= UPDATE ================= */
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

/* ================= DELETE ================= */
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
