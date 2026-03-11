
// import SalarySlip from "../documentModel/SalarySlip.js";

// /* ================= CREATE ================= */

// export const createSalarySlip = async (req, res) => {
//   try {
//     const data = req.body;

//     const {
//       mrms,
//       employeeName,
//       employeeId,
//       designation,
//       department,
//       month,
//       totalSalary,
//       doj,
//       pan,
//       gender,
//       mode,
//       workdays,
//       dob,
//       salaryType,
//       accountNo,
//       company,
//     } = data;

//     if (
//       !mrms ||
//       !employeeName ||
//       !employeeId ||
//       !designation ||
//       !department ||
//       !month ||
//       !totalSalary ||
//       !doj ||
//       !pan ||
//       !gender ||
//       !mode ||
//       !workdays ||
//       !dob ||
//       !salaryType ||
//       !accountNo ||
//       !company
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "All required fields must be provided",
//       });
//     }

//     /* prevent duplicate salary slip */
//     const existing = await SalarySlip.findOne({
//       employeeId,
//       month,
//       company,
//     });

//     if (existing) {
//       return res.status(409).json({
//         success: false,
//         message: "Salary slip already exists for this employee in this month",
//       });
//     }

//     /* attach logged-in user */
//     if (req.user) {
//       data.createdBy = req.user.id;
//     }

//     /* generate document number */
//     const count = await SalarySlip.countDocuments();

//     data.documentNumber = `SAL-${new Date().getFullYear()}-${String(
//       count + 1
//     ).padStart(4, "0")}`;

//     const slip = await SalarySlip.create(data);

//     return res.status(201).json({
//       success: true,
//       message: "Salary Slip created successfully",
//       data: slip,
//     });
//   } catch (error) {
//     console.error("CREATE SALARY SLIP ERROR:", error);

//     if (error.code === 11000) {
//       return res.status(400).json({
//         success: false,
//         message: "Duplicate salary slip detected",
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };


// /* ================= GET ALL ================= */

// export const getAllSalarySlips = async (req, res) => {
//   try {
//     const slips = await SalarySlip.find()
//       .populate("company", "companyName")
//       .populate("createdBy", "name email")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       count: slips.length,
//       data: slips,
//     });
//   } catch (error) {
//     console.error("GET SALARY SLIPS ERROR:", error);

//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };


// /* ================= GET ONE ================= */

// export const getSalarySlipById = async (req, res) => {
//   try {
//     const slip = await SalarySlip.findById(req.params.id)
//       .populate("company", "companyName")
//       .populate("createdBy", "name email");

//     if (!slip) {
//       return res.status(404).json({
//         success: false,
//         message: "Salary slip not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: slip,
//     });
//   } catch (error) {
//     console.error("GET SALARY SLIP ERROR:", error);

//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };


// /* ================= UPDATE ================= */

// export const updateSalarySlip = async (req, res) => {
//   try {
//     const slip = await SalarySlip.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//     if (!slip) {
//       return res.status(404).json({
//         success: false,
//         message: "Salary slip not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Salary slip updated successfully",
//       data: slip,
//     });
//   } catch (error) {
//     console.error("UPDATE SALARY SLIP ERROR:", error);

//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };


// /* ================= DELETE ================= */

// export const deleteSalarySlip = async (req, res) => {
//   try {
//     const slip = await SalarySlip.findByIdAndDelete(req.params.id);

//     if (!slip) {
//       return res.status(404).json({
//         success: false,
//         message: "Salary slip not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Salary slip deleted successfully",
//     });
//   } catch (error) {
//     console.error("DELETE SALARY SLIP ERROR:", error);

//     res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };




import SalarySlip from "../documentModel/SalarySlip.js";
import AppError from "../../../utlis/apiError.js";
import sendResponse from "../../../utlis/apiResponse.js";
import { generateEmployeeId } from "../../../utlis/generateEmployeedId.js";


/* ================= CREATE ================= */
export const createSalarySlip = async (req, res) => {
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
      "mrms",
      "employeeName",
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
      "accountNo"
    ];

    const missingFields = requiredFields.filter(
      (field) => body[field] === undefined
    );

    if (missingFields.length > 0) {
      throw new AppError(
        `Missing required fields: ${missingFields.join(", ")}`,
        400
      );
    }

    /* GENERATE EMPLOYEE ID */
    const employeeId = await generateEmployeeId(body.company);

    /* CHECK DUPLICATE */
    const exists = await SalarySlip.findOne({
      employeeId: employeeId,
      month: body.month
    });

    if (exists) {
      throw new AppError(
        "Salary slip already exists for this employee for this month",
        409
      );
    }

    /* CREATE DOCUMENT */
    const slip = await SalarySlip.create({
      ...body,
      employeeId: employeeId,
      documentNumber: `SAL-${Date.now()}`
    });

    console.log("Salary Slip", slip);

    sendResponse(
      res,
      201,
      "Salary slip created successfully",
      slip
    );

  } catch (err) {

    throw new AppError(err.message, 409);

  }
};


/* ================= READ ALL ================= */
export const getAllSalarySlips = async (req, res) => {
  try {

    const slips = await SalarySlip.find()
      .populate("company")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: slips.length,
      data: slips,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


/* ================= READ ONE ================= */
export const getSalarySlipById = async (req, res) => {
  try {

    const slip = await SalarySlip.findById(req.params.id)
      .populate("company");

    if (!slip) {
      return res.status(404).json({
        success: false,
        message: "Salary slip not found",
      });
    }

    res.status(200).json({
      success: true,
      data: slip,
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: "Invalid salary slip ID",
    });

  }
};


/* ================= UPDATE ================= */
export const updateSalarySlip = async (req, res) => {
  try {

    const updated = await SalarySlip.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Salary slip not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Salary slip updated successfully",
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
export const deleteSalarySlip = async (req, res) => {
  try {

    const deleted = await SalarySlip.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Salary slip not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Salary slip deleted successfully",
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message,
    });

  }
};