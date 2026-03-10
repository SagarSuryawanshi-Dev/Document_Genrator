import express from "express"
import { createAppointmentLetter, getAllAppointmentLetters, getAppointmentLetterById,updateAppointmentLetter, deleteAppointmentLetter } from "../documentController/appointmentLetterController.js"  
import {
  createOfferLetter,
  getAllOfferLetters,
  getOfferLetterById,
  updateOfferLetter,
  deleteOfferLetter,
} from "../documentController/offerLetterController.js";

const router = express.Router()

// generate documents routes
router.post("/generate_appointment_letter", createAppointmentLetter) // Appintment Letter
router.post("/generate_offer_letter",   createOfferLetter) // Offer Letter

// get documents routes


// get documents routes
router.get("/appointment_letters", getAllAppointmentLetters)
router.get("/appointment_letter/:id",getAppointmentLetterById)
router.get("/offer_letters", getAllOfferLetters)
router.get("/offer_letter/:id",getOfferLetterById)

// update documents routes
router.put("/appointment_letter/:id", updateAppointmentLetter);
router.put("/offer_letter/:id", updateOfferLetter);


// delete documents routes
router.delete("/delete_appointment_letter/:id",deleteAppointmentLetter);
router.delete("/delete_offer_letter/:id",deleteOfferLetter);

export default router;