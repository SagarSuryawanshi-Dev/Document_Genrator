import RelievingLetter from "../documentModel/RelievingLetter.js";
import { getOrCreateEmployeeId } from "../../../utlis/getOrCreateEmployeeId.js";
/* ================= CREATE ================= */

export const createRelievingLetter = async (req, res) => {
  try {
    const body = req.body;

    if (!body || Object.keys(body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body is missing",
      });
    }

    const {
      title,
      employeeName,
      email,
      designation,
      joiningDate,
      lastWorkingDay,
      issueDate,
      company,
      issuedTo,
    } = body;

    /* generate or fetch employeeId */
    const employeeId = await getOrCreateEmployeeId(email, company);
    body.employeeId = employeeId;

    /* validation */
    if (
      !title ||
      !employeeName ||
      !email ||
      !designation ||
      !joiningDate ||
      !lastWorkingDay ||
      !issueDate ||
      !company ||
      !issuedTo
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    /* prevent duplicate relieving */
    const existing = await RelievingLetter.findOne({
      company,
      employeeId,
      lastWorkingDay,
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Relieving letter already exists for this employee",
      });
    }

    /* attach logged in user */
    if (req.user) {
      body.issuedBy = req.user.id;
    }

    /* generate document number */
    body.documentNumber = `REL-${employeeId}-${Date.now()}`;

    const letter = await RelievingLetter.create(body);

    return res.status(201).json({
      success: true,
      message: "Relieving Letter created successfully",
      data: letter,
    });
  } catch (error) {
    console.error("CREATE RELIEVING LETTER ERROR:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate document number detected",
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

export const getAllRelievingLetters = async (req, res) => {
  try {
    const letters = await RelievingLetter.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: letters.length,
      data: letters,
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

export const getRelievingLetterById = async (req, res) => {
  try {
    const { id } = req.params;

    const letter = await RelievingLetter.findById(id).populate(
      "createdBy",
      "name email",
    );

    if (!letter) {
      return res.status(404).json({
        success: false,
        message: "Relieving letter not found",
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
      message: "Server error",
    });
  }
};

/* ================= UPDATE ================= */

export const updateRelievingLetter = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await RelievingLetter.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Relieving letter not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Relieving letter updated successfully",
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

export const deleteRelievingLetter = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await RelievingLetter.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Relieving letter not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Relieving letter deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
