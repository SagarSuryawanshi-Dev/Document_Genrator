import express from "express";
import { 
  Register,
  Login, 
  Logout,
  GetProfile,
  UpdateProfile
} from "./user.controller.js";

const router = express.Router();

// PUBLIC ROUTES
router.post("/register", Register);
router.post("/login", Login);
router.post("/logout", Logout);

// Profile routes with userId parameter
router.get("/profile/:userId", GetProfile);
router.put("/profile/:userId", UpdateProfile);

export default router;  