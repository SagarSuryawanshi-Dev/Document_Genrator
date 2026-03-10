import RelievingLetter from "../documentModel/RelievingLetter.js";

/* ================= CREATE ================= */

export const createRelievingLetter = async (req, res) => {
  try {
    const data = req.body;

    const {
      mrms,
      employeeName,
      employeeId,
      designation,
      joiningDate,
      lastWorkingDay,
      issueDate,
      company,
    } = data;

    if (
      !mrms ||
      !employeeName ||
      !employeeId ||
      !designation ||
      !joiningDate ||
      !lastWorkingDay ||
      !issueDate ||
      !company
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    /* prevent duplicate employee relieving */
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

    /* attach logged-in user */
    if (req.user) {
      data.createdBy = req.user.id;
    }

    /* generate document number */
    const count = await RelievingLetter.countDocuments();

    data.documentNumber = `REL-${new Date().getFullYear()}-${String(
      count + 1
    ).padStart(4, "0")}`;

    const letter = await RelievingLetter.create(data);

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
      message: "Server error",
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
      "name email"
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