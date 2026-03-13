import express from "express";
import {
  createRelievingLetter,
  getAllRelievingLetters,
  getRelievingLetterById,
  updateRelievingLetter,
  deleteRelievingLetter,
} from "../documentController/relievingLetterController.js";

const relievingLetterRoutes = express.Router();


relievingLetterRoutes.post("/generate", createRelievingLetter);


relievingLetterRoutes.get("/all-letters", getAllRelievingLetters);


relievingLetterRoutes.get("/user/:id", getRelievingLetterById);


relievingLetterRoutes.put("/update/:id", updateRelievingLetter);


relievingLetterRoutes.delete("/delete/:id", deleteRelievingLetter);

export default relievingLetterRoutes;