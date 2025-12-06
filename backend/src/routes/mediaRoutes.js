import express from "express";
const router = express.Router();

import {
  uploadMedia,
  deleteMedia,
  getMedia,
  getAllMedia
} from "../controllers/mediaController.js";

router.post("/", uploadMedia);
router.get("/", getAllMedia);
router.get("/:id", getMedia);
router.delete("/:id", deleteMedia);

export default router;

