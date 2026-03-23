import express from "express";
import  {protect}  from "../../../middlewares/auth.middleware.js";

import {
  createFullAndFinalLetter,
  getAllFullAndFinalLetters,
  getFullAndFinalLetterById,
  updateFullAndFinalLetter,
  deleteFullAndFinalLetter,
} from "../documentController/fullandFinalLetterController.js";

const fullAndFinalRouters = express.Router();


fullAndFinalRouters.post("/generate",protect, createFullAndFinalLetter);

fullAndFinalRouters.get("/all-letters", getAllFullAndFinalLetters);


fullAndFinalRouters.get("/user/:id", getFullAndFinalLetterById);


fullAndFinalRouters.put("/update/:id", updateFullAndFinalLetter);


fullAndFinalRouters.delete("/delete/:id", deleteFullAndFinalLetter);

export default fullAndFinalRouters;