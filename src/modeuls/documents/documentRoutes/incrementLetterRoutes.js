import express from "express";
import {
  createIncrementLetter,
  getAllIncrementLetters,
  getIncrementLetterById,
  updateIncrementLetter,
  deleteIncrementLetter,
} from "../documentController/incrementLetterController.js";

const incrementLetterRoutes = express.Router();

// generate letter
incrementLetterRoutes.post("/generate", createIncrementLetter);

// get all letter
incrementLetterRoutes.get("/all-letters", getAllIncrementLetters);

// get letter by id
incrementLetterRoutes.get("/user/:id", getIncrementLetterById);

// update letter
incrementLetterRoutes.put("/update/:id", updateIncrementLetter);

// delete letter
incrementLetterRoutes.delete("/delete/:id", deleteIncrementLetter);

export default incrementLetterRoutes;