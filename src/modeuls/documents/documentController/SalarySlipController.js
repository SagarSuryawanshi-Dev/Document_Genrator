// import salarySlipSchema from "../documentModel/SalarySlip.js";

// export const createSalarySlip = async (req,res) => {
//    try {
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
//     } = req.body;

//     if (
//       !employeeName ||
//       !employeeId ||
//       !month ||
//       !totalSalary
//     ) {
//       return next(new AppError("Required fields missing", 400));
//     }

//     const salarySlip = await SalarySlip.create({
//       ...req.body,
//       createdBy: req.user?._id,
//       company: req.user?.company, // assuming company exists in base schema
//     });

//     return sendResponse(
//       res,
//       201,
//       true,
//       "Salary slip created successfully",
//       salarySlip
//     );

//   } catch (error) {
//     if (error.code === 11000) {
//       return next(
//         new AppError("Salary slip already exists for this month", 400)
//       );
//     }

//     return next(new AppError(error.message, 500));
//   }
// }





import SalarySlip from "../documentModel/SalarySlip.js";

/* ================= CREATE ================= */

export const createSalarySlip = async (req, res) => {
  try {
    const data = req.body;

    const {
      mrms,
      employeeName,
      employeeId,
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
      company,
    } = data;

    if (
      !mrms ||
      !employeeName ||
      !employeeId ||
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
      !accountNo ||
      !company
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    /* prevent duplicate salary slip */
    const existing = await SalarySlip.findOne({
      employeeId,
      month,
      company,
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Salary slip already exists for this employee in this month",
      });
    }

    /* attach logged-in user */
    if (req.user) {
      data.createdBy = req.user.id;
    }

    /* generate document number */
    const count = await SalarySlip.countDocuments();

    data.documentNumber = `SAL-${new Date().getFullYear()}-${String(
      count + 1
    ).padStart(4, "0")}`;

    const slip = await SalarySlip.create(data);

    return res.status(201).json({
      success: true,
      message: "Salary Slip created successfully",
      data: slip,
    });
  } catch (error) {
    console.error("CREATE SALARY SLIP ERROR:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate salary slip detected",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


/* ================= GET ALL ================= */

export const getAllSalarySlips = async (req, res) => {
  try {
    const slips = await SalarySlip.find()
      .populate("company", "companyName")
      .populate("createdBy", "name email") // issued by instead of createdBy for better clarity
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: slips.length,
      data: slips,
    });
  } catch (error) {
    console.error("GET SALARY SLIPS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


/* ================= GET ONE ================= */

export const getSalarySlipById = async (req, res) => {
  try {
    const slip = await SalarySlip.findById(req.params.id)
      .populate("company", "companyName")
      .populate("createdBy", "name email"); // issued by instead of createdBy for better clarity

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
    console.error("GET SALARY SLIP ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


/* ================= UPDATE ================= */

export const updateSalarySlip = async (req, res) => {
  try {
    const slip = await SalarySlip.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!slip) {
      return res.status(404).json({
        success: false,
        message: "Salary slip not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Salary slip updated successfully",
      data: slip,
    });
  } catch (error) {
    console.error("UPDATE SALARY SLIP ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


/* ================= DELETE ================= */

export const deleteSalarySlip = async (req, res) => {
  try {
    const slip = await SalarySlip.findByIdAndDelete(req.params.id);

    if (!slip) {
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
    console.error("DELETE SALARY SLIP ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};