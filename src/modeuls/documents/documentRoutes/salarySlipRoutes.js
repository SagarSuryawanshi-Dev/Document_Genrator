import express from "express";
import {
  createSalarySlip,
  getAllSalarySlips,
  getSalarySlipById,
  updateSalarySlip,
  deleteSalarySlip,
} from "../documentController/SalarySlipController.js";

const salarySlipRoutes = express.Router();


salarySlipRoutes.post("/generate", createSalarySlip);


salarySlipRoutes.get("/all-letters", getAllSalarySlips);


salarySlipRoutes.get("/user/:id", getSalarySlipById);

salarySlipRoutes.put("/update/:id", updateSalarySlip);


salarySlipRoutes.delete("/delete/:id", deleteSalarySlip);

export default salarySlipRoutes;