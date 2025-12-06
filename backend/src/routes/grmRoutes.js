// backend/src/routes/grmRoutes.js

import express from "express";
import {
  createGrm,
  getAllGrm,
  getGrmById,
  updateStatus
} from "../controllers/grmController.js";

import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("admin", "supervisor", "officer"),
  createGrm
);

router.get(
  "/",
  protect,
  authorize("admin", "supervisor", "officer", "analyst"),
  getAllGrm
);

router.get(
  "/:id",
  protect,
  authorize("admin", "supervisor", "officer", "analyst"),
  getGrmById
);

router.put(
  "/:id/status",
  protect,
  authorize("admin", "supervisor", "officer"),
  updateStatus
);

export default router;
