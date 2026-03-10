import CompletionCertificate from "../documentModel/CompletionCertificate.js";
import AppError from "../../../utlis/apiError.js";


export const createCompletionCertificate = async (req, res) => {
  try {
    const body = req.body;

    if (!body || Object.keys(body).length === 0) {
      throw new AppError("Request body is Missing", 400);
    }

    const {
      employee,
      projectName,
      startDate,
      completionDate,
      role,
      issueDate,
    } = body;

    /* ===== REQUIRED FIELD CHECK ===== */
    if (
      !employee ||
      !projectName ||
      !startDate ||
      !completionDate ||
      !role ||
      !issueDate
    ) {
      throw new AppError("All Fields are Required", 400);
    }

    /* ===== DUPLICATE CHECK ===== */
    const existing = await CompletionCertificate.findOne({
      employee,
      projectName,
    });

    if (existing) {
      throw new AppError("Competion certificate already exists for this employee", 400);
    }

    const certificate = await CompletionCertificate.create(body);

    res.status(201).json({
      success: true,
      message: "Completion Certificate created successfully",
      data: certificate,
    });
  } catch (error) {
    console.error("CREATE ERROR:", error);

    if (error.code === 11000) {
      throw new AppError("Completion certificate already exists for this employee", 400);
    }

    throw new AppError(error.message, 400);
  }
};


export const getAllCompletionCertificates = async (req, res) => {
  try {
    const certificates = await CompletionCertificate.find()
      .populate("employee")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: certificates.length,
      data: certificates,
    });
  } catch (error) {
    console.error("GET ALL ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


export const getCompletionCertificateById = async (req, res) => {
  try {
    const { id } = req.params;

    const certificate = await CompletionCertificate.findById(id).populate(
      "employee"
    );

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Completion Certificate not found",
      });
    }

    res.status(200).json({
      success: true,
      data: certificate,
    });
  } catch (error) {
    console.error("GET BY ID ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


export const updateCompletionCertificate = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedCertificate =
      await CompletionCertificate.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

    if (!updatedCertificate) {
      return res.status(404).json({
        success: false,
        message: "Completion Certificate not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Completion Certificate updated successfully",
      data: updatedCertificate,
    });
  } catch (error) {
    console.error("UPDATE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};


export const deleteCompletionCertificate = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCertificate =
      await CompletionCertificate.findByIdAndDelete(id);

    if (!deletedCertificate) {
      return res.status(404).json({
        success: false,
        message: "Completion Certificate not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Completion Certificate deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};