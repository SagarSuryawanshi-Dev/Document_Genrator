import express from "express";
import {
  createAppointmentLetter,
  getAllAppointmentLetters,
  getAppointmentLetterById,
  updateAppointmentLetter,
  deleteAppointmentLetter,
} from "../documentController/appointmentLetterController.js";

const router = express.Router();

router.post("/", createAppointmentLetter);
router.get("/", getAllAppointmentLetters);
router.get("/:id", getAppointmentLetterById);
router.put("/:id", updateAppointmentLetter);
router.delete("/:id", deleteAppointmentLetter);

export default router;