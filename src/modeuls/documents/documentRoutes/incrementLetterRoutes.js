import express from "express";
import {
  createIncrementLetter,
  getAllIncrementLetters,
  getIncrementLetterById,
  updateIncrementLetter,
  deleteIncrementLetter,
} from "../documentController/incrementLetterController.js";

const incrementLetterRoutes = express.Router();


incrementLetterRoutes.post("/generate", createIncrementLetter);


incrementLetterRoutes.get("/all-letters", getAllIncrementLetters);


incrementLetterRoutes.get("/user/:id", getIncrementLetterById);


incrementLetterRoutes.put("/update/:id", updateIncrementLetter);

// delete letter
incrementLetterRoutes.delete("/delete/:id", deleteIncrementLetter);

export default incrementLetterRoutes;