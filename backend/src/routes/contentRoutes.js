// src/routes/contentRoutes.js
import express from "express";
import {
  createContent,
  updateContent,
  submitForReview,
  approveContent,
  getContent,
  getAllContent,
  deleteContent,
  publishContent,
  uploadMediaToContent,
  revertToVersion
} from "../controllers/contentController.js";

import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

/* PUBLIC */
router.get("/public", getAllContent);
router.get("/public/:slug", getContent);

/* INTERNAL */
router.use(protect);
router.get("/", getAllContent);
router.get("/:id", getContent);
router.post("/", createContent);
router.put("/:id", updateContent);
router.put("/:id/submit", submitForReview);
router.put("/:id/approve", adminOnly, approveContent);
router.put("/:id/publish", adminOnly, publishContent);
router.put("/:id/media", uploadMediaToContent);
router.put("/:id/revert/:versionNumber", revertToVersion);
router.delete("/:id", deleteContent);

export default router;

