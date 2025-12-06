// src/middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* PROTECT: Verify token and attach user */
export async function protect(req, res, next) {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authorized, token missing" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("JWT VERIFICATION FAILED:", err);
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }

    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ success: false, message: "User no longer exists" });
    }

    next();
  } catch (err) {
    console.error("PROTECT ERROR:", err);
    res.status(401).json({ success: false, message: "Authentication error" });
  }
}

/* AUTHORIZE: allow only roles */
export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ success: false, message: "Not authenticated" });
    if (!allowedRoles.includes(req.user.role)) return res.status(403).json({ success: false, message: "Insufficient permissions" });
    next();
  };
}

/* ADMIN ONLY helper */
export const adminOnly = authorize("admin");

