import express from "express";
import {
  createConfirmationLetter,
  getAllConfirmationLetters,
  getConfirmationLetterById,
  updateConfirmationLetter,
  deleteConfirmationLetter,
} from "../documentController/confirmationLetterController.js";

const confirmationLetterRouters = express.Router();

<<<<<<< HEAD
confirmationLetterRouters.post("/generate", createConfirmationLetter);
=======
/* CREATE */
router.post("/", createConfirmationLetter);
>>>>>>> 7986e84ca647eb300c95b161d244b7d8d65c5b45


confirmationLetterRouters.get("/all-letters", getAllConfirmationLetters);


confirmationLetterRouters.get("/user/:id", getConfirmationLetterById);

<<<<<<< HEAD

confirmationLetterRouters.put("/update/:id", updateConfirmationLetter);


confirmationLetterRouters.delete("/delete/:id", deleteConfirmationLetter);

export default confirmationLetterRouters;
=======
export default router;
>>>>>>> 7986e84ca647eb300c95b161d244b7d8d65c5b45
