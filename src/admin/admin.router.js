import express from "express"
import {Signup,getAllUsers} from "./admin.controller.js"

const router = express.Router();

router.post("/signup", Signup)
router.get("/users", getAllUsers)

export default router




