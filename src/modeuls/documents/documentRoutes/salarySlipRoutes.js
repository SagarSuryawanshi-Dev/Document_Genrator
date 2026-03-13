import express from "express";
import {
  createSalarySlip,
  getAllSalarySlips,
  getSalarySlipById,
  updateSalarySlip,
  deleteSalarySlip,
} from "../documentController/SalarySlipController.js";

const salarySlipRoutes = express.Router();

// generate letter
salarySlipRoutes.post("/generate", createSalarySlip);

// get all letter
salarySlipRoutes.get("/all-letters", getAllSalarySlips);

// get letter by id
salarySlipRoutes.get("/user/:id", getSalarySlipById);

// update letter
salarySlipRoutes.put("/update/:id", updateSalarySlip);

// delete letter
salarySlipRoutes.delete("/delete/:id", deleteSalarySlip);

export default salarySlipRoutes;