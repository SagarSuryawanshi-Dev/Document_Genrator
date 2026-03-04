// import express from "express";
// import dotenv from "dotenv";
// import dbConnection from "./src/config/db.js";
// import appointmentRoutes from "./src/modeuls/documents/documentRoutes/appointmentLetterRoutes.js";
// const app = express();

// dotenv.config();
// dbConnection();

// app.use('/api/appointment-letter', appointmentRoutes);
// app.get("/api", (req, res) => {
//   res.json("Doc_Gen_Backend");
// });

// export default app;






import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import dbConnection from "./src/config/db.js";
import appointmentRoutes from "./src/modeuls/documents/documentRoutes/appointmentLetterRoutes.js";

dotenv.config();

const app = express();

/* ================= MIDDLEWARE (MUST BE FIRST) ================= */
app.use(cors());
app.use(express.json()); // ✅ REQUIRED FOR req.body
app.use(express.urlencoded({ extended: true }));

/* ================= DATABASE ================= */
dbConnection();

/* ================= ROUTES ================= */
app.use("/api/appointment-letter", appointmentRoutes);

app.get("/api", (req, res) => {
  res.json("Doc_Gen_Backend");
});

export default app;