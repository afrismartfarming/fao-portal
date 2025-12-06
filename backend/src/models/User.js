// backend/src/models/User.js
console.log(">>> LOADING USER SCHEMA. Fields:", Object.keys(mongoose.Schema.Types));

console.log(">>> USING USER MODEL FILE:", import.meta.url);

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: "Unnamed User",
    },

    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },

    role: {
      type: String,
      enum: [
        "user",
        "admin",
        "supervisor",
        "officer",
        "analyst",
        "editor",
        "reviewer",
      ],
      default: "user",
    },

    status: {
      type: String,
      enum: ["active", "disabled"],
      default: "active",
    },
  },
  { timestamps: true }
);

/* ---------------------------------------------------------------------------
   INSTANCE METHOD: Compare incoming password with hashed password
--------------------------------------------------------------------------- */
userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

/* ---------------------------------------------------------------------------
   PRE-SAVE HOOK: Hash password before saving
--------------------------------------------------------------------------- */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

/* ---------------------------------------------------------------------------
   PRE-UPDATE HOOKS (Ensure password hashing still works with findOneAndUpdate)
--------------------------------------------------------------------------- */
userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  if (update?.password) {
    update.password = await bcrypt.hash(update.password, 12);
  }

  next();
});
console.log(">>> REGISTERING MODEL 'User' with schema paths:", Object.keys(userSchema.paths));

export default mongoose.model("User", userSchema);

