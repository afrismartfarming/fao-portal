// backend/src/routes/analyticsRoutes.js
import express from "express";
const router = express.Router();

// TEMP placeholder route (replace later with real analytics)
router.get("/", (req, res) => {
  res.json({ success: true, message: "Analytics endpoint operational" });
});

export default router;

