
import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import dbConnection from "./src/config/db.js";
import userRoutes from "./src/user/user.routes.js";
import adminRoutes from "./src/admin/admin.router.js";
import dns from "dns"
import docRoutes from "./src/modeuls/documents/documentRoutes/documentsRoutes.js"

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin:["http://localhost:5173","http://localhost:5174"],
  methods:["GET", "POST", "PUT", "DELETE"],
  credentials:true

}))

dns.setServers([
  '1.1.1.1',
  '8.8.8.8'
])

dotenv.config();
dbConnection();

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin", adminRoutes)
app.use("/api/v1/documents", docRoutes);

app.get("/", (req, res) => {
  res.json("Doc_Gen_Backend");
});

export default app;