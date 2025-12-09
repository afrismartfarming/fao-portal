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

const router = express.Router();

router.get("/debug", (req,res)=>res.json({
   connectedTo: mongoose.connection.name,
   uri: process.env.MONGO_URI ? "LOADED" : "NOT_LOADED",
   jwt: process.env.JWT_SECRET ? "SET" : "MISSING"
}));


/* ----------------------------------------------------------
   PUBLIC ROUTES
---------------------------------------------------------- */
router.post("/register", registerUser);
router.post("/login", loginUser);

/* ----------------------------------------------------------
   AUTHENTICATED: GET CURRENT USER
---------------------------------------------------------- */
router.get("/me", protect, getMe);

/* ----------------------------------------------------------
   ADMIN ROUTES
---------------------------------------------------------- */
router.use(protect);

router.get("/", authorize("admin"), getUsers);
router.get("/:id", authorize("admin"), getUserById);
router.put("/:id", authorize("admin"), updateUser);
router.delete("/:id", authorize("admin"), deleteUser);

/* ----------------------------------------------------------
   EXPORT ROUTER
---------------------------------------------------------- */
export default router;

