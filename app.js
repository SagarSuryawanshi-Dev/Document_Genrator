
import express from "express";
import dotenv from "dotenv";
import dbConnection from "./src/config/db.js";
import appointmentRoutes from "./src/modeuls/documents/documentRoutes/appointmentLetterRoutes.js";
import userRoutes from "./src/user/user.routes.js";
import adminRoutes from "./src/admin/admin.router.js";

const app = express();

dotenv.config();
dbConnection();

/* ================= ROUTES ================= */
app.use("/api/appointment-letter", appointmentRoutes);

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin", adminRoutes)

app.get("/", (req, res) => {
  res.json("Doc_Gen_Backend");
});

export default app;