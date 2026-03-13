import express from "express";
import {
  createOfferLetter,
  getAllOfferLetters,
  getOfferLetterById,
  updateOfferLetter,
  deleteOfferLetter,
} from "../documentController/offerLetterController.js";

const offerLetterRoutes = express.Router();


// generate letter
offerLetterRoutes.post("/generate", createOfferLetter);

// get all  letter
offerLetterRoutes.get("/all-letters", getAllOfferLetters);

// get letter by id
offerLetterRoutes.get("/user/:id", getOfferLetterById);

// update letter
offerLetterRoutes.put("/update/:id", updateOfferLetter);

// delete letter
offerLetterRoutes.delete("/delete/:id", deleteOfferLetter);

export default offerLetterRoutes;