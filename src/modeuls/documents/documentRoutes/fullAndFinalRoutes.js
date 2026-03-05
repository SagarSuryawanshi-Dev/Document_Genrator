import express from "express";

import {
  createFullAndFinalLetter,
  getAllFullAndFinalLetters,
  getFullAndFinalLetterById,
  updateFullAndFinalLetter,
  deleteFullAndFinalLetter,
} from "../documentController/fullandFinalLetterController.js";

const router = express.Router();

/* ================= CREATE ================= */
router.post("/", createFullAndFinalLetter);

/* ================= GET ALL ================= */
router.get("/", getAllFullAndFinalLetters);

/* ================= GET SINGLE ================= */
router.get("/:id", getFullAndFinalLetterById);

/* ================= UPDATE ================= */
router.put("/:id", updateFullAndFinalLetter);

/* ================= DELETE ================= */
router.delete("/:id", deleteFullAndFinalLetter);

export default router;