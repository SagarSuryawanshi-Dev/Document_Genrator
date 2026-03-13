import express from "express";
import {
  createRelievingLetter,
  getAllRelievingLetters,
  getRelievingLetterById,
  updateRelievingLetter,
  deleteRelievingLetter,
} from "../documentController/relievingLetterController.js";

const relievingLetterRoutes = express.Router();


// generate letter
relievingLetterRoutes.post("/generate", createRelievingLetter);

// get all letter
relievingLetterRoutes.get("/all-letters", getAllRelievingLetters);

// get letter by id
relievingLetterRoutes.get("/user/:id", getRelievingLetterById);

// update letter
relievingLetterRoutes.put("/update/:id", updateRelievingLetter);

// delete letter
relievingLetterRoutes.delete("/delete/:id", deleteRelievingLetter);

export default relievingLetterRoutes;