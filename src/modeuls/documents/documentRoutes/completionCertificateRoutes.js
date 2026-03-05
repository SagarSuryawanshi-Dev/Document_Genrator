import express from "express";
import {
  createCompletionCertificate,
  getAllCompletionCertificates,
  getCompletionCertificateById,
  updateCompletionCertificate,
  deleteCompletionCertificate,
} from "../documentController/completionCertificateController.js";

const router = express.Router();

router.post("/", createCompletionCertificate);
router.get("/", getAllCompletionCertificates);
router.get("/:id", getCompletionCertificateById);
router.put("/:id", updateCompletionCertificate);
router.delete("/:id", deleteCompletionCertificate);

export default router;