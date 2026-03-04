// import OfferLetter from "../documentModel/OfferLetter.js";

// /* ================= CREATE ================= */
// export const createOfferLetter = async (req, res) => {
//   try {
//     const obj = req.body;

//     if (!body || Object.keys(body).length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Request body is missing",
//       });
//     }

//     const requiredFields = [
//       "company",
//       "mrms",
//       "candidateName",
//       "position",
//       "department",
//       "employmentType",
//       "joiningDate",
//       "salary",
//       "location",
//       "reportingManager",
//       "offerValidTill",
//       "offerType",
//       "issueDate",
//     ];

//     const missingFields = requiredFields.filter(
//       (field) => !body[field]
//     );

//     if (missingFields.length > 0) {
//       return res.status(400).json({
//         success: false,
//         message: `Missing required fields: ${missingFields.join(", ")}`,
//       });
//     }

//     // ✅ Prevent duplicate offer for same candidate + joining date + company
//     const exists = await OfferLetter.findOne({
//       company: body.company,
//       candidateName: body.candidateName,
//       joiningDate: body.joiningDate,
//     });

//     if (exists) {
//       return res.status(409).json({
//         success: false,
//         message:
//           "Offer letter already exists for this candidate and joining date",
//       });
//     }

//     const letter = await OfferLetter.create({
//       ...body,
//       documentNumber: `OL-${Date.now()}`, // 🔥 UNIQUE
//     });

//     res.status(201).json({
//       success: true,
//       message: "Offer letter created successfully",
//       data: letter,
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// /* ================= READ ALL ================= */
// export const getAllOfferLetters = async (req, res) => {
//   try {
//     const letters = await OfferLetter.find()
//       .populate("company")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       count: letters.length,
//       data: letters,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// /* ================= READ ONE ================= */
// export const getOfferLetterById = async (req, res) => {
//   try {
//     const letter = await OfferLetter.findById(req.params.id).populate(
//       "company"
//     );

//     if (!letter) {
//       return res.status(404).json({
//         success: false,
//         message: "Offer letter not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: letter,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: "Invalid offer letter ID",
//     });
//   }
// };

// /* ================= UPDATE ================= */
// export const updateOfferLetter = async (req, res) => {
//   try {
//     const updated = await OfferLetter.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true, runValidators: true }
//     );

//     if (!updated) {
//       return res.status(404).json({
//         success: false,
//         message: "Offer letter not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Offer letter updated successfully",
//       data: updated,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// /* ================= DELETE ================= */
// export const deleteOfferLetter = async (req, res) => {
//   try {
//     const deleted = await OfferLetter.findByIdAndDelete(req.params.id);

//     if (!deleted) {
//       return res.status(404).json({
//         success: false,
//         message: "Offer letter not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "Offer letter deleted successfully",
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };







import OfferLetter from "../documentModel/OfferLetter.js";

/* ================= CREATE ================= */

export const createOfferLetter = async (req, res) => {
  try {
    const body = req.body;

    /* 🔒 BODY CHECK */
    if (!body || Object.keys(body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body is missing",
      });
    }

    /* 🔒 REQUIRED FIELDS */
    const requiredFields = [
      "company",
      "issuedTo",
      "mrms",
      "candidateName",
      "position",
      "department" ,
      "employmentType",
      "joiningDate",
      "salary",
      "location",
      "reportingManager",
      "offerValidTill",
      "offerType",
      "issueDate",
    ];

    const missingFields = requiredFields.filter(
      (field) => body[field] === undefined || body[field] === null
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    /* 🔒 DUPLICATE CHECK */
    const exists = await OfferLetter.findOne({
      company: body.company,
      candidateName: body.candidateName.trim(),
      joiningDate: body.joiningDate,
    });

    if (exists) {
      return res.status(409).json({
        success: false,
        message:
          "Offer letter already exists for this candidate and joining date",
      });
    }

    /* ✅ CREATE */
    const letter = await OfferLetter.create({
      ...body,
      candidateName: body.candidateName.trim(),
      documentNumber: `OL-${Date.now()}`, // unique
      status: body.status || "Draft",
    });

    return res.status(201).json({
      success: true,
      message: "Offer letter created successfully",
      data: letter,
    });
  } catch (error) {
    console.error("CREATE OFFER LETTER ERROR:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate offer letter detected",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* ================= READ ALL ================= */
export const getAllOfferLetters = async (req, res) => {
  try {
    const letters = await OfferLetter.find()
      .populate("company")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: letters.length,
      data: letters,
    });
  } catch (error) {
    console.error("GET ALL OFFER LETTERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= READ ONE ================= */
export const getOfferLetterById = async (req, res) => {
  try {
    const letter = await OfferLetter.findById(req.params.id).populate(
      "company"
    );

    if (!letter) {
      return res.status(404).json({
        success: false,
        message: "Offer letter not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: letter,
    });
  } catch (error) {
    console.error("GET OFFER LETTER ERROR:", error);

    return res.status(400).json({
      success: false,
      message: "Invalid offer letter ID",
    });
  }
};

/* ================= UPDATE ================= */
export const updateOfferLetter = async (req, res) => {
  try {
    const updated = await OfferLetter.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Offer letter not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Offer letter updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("UPDATE OFFER LETTER ERROR:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate data conflict",
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= DELETE ================= */
export const deleteOfferLetter = async (req, res) => {
  try {
    const deleted = await OfferLetter.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Offer letter not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Offer letter deleted successfully",
    });
  } catch (error) {
    console.error("DELETE OFFER LETTER ERROR:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};