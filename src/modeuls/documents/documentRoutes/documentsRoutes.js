import express from "express"
// AppointmentLetter
import { createAppointmentLetter, getAllAppointmentLetters, getAppointmentLetterById,updateAppointmentLetter, deleteAppointmentLetter } from "../documentController/appointmentLetterController.js"  

// completionCertificate
import { createCompletionCertificate } from "../documentController/completionCertificateController.js"



const router = express.Router()

// generate documents routes
router.post("/generate_appointment_letter", createAppointmentLetter) // Appintment Letter
router.post("/generate_completion_certificate", createCompletionCertificate)


// get documents routes
router.get("/appointment_letters", getAllAppointmentLetters)
router.get("/appointment_letter/:id",getAppointmentLetterById)


// update documents routes
router.put("/appointment_letter/:id", updateAppointmentLetter);



// delete documents routes
router.delete("/delete_appointment_letter/:id",deleteAppointmentLetter);


export default router;