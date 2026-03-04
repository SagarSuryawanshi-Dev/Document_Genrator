import express from "express";
import { Login } from "./user.controller.js";

const router = express.Router();


router.post("/login", Login);

export default router;
