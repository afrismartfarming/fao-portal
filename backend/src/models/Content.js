import mongoose from "mongoose";

/* ---------------------------------------------------------------------------
   VERSION SUBSCHEMA
--------------------------------------------------------------------------- */
const VersionSchema = new mongoose.Schema(
  {
    version: { type: Number, required: true },
    title: { type: String, trim: true },
    summary: { type: String, trim: true },
    body: { type: String },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedAt: { type: Date, default: Date.now },
    note: { type: String, trim: true },
  },
  { _id: false }
);

/* ---------------------------------------------------------------------------
   CONTENT SCHEMA
--------------------------------------------------------------------------- */
const ContentSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    title: { type: String, required: true, trim: true },
    summary: { type: String, trim: true },
    body: { type: String },

    category: { type: String, trim: true, index: true },

    tags: {
      type: [String],
      default: [],
      set: (v) => (Array.isArray(v) ? v.map((t) => t.trim()) : []),
    },

    status: {
      type: String,
      enum: ["draft", "in_review", "published", "archived"],
      default: "draft",
      index: true,
    },

    visibility: {
      type: String,
      enum: ["internal", "public"],
      default: "internal",
    },

    version: { type: Number, default: 1 },
    versions: { type: [VersionSchema], default: [] },

    media: [{ type: mongoose.Schema.Types.ObjectId, ref: "Media" }],

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    publishedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

/* ---------------------------------------------------------------------------
   EXPORT MODEL
--------------------------------------------------------------------------- */
const Content = mongoose.model("Content", ContentSchema);
export default Content;

