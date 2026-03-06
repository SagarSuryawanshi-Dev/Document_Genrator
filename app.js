
import express from "express";
import dotenv from "dotenv";
import dbConnection from "./src/config/db.js";
import userRoutes from "./src/user/user.routes.js";
import adminRoutes from "./src/admin/admin.router.js";
import documentsRoutes from "./src/modeuls/documents/documentRoutes/documentsRoutes.js"
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();
dbConnection();

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin", adminRoutes)
app.use("/api/v1/documents", documentsRoutes);

app.get("/", (req, res) => {
  res.json("Doc_Gen_Backend");
});

export default app;