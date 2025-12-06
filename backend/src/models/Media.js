// backend/src/models/Media.js

import mongoose from "mongoose";

const MediaSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: [true, "Filename is required"],
      trim: true,
    },

    url: {
      type: String,
      required: [true, "URL is required"],
      trim: true,
    },

    mimeType: {
      type: String,
      trim: true,
      index: true,
    },

    size: {
      type: Number,
      default: 0,
    },

    altText: {
      type: String,
      trim: true,
    },

    caption: {
      type: String,
      trim: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    uploadedAt: {
      type: Date,
      default: Date.now,
    },

    usageCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["available", "deleted", "archived"],
      default: "available",
      index: true,
    },
  },
  { timestamps: true }
);

/* ---------------------------------------------------------------------------
   SAFETY: Ensure filename + URL cannot be blank
--------------------------------------------------------------------------- */
MediaSchema.pre("validate", function (next) {
  if (!this.filename || !this.url) {
    return next(new Error("Media record missing required fields"));
  }
  next();
});

/* ---------------------------------------------------------------------------
   USAGE TRACKING INCREMENT (for controllers to call)
--------------------------------------------------------------------------- */
MediaSchema.methods.incrementUsage = function () {
  this.usageCount = (this.usageCount || 0) + 1;
  return this.save();
};

export default mongoose.model("Media", MediaSchema);

