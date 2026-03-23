import express from "express";
import { 
  Login, 
  Logout,
  GetProfile,
  UpdateProfile
} from "./user.controller.js";

const router = express.Router();

// PUBLIC ROUTES

router.post("/login", Login);
router.post("/logout", Logout);

// Profile routes with userId parameter
router.get("/profile/:userId", GetProfile);
router.put("/profile/:userId", UpdateProfile);

export default router;
