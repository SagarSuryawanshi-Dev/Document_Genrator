import express from "express"
import appointmentLetterRoutes from "./appointmentLetterRoutes.js";

const docRoutes = express.Router();

docRoutes.use("/appointment_letter", appointmentLetterRoutes)


export default docRoutes;