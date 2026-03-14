import express from "express";
import {
  createConfirmationLetter,
  getAllConfirmationLetters,
  getConfirmationLetterById,
  updateConfirmationLetter,
  deleteConfirmationLetter,
} from "../documentController/confirmationLetterController.js";

const confirmationLetterRoutes = express.Router();

/* CREATE */
confirmationLetterRoutes.post("/generate", createConfirmationLetter);


confirmationLetterRoutes.get("/all-letters", getAllConfirmationLetters);


confirmationLetterRoutes.get("/user/:id", getConfirmationLetterById);


confirmationLetterRoutes.put("/update/:id", updateConfirmationLetter);


confirmationLetterRoutes.delete("/delete/:id", deleteConfirmationLetter);



export default confirmationLetterRoutes;
