import IncrementLetter from "../documentModel/IncrementLetter.js";

/* ================= CREATE ================= */

export const createIncrementLetter = async (req, res) => {
  try {
    const data = req.body;

    const {
      mrms,
      employeeName,
      employeeId,
      designation,
      newCTC,
      effectiveDate,
      incrementType,
      issueDate,
      performanceYear,
      company,
    } = data;

    if (
      !mrms ||
      !employeeName ||
      !employeeId ||
      !designation ||
      !newCTC ||
      !effectiveDate ||
      !incrementType ||
      !issueDate ||
      !performanceYear ||
      !company
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    /* check duplicate increment */
    const existing = await IncrementLetter.findOne({
      company,
      employeeId,
      effectiveDate,
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Increment already issued for this employee on this date",
      });
    }

    /* attach logged in user */
    if (req.user) {
      data.createdBy = req.user.id;
    }

    /* generate document number */
    const count = await IncrementLetter.countDocuments();

    data.documentNumber = `INC-${new Date().getFullYear()}-${String(
      count + 1
    ).padStart(4, "0")}`;

    const letter = await IncrementLetter.create(data);

    res.status(201).json({
      success: true,
      message: "Increment Letter created successfully",
      data: letter,
    });
  } catch (error) {
    console.error("CREATE INCREMENT LETTER ERROR:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate increment detected",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= GET ALL ================= */

export const getAllIncrementLetters = async (req, res) => {
  try {
    const letters = await IncrementLetter.find()
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

export const getIncrementLetterById = async (req, res) => {
  try {
    const { id } = req.params;

    const letter = await IncrementLetter.findById(id).populate(
      "createdBy",
      "name email"
    );

    if (!letter) {
      return res.status(404).json({
        success: false,
        message: "Increment letter not found",
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

export const updateIncrementLetter = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await IncrementLetter.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Increment letter not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Increment letter updated successfully",
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

export const deleteIncrementLetter = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await IncrementLetter.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Increment letter not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Increment letter deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};