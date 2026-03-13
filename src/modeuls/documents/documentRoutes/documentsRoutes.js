import express from "express"
import appointmentLetterRoutes from "./appointmentLetterRoutes.js";
import completionCertificateRoutes from "./completionCertificateRoutes.js";

const docRoutes = express.Router();

docRoutes.use("/appointment_letter", appointmentLetterRoutes)
docRoutes.use("/completion_certificate", completionCertificateRoutes)


export default docRoutes;