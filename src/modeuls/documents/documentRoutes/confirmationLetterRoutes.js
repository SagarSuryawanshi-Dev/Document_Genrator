import express from "express";
import {
  createConfirmationLetter,
  getAllConfirmationLetters,
  getConfirmationLetterById,
  updateConfirmationLetter,
  deleteConfirmationLetter,
} from "../documentController/confirmationLetterController.js";

const confirmationLetterRouters = express.Router();

confirmationLetterRouters.post("/generate", createConfirmationLetter);


confirmationLetterRouters.get("/all-letters", getAllConfirmationLetters);


confirmationLetterRouters.get("/user/:id", getConfirmationLetterById);


confirmationLetterRouters.put("/update/:id", updateConfirmationLetter);


confirmationLetterRouters.delete("/delete/:id", deleteConfirmationLetter);

export default confirmationLetterRouters;