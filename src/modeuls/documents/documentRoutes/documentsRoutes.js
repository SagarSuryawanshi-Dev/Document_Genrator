import express from "express";
import appointmentLetterRoutes from "./appointmentLetterRoutes.js";
import experienceLetterRoutes from "./experienceLetterRoutes.js";
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

export default docRoutes;
