
import express from "express";
import dotenv from "dotenv";
import dbConnection from "./src/config/db.js";
import appointmentRoutes from "./src/modeuls/documents/documentRoutes/appointmentLetterRoutes.js";
import userRoutes from "./src/user/user.routes.js";
import adminRoutes from "./src/admin/admin.router.js";
import offerLetterRoutes from "./src/modeuls/documents/documentRoutes/offerLetterRoutes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();
dbConnection();

/* ================= ROUTES ================= */
app.use("/api/appointment-letter", appointmentRoutes);
app.use("/api/offer-letter", offerLetterRoutes);

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin", adminRoutes)

app.get("/", (req, res) => {
  res.json("Doc_Gen_Backend");
});

export default app;