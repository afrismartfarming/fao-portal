// backend/src/models/Grm.js

import mongoose from "mongoose";

/* ---------------------------------------------------------------------------
   STATUS HISTORY SUBSCHEMA (BACKWARD-COMPATIBLE)
--------------------------------------------------------------------------- */
const StatusHistorySchema = new mongoose.Schema(
  {
    // Legacy records may not contain this — so NOT required
    status: { type: String, default: null },

    // Legacy actions may be missing — so NOT required
    action: { type: String, default: "" },

    // Legacy records often had no actor field
    by: { type: String, default: "" },

    date: { type: Date, default: Date.now },
  },
  { _id: false, strict: false } // very important
);

/* ---------------------------------------------------------------------------
   FILE ATTACHMENT SUBSCHEMA
--------------------------------------------------------------------------- */
const AttachmentSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    filename: { type: String, required: true },
  },
  { _id: false }
);

/* ---------------------------------------------------------------------------
   MAIN GRM SCHEMA
--------------------------------------------------------------------------- */
const GrmSchema = new mongoose.Schema(
  {
    reportId: {
      type: String,
      unique: true,
      required: true,
    },

    /* Reporter Details */
    reporterName: { type: String, trim: true },
    reporterPhone: { type: String, trim: true },
    reporterEmail: { type: String, trim: true, lowercase: true },

    /* Category (TOR-Aligned) */
    category: {
      type: String,
      enum: [
        "Land Dispute",
        "Project Complaint",
        "Gender Issue",
        "Environmental Issue",
        "Operational Issue",
        "Other",
      ],
      default: "Other",
    },

    /* Main Complaint */
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },

    /* Status Lifecycle */
    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "closed"],
      default: "open",
      index: true,
    },

    /* Priority Handling */
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
    },

    /* Assignment */
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    /* Location Fields */
    district: { type: String, trim: true },
    chiefdom: { type: String, trim: true },
    village: { type: String, trim: true },

    gps: {
      lat: Number,
      lng: Number,
    },

    /* Supporting Attachments */
    attachments: {
      type: [AttachmentSchema],
      default: [],
    },

    /* SLA Timestamps */
    submittedAt: { type: Date, default: Date.now },
    firstResponseAt: { type: Date },
    resolvedAt: { type: Date },

    /* Status History Audit Trail (now backward-compatible) */
    statusHistory: {
      type: [StatusHistorySchema],
      default: [],
      _id: false,
    },

    /* Creator Metadata */
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

/* ---------------------------------------------------------------------------
   AUTO-GENERATE REPORT ID (G-0001 Style)
--------------------------------------------------------------------------- */
GrmSchema.pre("validate", async function (next) {
  if (this.reportId) return next();

  const count = await mongoose.model("Grm").countDocuments();
  const seqNum = String(count + 1).padStart(4, "0");

  this.reportId = `G-${seqNum}`;
  next();
});

export default mongoose.model("Grm", GrmSchema);
