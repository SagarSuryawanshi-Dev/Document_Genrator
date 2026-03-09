import express from "express";
import {
  createSalarySlip,
  getAllSalarySlips,
  getSalarySlipById,
  updateSalarySlip,
  deleteSalarySlip,
} from "../documentController/SalarySlipController.js";

const router = express.Router();

router.post("/", createSalarySlip);
router.get("/", getAllSalarySlips);
router.get("/:id", getSalarySlipById);
router.put("/:id", updateSalarySlip);
router.delete("/:id", deleteSalarySlip);

export default router;