import express from "express";

import {
  createExperienceLetter,
  getAllExperienceLetters,
  getExperienceLetterById,
  updateExperienceLetter,
  deleteExperienceLetter,
} from "../documentController/experienceLetterController.js";

const experienceLetterRoutes = express.Router();


experienceLetterRoutes.post("/generate", createExperienceLetter);


experienceLetterRoutes.get("/all-letters", getAllExperienceLetters);


experienceLetterRoutes.get("/user/:id", getExperienceLetterById);


experienceLetterRoutes.put("/update/:id", updateExperienceLetter);


experienceLetterRoutes.delete("/delete/:id", deleteExperienceLetter);

export default experienceLetterRoutes;