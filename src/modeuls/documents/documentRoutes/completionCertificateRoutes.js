import express from "express";
import {
  createCompletionCertificate,
  getAllCompletionCertificates,
  getCompletionCertificateById,
  updateCompletionCertificate,
  deleteCompletionCertificate,
} from "../documentController/completionCertificateController.js";

const completionCertificateRoutes = express.Router();

// generate completion certificate
completionCertificateRoutes.post(
  "/generate",
  createCompletionCertificate
);


// get all completion certificates
completionCertificateRoutes.get("/all-certificates", getAllCompletionCertificates)

//  get completion certificate by id 
completionCertificateRoutes.get(
  "/user/:id",
  getCompletionCertificateById
)

// update completion certificate
completionCertificateRoutes.put(
  "/update/:id",
  updateCompletionCertificate
)

// delete completion certificate
completionCertificateRoutes.delete(
  "/delete/:id",
  deleteCompletionCertificate
)



export default completionCertificateRoutes;