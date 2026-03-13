import express from "express";
import appointmentLetterRoutes from "./appointmentLetterRoutes.js";
import experienceLetterRoutes from "./experienceLetterRoutes.js";
import relievingLetterRoutes from "./relievingLetterRoutes.js";
import completionLetterRoutes from "./completionCertificateRoutes.js";
const docRoutes = express.Router();

docRoutes.use("/appointment_letter", appointmentLetterRoutes);
docRoutes.use("/experience_letter", experienceLetterRoutes);
docRoutes.use("/relieving_letter", relievingLetterRoutes);
docRoutes.use("/completion_letter", completionLetterRoutes);

export default docRoutes;
