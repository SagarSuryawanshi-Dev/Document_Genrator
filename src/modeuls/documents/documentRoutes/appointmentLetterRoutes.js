import express from "express";
import  {protect}  from "../../../middlewares/auth.middleware.js";
import {
  createAppointmentLetter,
  getAllAppointmentLetters,
  getAppointmentLetterById,
  updateAppointmentLetter,
  deleteAppointmentLetter,
} from "../documentController/appointmentLetterController.js";

const appointmentLetterRoutes = express.Router();

// generate appointment letter
appointmentLetterRoutes.post("/generate",protect, createAppointmentLetter);

// get all appointment letter
appointmentLetterRoutes.get("/all-letters", getAllAppointmentLetters);

// get appointment letter by id
appointmentLetterRoutes.get("/user/:id", getAppointmentLetterById);

// update appointment letter
appointmentLetterRoutes.put("/update/:id", updateAppointmentLetter);

// delete appointment letter
appointmentLetterRoutes.delete("/delete/:id", deleteAppointmentLetter);

export default appointmentLetterRoutes;
