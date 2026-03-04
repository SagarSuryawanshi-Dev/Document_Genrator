import express from "express";
import { Login,Logout } from "./user.controller.js";

const router = express.Router();


router.post("/login", Login);
router.post("/logout/:id", Logout);

export default router;
