import express from "express";
import {
  createInternshipCertificate,
  getAllInternshipCertificates,
  getInternshipCertificateById,
  updateInternshipCertificate,
  deleteInternshipCertificate,
} from "../documentController/internshipCertificateController.js";

const internshipCertificateRoutes = express.Router();



// generate letter
internshipCertificateRoutes.post("/generate", createInternshipCertificate);

// get all letter
internshipCertificateRoutes.get("/all-letters", getAllInternshipCertificates);

// get letter by id
internshipCertificateRoutes.get("/user/:id", getInternshipCertificateById);

// update  letter
internshipCertificateRoutes.put("/update/:id", updateInternshipCertificate);

// delete letter
internshipCertificateRoutes.delete("/delete/:id", deleteInternshipCertificate);

export default internshipCertificateRoutes;