
import ConfirmationLetter from "../documentModel/ConfirmationLetter.js";

/* ================= CREATE ================= */
export const createConfirmationLetter = async (req, res) => {
  try {
    const body = req.body;

    /* BODY CHECK */
    if (!body || Object.keys(body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body is missing",
      });
    }

    const {
      company,
      issuedTo,
      mrms,
      employeeName,
      employeeId,
      effectiveDate,
      issueDate,
      totalSalary,
      position,
      department,
      address,
      confirmationType,
    } = body;

    /* REQUIRED FIELD VALIDATION */
    if (
      !company ||
      !issuedTo ||
      !mrms ||
      !employeeName ||
      !employeeId ||
      !effectiveDate ||
      !issueDate ||
      !totalSalary ||
      !position ||
      !confirmationType
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    /* CHECK DUPLICATE */
    const existing = await ConfirmationLetter.findOne({
      company,
      employeeId,
      effectiveDate,
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message:
          "Confirmation letter already exists for this employee on this effective date",
      });
    }

    /* GENERATE DOCUMENT NUMBER */
    body.documentNumber = `CONF-${employeeId}-${Date.now()}`;

    /* CREATE LETTER */
    const newLetter = await ConfirmationLetter.create(body);

    res.status(201).json({
      success: true,
      message: "Confirmation Letter created successfully",
      data: newLetter,
    });
  } catch (error) {
    console.error("CREATE ERROR:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate document detected",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

/* ================= GET ALL ================= */
export const getAllConfirmationLetters = async (req, res) => {
  try {
    const letters = await ConfirmationLetter.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: letters.length,
      data: letters,
    });
  } catch (error) {
    console.error("GET ALL ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ================= GET BY ID ================= */
export const getConfirmationLetterById = async (req, res) => {
  try {
    const { id } = req.params;

    const letter = await ConfirmationLetter.findById(id);

    if (!letter) {
      return res.status(404).json({
        success: false,
        message: "Confirmation Letter not found",
      });
    }

    res.status(200).json({
      success: true,
      data: letter,
    });
  } catch (error) {
    console.error("GET BY ID ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ================= UPDATE ================= */
export const updateConfirmationLetter = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedLetter = await ConfirmationLetter.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedLetter) {
      return res.status(404).json({
        success: false,
        message: "Confirmation Letter not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Confirmation Letter updated successfully",
      data: updatedLetter,
    });
  } catch (error) {
    console.error("UPDATE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ================= DELETE ================= */
export const deleteConfirmationLetter = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedLetter = await ConfirmationLetter.findByIdAndDelete(id);

    if (!deletedLetter) {
      return res.status(404).json({
        success: false,
        message: "Confirmation Letter not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Confirmation Letter deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};