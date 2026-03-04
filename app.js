import express from "express";
import dotenv from "dotenv";

dotenv.config(); // ← FIRST

import dbConnection from "./src/config/db.js";
import userRoutes from "./src/user/user.routes.js";
import adminRoutes from "./src/admin/admin.router.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB
dbConnection();

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin", adminRoutes)

app.get("/", (req, res) => {
  res.json("Doc_Gen_Backend");
});

export default app;