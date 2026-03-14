import express from "express";
import appointmentLetterRoutes from "./appointmentLetterRoutes.js";
import experienceLetterRoutes from "./experienceLetterRoutes.js";
<<<<<<< HEAD
import fullAndFinalRouters from "./fullAndFinalRoutes.js";
import confirmationLetterRoutes from "./confirmationLetterRoutes.js";
import incrementLetterRoutes from "./incrementLetterRoutes.js";
import offerLetterRoutes from "./offerLetterRoutes.js";
import relievingLetterRoutes from "./relievingLetterRoutes.js";
import internshipCertificateRoutes from "./internshipCertificateRoutes.js";
import salarySlipRoutes from "./salarySlipRoutes.js";

const docRoutes = express.Router();

docRoutes.use("/appointment_letter", appointmentLetterRoutes)
docRoutes.use("/confirmation_letter",confirmationLetterRoutes)
docRoutes.use("/experience_letter", experienceLetterRoutes) 
docRoutes.use("/fullandfinal_letter", fullAndFinalRouters)
docRoutes.use("/increment_letter",incrementLetterRoutes)
docRoutes.use("/offer_letter",offerLetterRoutes)
docRoutes.use("/relieving_letter",relievingLetterRoutes)
docRoutes.use("/internshipcertificate_letter",internshipCertificateRoutes)
docRoutes.use("/salaryslip_letter",salarySlipRoutes)
=======
import relievingLetterRoutes from "./relievingLetterRoutes.js";
import completionLetterRoutes from "./completionCertificateRoutes.js";
import fullandfinalLetterRoutes from "./fullAndFinalRoutes.js";
import incrementLetterRoutes from "./incrementLetterRoutes.js";
import internshipLetterRoutes from "./internshipCertificateRoutes.js";
import offerLetterRoutes from "./offerLetterRoutes.js";
import salaryslipLetterRoutes from "./salarySlipRoutes.js";
import confirmationLetterRoutes from "./confirmationLetterRoutes.js";
const docRoutes = express.Router();

docRoutes.use("/appointment_letter", appointmentLetterRoutes);
docRoutes.use("/experience_letter", experienceLetterRoutes);
docRoutes.use("/relieving_letter", relievingLetterRoutes);
docRoutes.use("/completion_letter", completionLetterRoutes);
docRoutes.use("/fullandfinal_letter", fullandfinalLetterRoutes);
docRoutes.use("/increment_letter", incrementLetterRoutes);
docRoutes.use("/internship_letter", internshipLetterRoutes);
docRoutes.use("/offer_letter", offerLetterRoutes);
docRoutes.use("/salaryslip_letter", salaryslipLetterRoutes);
docRoutes.use("/confirmation_letter", confirmationLetterRoutes);
>>>>>>> 7986e84ca647eb300c95b161d244b7d8d65c5b45

export default docRoutes;
