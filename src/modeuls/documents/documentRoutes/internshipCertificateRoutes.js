import express from "express";
import {
  createInternshipCertificate,
  getAllInternshipCertificates,
  getInternshipCertificateById,
  updateInternshipCertificate,
  deleteInternshipCertificate,
} from "../documentController/internshipCertificateController.js";

const internshipCertificateRoutes = express.Router();




internshipCertificateRoutes.post("/generate", createInternshipCertificate);


internshipCertificateRoutes.get("/all-letters", getAllInternshipCertificates);

internshipCertificateRoutes.get("/user/:id", getInternshipCertificateById);

internshipCertificateRoutes.put("/update/:id", updateInternshipCertificate);


internshipCertificateRoutes.delete("/delete/:id", deleteInternshipCertificate);

export default internshipCertificateRoutes;