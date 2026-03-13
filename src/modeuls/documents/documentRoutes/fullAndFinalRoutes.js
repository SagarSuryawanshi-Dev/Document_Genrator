import express from "express";

import {
  createFullAndFinalLetter,
  getAllFullAndFinalLetters,
  getFullAndFinalLetterById,
  updateFullAndFinalLetter,
  deleteFullAndFinalLetter,
} from "../documentController/fullandFinalLetterController.js";

const fullAndFinalRouters = express.Router();

/* ================= CREATE ================= */
fullAndFinalRouters.post("/generate", createFullAndFinalLetter);

/* ================= GET ALL ================= */
fullAndFinalRouters.get("/all-letters", getAllFullAndFinalLetters);

/* ================= GET SINGLE ================= */
fullAndFinalRouters.get("/user/:id", getFullAndFinalLetterById);

/* ================= UPDATE ================= */
fullAndFinalRouters.put("/update/:id", updateFullAndFinalLetter);

/* ================= DELETE ================= */
fullAndFinalRouters.delete("/delete/:id", deleteFullAndFinalLetter);

export default fullAndFinalRouters;