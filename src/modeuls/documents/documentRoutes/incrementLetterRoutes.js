import express from "express";
import {
  createIncrementLetter,
  getAllIncrementLetters,
  getIncrementLetterById,
  updateIncrementLetter,
  deleteIncrementLetter,
} from "../documentController/incrementLetterController.js";

const router = express.Router();

router.post("/", createIncrementLetter);
router.get("/", getAllIncrementLetters);
router.get("/:id", getIncrementLetterById);
router.put("/:id", updateIncrementLetter);
router.delete("/:id", deleteIncrementLetter);

export default router;