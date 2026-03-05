import FullAndFinalLetter from "../documentModel/FullAndFinalLetter.js";

/* ================= CREATE ================= */
export const createFullAndFinalLetter = async (req, res) => {
  try {
    const body = req.body;

    if (!body || Object.keys(body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body is missing",
      });
    }

    const {
      company,
      issuedTo,
      employeeName,
      employeeId,
      designation,
      fnfDate,
      month,
      totalSalary,
      doj,
      resignationDate,
      leavingDate,
      paidDays,
      finalType,
      workdays,
    } = body;

    /* ===== REQUIRED FIELD VALIDATION ===== */
    if (
      !company ||
      !issuedTo ||
      !employeeName ||
      !employeeId ||
      !designation ||
      !fnfDate ||
      !month ||
      !totalSalary ||
      !doj ||
      !resignationDate ||
      !leavingDate ||
      !paidDays ||
      !finalType ||
      !workdays
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    /* ===== CHECK DUPLICATE ===== */
    const existing = await FullAndFinalLetter.findOne({
      company,
      employeeId,
      leavingDate,
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message:
          "Full & Final already exists for this employee with this leaving date",
      });
    }

    /* ===== GENERATE DOCUMENT NUMBER ===== */
    body.documentNumber = `FNF-${employeeId}-${Date.now()}`;

    /* ===== CREATE DOCUMENT ===== */
    const newLetter = await FullAndFinalLetter.create(body);

    res.status(201).json({
      success: true,
      message: "Full & Final Letter created successfully",
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
export const getAllFullAndFinalLetters = async (req, res) => {
  try {
    const letters = await FullAndFinalLetter.find().sort({ createdAt: -1 });

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
export const getFullAndFinalLetterById = async (req, res) => {
  try {
    const { id } = req.params;

    const letter = await FullAndFinalLetter.findById(id);

    if (!letter) {
      return res.status(404).json({
        success: false,
        message: "Full & Final Letter not found",
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
export const updateFullAndFinalLetter = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedLetter = await FullAndFinalLetter.findByIdAndUpdate(
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
        message: "Full & Final Letter not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Full & Final Letter updated successfully",
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
export const deleteFullAndFinalLetter = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedLetter = await FullAndFinalLetter.findByIdAndDelete(id);

    if (!deletedLetter) {
      return res.status(404).json({
        success: false,
        message: "Full & Final Letter not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Full & Final Letter deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};