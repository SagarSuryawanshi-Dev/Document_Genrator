import express from "express";

import {
  createExperienceLetter,
  getAllExperienceLetters,
  getExperienceLetterById,
  updateExperienceLetter,
  deleteExperienceLetter,
} from "../documentController/experienceLetterController.js";

const router = express.Router();

router.post("/", createExperienceLetter);

router.get("/", getAllExperienceLetters);

router.get("/:id", getExperienceLetterById);

router.put("/:id", updateExperienceLetter);

router.delete("/:id", deleteExperienceLetter);

export default router;