import express from "express";

import {
  createExperienceLetter,
  getAllExperienceLetters,
  getExperienceLetterById,
  updateExperienceLetter,
  deleteExperienceLetter,
} from "../documentController/experienceLetterController.js";

const experienceLetterRoutes = express.Router();

/* CREATE */
experienceLetterRoutes.post("/generate", createExperienceLetter);

/* GET ALL */
experienceLetterRoutes.get("/all-letters", getAllExperienceLetters);

/* GET BY ID */
experienceLetterRoutes.get("/user/:id", getExperienceLetterById);

/* UPDATE */
experienceLetterRoutes.put("/update/:id", updateExperienceLetter);

/* DELETE */
experienceLetterRoutes.delete("/delete/:id", deleteExperienceLetter);

export default experienceLetterRoutes;