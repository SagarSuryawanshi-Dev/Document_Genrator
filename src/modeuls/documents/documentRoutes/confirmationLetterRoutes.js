import express from "express";
import {
  createConfirmationLetter,
  getAllConfirmationLetters,
  getConfirmationLetterById,
  updateConfirmationLetter,
  deleteConfirmationLetter,
} from "../documentController/confirmationLetterController.js";

const confirmationLetterRouters = express.Router();

/* CREATE */
confirmationLetterRouters.post("/generate", createConfirmationLetter);

/* GET ALL */
confirmationLetterRouters.get("/all-letters", getAllConfirmationLetters);

/* GET BY ID */
confirmationLetterRouters.get("/user/:id", getConfirmationLetterById);

/* UPDATE */
confirmationLetterRouters.put("/update/:id", updateConfirmationLetter);

/* DELETE */
confirmationLetterRouters.delete("/delete/:id", deleteConfirmationLetter);

export default confirmationLetterRouters;