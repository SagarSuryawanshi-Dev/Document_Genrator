import express from "express";
import appointmentLetterRoutes from "./appointmentLetterRoutes.js";
import completionCertificateRoutes from "./completionCertificateRoutes.js";
import experienceLetterRoutes from "./experienceLetterRoutes.js";
import fullAndFinalRouters from "./fullAndFinalRoutes.js";
import confirmationLetterRoutes from "./confirmationLetterRoutes.js";
import incrementLetterRoutes from "./incrementLetterRoutes.js";
import offerLetterRoutes from "./offerLetterRoutes.js";
import relievingLetterRoutes from "./relievingLetterRoutes.js";
import internshipCertificateRoutes from "./internshipCertificateRoutes.js";
import salarySlipRoutes from "./salarySlipRoutes.js";
import getAllDocuments from "../documentController/getAllDocumentsController.js"

const docRoutes = express.Router();

docRoutes.use("/appointment_letter", appointmentLetterRoutes)
docRoutes.use("/completion_certificate",completionCertificateRoutes)
docRoutes.use("/confirmation_letter",confirmationLetterRoutes)
docRoutes.use("/experience_letter", experienceLetterRoutes) 
docRoutes.use("/fullandfinal_letter", fullAndFinalRouters)
docRoutes.use("/increment_letter",incrementLetterRoutes)
docRoutes.use("/offer_letter",offerLetterRoutes)
docRoutes.use("/relieving_letter",relievingLetterRoutes)
docRoutes.use("/internshipcertificate_letter",internshipCertificateRoutes)
docRoutes.use("/salaryslip_letter",salarySlipRoutes)
docRoutes.get("/getalldoc",getAllDocuments)

export default docRoutes;
