// import express from "express";
// import dotenv from "dotenv";
// import dns from "dns";
// import cors from "cors";
// import cookieParser from "cookie-parser"; // ← ADD THIS
// import dbConnection from "./src/config/db.js";
// import userRoutes from "./src/user/user.routes.js";
// import adminRoutes from "./src/admin/admin.router.js";
// import documentsRoutes from "./src/modeuls/documents/documentRoutes/documentsRoutes.js";
// import errorHandler from "./src/middlewares/errorHandler.js";

// const app = express();

// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser()); // ← ADD THIS LINE (before routes!)

// const allowedOrigins = [
//   // "http://localhost:5173",
//   // "http://localhost:5174",
//   "https://doc-gen-frontend-flame.vercel.app"
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true
// }));

// dns.setServers([
//   '1.1.1.1',
//   '8.8.8.8'
// ]);

// dotenv.config();
// dbConnection();

// app.use(express.json());
// // Routes
// app.use("/api/v1/users", userRoutes);
// app.use("/api/v1/admin", adminRoutes);
// app.use("/api/v1/documents", documentsRoutes);

// // Error handler must be LAST
// app.use(errorHandler);
// app.get("/", (req, res) => {
//   res.json("Doc_Gen_Backend");
// });

// export default app;







import express from "express";
import dotenv from "dotenv";
import dns from "dns";
import cors from "cors";
import cookieParser from "cookie-parser";

import dbConnection from "./src/config/db.js";
import userRoutes from "./src/user/user.routes.js";
import adminRoutes from "./src/admin/admin.router.js";
import documentsRoutes from "./src/modeuls/documents/documentRoutes/documentsRoutes.js";
import errorHandler from "./src/middlewares/errorHandler.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://doc-gen-frontend-flame.vercel.app"
];

// Debug origin logging
app.use((req, res, next) => {
  console.log("Origin:", req.headers.origin);
  next();
});

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman, mobile apps, server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With"
    ]
  })
);

// Handle preflight requests
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

dns.setServers([
  "1.1.1.1",
  "8.8.8.8"
]);

dbConnection();

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/documents", documentsRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Doc_Gen_Backend"
  });
});

// Error handler must be last
app.use(errorHandler);

export default app;