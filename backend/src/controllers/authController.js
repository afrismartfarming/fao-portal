// backend/src/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* ------------------------------------------------------------------
   GENERATE JWT
------------------------------------------------------------------ */
function generateToken(id, role) {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
}

/* ------------------------------------------------------------------
   REGISTER USER  (Admin only)
------------------------------------------------------------------ */
export async function registerUser(req, res) {
  try {
    const { name, email, password, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: role || "user",
    });

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

/* ------------------------------------------------------------------
   LOGIN USER
------------------------------------------------------------------ */
export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

/* ------------------------------------------------------------------
   AUTHENTICATED: GET CURRENT USER
------------------------------------------------------------------ */
export async function getMe(req, res) {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        status: req.user.status,
        createdAt: req.user.createdAt,
        updatedAt: req.user.updatedAt,
      },
    });
  } catch (err) {
    console.error("GET ME ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

/* ------------------------------------------------------------------
   GET ALL USERS (Admin)
------------------------------------------------------------------ */
export async function getUsers(req, res) {
  try {
    const users = await User.find().select("-password");
    res.json({ success: true, users });
  } catch (err) {
    console.error("GET USERS ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

/* ------------------------------------------------------------------
   GET USER BY ID (Admin)
------------------------------------------------------------------ */
export async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error("GET USER BY ID ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

/* ------------------------------------------------------------------
   UPDATE USER (Admin)
------------------------------------------------------------------ */
export async function updateUser(req, res) {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.name = req.body.name ?? user.name;
    user.role = req.body.role ?? user.role;
    user.email = req.body.email ?? user.email;

    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    await user.save();

    res.json({
      success: true,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("UPDATE USER ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

/* ------------------------------------------------------------------
   DELETE USER (Admin)
------------------------------------------------------------------ */
export async function deleteUser(req, res) {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    await user.deleteOne();

    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    console.error("DELETE USER ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

