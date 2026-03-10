import InternshipCertificate from "../models/InternshipCertificate.js";

/* ================= CREATE ================= */

export const createInternshipCertificate = async (req, res) => {
  try {
    const data = req.body;

    const {
      mrms,
      employeeName,
      employeeId,
      designation,
      internshipType,
      startDate,
      endDate,
      issueDate,
      company,
    } = data;

    if (
      !mrms ||
      !employeeName ||
      !employeeId ||
      !designation ||
      !internshipType ||
      !startDate ||
      !endDate ||
      !issueDate ||
      !company
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    /* prevent duplicate */
    const existing = await InternshipCertificate.findOne({
      company,
      employeeId,
      startDate,
      endDate,
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Internship certificate already exists for this employee",
      });
    }

    /* attach logged-in user if available */
    if (req.user) {
      data.createdBy = req.user.id;
    }

    const certificate = await InternshipCertificate.create(data);

    res.status(201).json({
      success: true,
      message: "Internship Certificate created successfully",
      data: certificate,
    });
  } catch (error) {
    console.error("CREATE ERROR:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate internship certificate detected",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= GET ALL ================= */

export const getAllInternshipCertificates = async (req, res) => {
  try {
    const certificates = await InternshipCertificate.find()
      .populate("createdBy", "name email")
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
      message: "Server error",
    });
  }
};

/* ================= GET BY ID ================= */

export const getInternshipCertificateById = async (req, res) => {
  try {
    const { id } = req.params;

    const certificate = await InternshipCertificate.findById(id).populate(
      "createdBy",
      "name email"
    );

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "Internship certificate not found",
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
      message: "Server error",
    });
  }
};

/* ================= UPDATE ================= */

export const updateInternshipCertificate = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await InternshipCertificate.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Internship certificate not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Internship certificate updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("UPDATE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= DELETE ================= */

export const deleteInternshipCertificate = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await InternshipCertificate.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Internship certificate not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Internship certificate deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};