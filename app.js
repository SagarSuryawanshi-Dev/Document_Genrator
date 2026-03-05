
import express from "express";
import dotenv from "dotenv";
import dbConnection from "./src/config/db.js";
import appointmentRoutes from "./src/modeuls/documents/documentRoutes/appointmentLetterRoutes.js";
import userRoutes from "./src/user/user.routes.js";
import adminRoutes from "./src/admin/admin.router.js";
import offerLetterRoutes from "./src/modeuls/documents/documentRoutes/offerLetterRoutes.js";
import experienceLetterRoutes from "./src/modeuls/documents/documentRoutes/experienceLetterRoutes.js";
import fullAndFinalRoutes from "./src/modeuls/documents/documentRoutes/fullAndFinalRoutes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();
dbConnection();

/* ================= ROUTES ================= */
app.use("/api/v1/appointment-letter", appointmentRoutes);
app.use("/api/v1/offer-letter", offerLetterRoutes);
app.use("/api/v1/experience-letter", experienceLetterRoutes);
app.use("/api/v1/fnf", fullAndFinalRoutes);
// Routes


app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin", adminRoutes)

app.get("/", (req, res) => {
  res.json("Doc_Gen_Backend");
});

export default app;