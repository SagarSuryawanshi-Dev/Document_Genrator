import { CompletionCertificate } from "../documentModel/CompletionCertificate.js";
import AppError from "../../../utlis/apiError.js";
import Document from  "../documentModel/BaseDocument.js";
import { generateEmployeeId } from "../../../utlis/generateEmployeedId.js";

export const createCompletionCertificate = async (req, res) => {
  try {
    const body = req.body;

    /* 1️⃣ Check body */
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
      "projectName",
      "startDate",
      "completionDate",
      "designation",
      "department",
      "roleinProject",
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

    /* 3️⃣ Check employee existence */
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

    /* 4️⃣ Prevent duplicate project certificate */
    const duplicate = await CompletionCertificate.findOne({
      employeeId,
      projectName: body.projectName
    });

    if (duplicate) {
      throw new AppError(
        "Completion certificate already exists for this project",
        409
      );
    }

    /* 5️⃣ Create certificate */
    const certificate = await CompletionCertificate.create({
      ...body,
      employeeId,
      documentNumber: `CC-${Date.now()}`
    });

    res.status(201).json({
      success: true,
      message: "Completion certificate created successfully",
      data: certificate
    });

  } catch (error) {
    next(error);
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

    const certificate =
      await CompletionCertificate.findById(id).populate("employee");

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

    const updatedCertificate = await CompletionCertificate.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

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
