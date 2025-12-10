// backend/src/routes/authRoutes.js
import express from "express";
import mongoose from "mongoose";


import {
  registerUser,
  loginUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getMe,
} from "../controllers/authController.js";

import { protect, authorize } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

/* ----------------------------------------------------------
   DEBUG ROUTE — CHECK ENV + DB CONNECTION
---------------------------------------------------------- */
router.get("/debug", (req, res) =>
  res.json({
    connectedTo: mongoose.connection.name,
    uri: process.env.MONGO_URI ? "LOADED" : "NOT_LOADED",
    jwt: process.env.JWT_SECRET ? "SET" : "MISSING",
  })
);

/* ----------------------------------------------------------
   PUBLIC ROUTES
---------------------------------------------------------- */
router.post("/register", registerUser);
router.post("/login", loginUser);

/* ----------------------------------------------------------
   TEMP: VIEW USERS WITHOUT AUTH (for diagnosis only)
   IMPORTANT: Remove or protect this later!
---------------------------------------------------------- */
router.get("/dev-users", async (req, res) => {
  const users = await User.find().lean();
  res.json({ success: true, users });
});

/* ----------------------------------------------------------
   AUTH REQUIRED BELOW THIS LINE
---------------------------------------------------------- */
router.get("/me", protect, getMe);
router.use(protect);

/* ----------------------------------------------------------
   ADMIN ROUTES
---------------------------------------------------------- */
router.get("/", authorize("admin"), getUsers);
router.get("/:id", authorize("admin"), getUserById);
router.put("/:id", authorize("admin"), updateUser);
router.delete("/:id", authorize("admin"), deleteUser);

export default router;
