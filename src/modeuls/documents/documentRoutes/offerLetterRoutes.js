import express from "express";
import {
  createOfferLetter,
  getAllOfferLetters,
  getOfferLetterById,
  updateOfferLetter,
  deleteOfferLetter,
} from "../documentController/offerLetterController.js";

const offerLetterRoutes = express.Router();


offerLetterRoutes.post("/generate", createOfferLetter);


offerLetterRoutes.get("/all-letters", getAllOfferLetters);


offerLetterRoutes.get("/user/:id", getOfferLetterById);


offerLetterRoutes.put("/update/:id", updateOfferLetter);


offerLetterRoutes.delete("/delete/:id", deleteOfferLetter);

export default offerLetterRoutes;