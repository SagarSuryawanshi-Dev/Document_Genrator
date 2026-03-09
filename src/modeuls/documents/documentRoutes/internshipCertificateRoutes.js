import express from "express";
import {
  createInternshipCertificate,
  getAllInternshipCertificates,
  getInternshipCertificateById,
  updateInternshipCertificate,
  deleteInternshipCertificate,
} from "../documentController/internshipCertificateController.js";

const router = express.Router();

router.post("/", createInternshipCertificate);
router.get("/", getAllInternshipCertificates);
router.get("/:id", getInternshipCertificateById);
router.put("/:id", updateInternshipCertificate);
router.delete("/:id", deleteInternshipCertificate);

export default router;