import express from "express";
import  {protect}  from "../../../middlewares/auth.middleware.js";
import {
  createOfferLetter,
  getAllOfferLetters,
  getOfferLetterById,
  updateOfferLetter,
  deleteOfferLetter,
} from "../documentController/offerLetterController.js";

const offerLetterRoutes = express.Router();


offerLetterRoutes.post("/generate",protect, createOfferLetter);


offerLetterRoutes.get("/all-letters", getAllOfferLetters);


offerLetterRoutes.get("/user/:id", getOfferLetterById);


offerLetterRoutes.put("/update/:id", updateOfferLetter);


offerLetterRoutes.delete("/delete/:id", deleteOfferLetter);

export default offerLetterRoutes;