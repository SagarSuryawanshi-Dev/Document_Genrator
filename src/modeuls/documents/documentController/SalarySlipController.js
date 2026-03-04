import salarySlipSchema from "../documentModel/SalarySlip.js";

export const createSalarySlip = async (req,res) => {
   try {
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
    } = req.body;

    if (
      !employeeName ||
      !employeeId ||
      !month ||
      !totalSalary
    ) {
      return next(new AppError("Required fields missing", 400));
    }

    const salarySlip = await SalarySlip.create({
      ...req.body,
      createdBy: req.user?._id,
      company: req.user?.company, // assuming company exists in base schema
    });

    return sendResponse(
      res,
      201,
      true,
      "Salary slip created successfully",
      salarySlip
    );

  } catch (error) {
    if (error.code === 11000) {
      return next(
        new AppError("Salary slip already exists for this month", 400)
      );
    }

    return next(new AppError(error.message, 500));
  }
}