import express from "express";
import {
  createConfirmationLetter,
  getAllConfirmationLetters,
  getConfirmationLetterById,
  updateConfirmationLetter,
  deleteConfirmationLetter,
} from "../documentController/confirmationLetterController.js";

const router = express.Router();

/* CREATE */
router.post("/create", createConfirmationLetter);

/* GET ALL */
router.get("/", getAllConfirmationLetters);

/* GET BY ID */
router.get("/:id", getConfirmationLetterById);

/* UPDATE */
router.put("/update/:id", updateConfirmationLetter);

/* DELETE */
router.delete("/delete/:id", deleteConfirmationLetter);

export default router;