import express from "express";
import  {protect}  from "../../../middlewares/auth.middleware.js";
import {
  createRelievingLetter,
  getAllRelievingLetters,
  getRelievingLetterById,
  updateRelievingLetter,
  deleteRelievingLetter,
} from "../documentController/relievingLetterController.js";

const relievingLetterRoutes = express.Router();


relievingLetterRoutes.post("/generate",protect ,createRelievingLetter);


relievingLetterRoutes.get("/all-letters", getAllRelievingLetters);


relievingLetterRoutes.get("/user/:id", getRelievingLetterById);


relievingLetterRoutes.put("/update/:id", updateRelievingLetter);


relievingLetterRoutes.delete("/delete/:id", deleteRelievingLetter);

export default relievingLetterRoutes;