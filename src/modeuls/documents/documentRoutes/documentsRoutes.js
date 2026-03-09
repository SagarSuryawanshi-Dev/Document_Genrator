import express from "express"
import { createAppointmentLetter, getAllAppointmentLetters, getAppointmentLetterById,updateAppointmentLetter, deleteAppointmentLetter } from "../documentController/appointmentLetterController.js"  



const router = express.Router()

// generate documents routes
router.post("/generate_appointment_letter", createAppointmentLetter) // Appintment Letter


// get documents routes
router.get("/appointment_letters", getAllAppointmentLetters)
router.get("/appointment_letter/:id",getAppointmentLetterById)


// update documents routes
router.put("/appointment_letter/:id", updateAppointmentLetter);



// delete documents routes
router.delete("/delete_appointment_letter/:id",deleteAppointmentLetter);


export default router;