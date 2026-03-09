import express from "express";
import {
  createRelievingLetter,
  getAllRelievingLetters,
  getRelievingLetterById,
  updateRelievingLetter,
  deleteRelievingLetter,
} from "../documentController/relievingLetterController.js";

const router = express.Router();

router.post("/", createRelievingLetter);
router.get("/", getAllRelievingLetters);
router.get("/:id", getRelievingLetterById);
router.put("/:id", updateRelievingLetter);
router.delete("/:id", deleteRelievingLetter);

export default router;