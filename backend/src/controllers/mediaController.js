// backend/src/controllers/mediaController.js

import fs from "fs";
import path from "path";
import Media from "../models/Media.js";

/* ---------------------------------------------------------------------------
   UPLOAD MEDIA
--------------------------------------------------------------------------- */
export const uploadMedia = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const media = await Media.create({
      url: file.path,
      filename: file.filename,
      mimeType: file.mimetype,
      size: file.size,
      altText: req.body.altText || "",
      caption: req.body.caption || "",
      uploadedBy: req.user?._id || null,
    });

    return res.json({ success: true, media });
  } catch (err) {
    console.error("UPLOAD MEDIA ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ---------------------------------------------------------------------------
   GET ALL MEDIA
--------------------------------------------------------------------------- */
export const getAllMedia = async (req, res) => {
  try {
    const media = await Media.find().sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: media.length,
      media,
    });
  } catch (err) {
    console.error("GET ALL MEDIA ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ---------------------------------------------------------------------------
   GET SINGLE MEDIA
--------------------------------------------------------------------------- */
export const getMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found",
      });
    }

    return res.json({
      success: true,
      media,
    });
  } catch (err) {
    console.error("GET MEDIA ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ---------------------------------------------------------------------------
   DELETE MEDIA
--------------------------------------------------------------------------- */
export const deleteMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({
        success: false,
        message: "Media not found",
      });
    }

    // Delete physical file if stored locally
    try {
      if (media.url && fs.existsSync(media.url)) {
        fs.unlinkSync(media.url);
      }
    } catch (fileErr) {
      console.error("FILE DELETE ERROR:", fileErr);
      // Still delete the DB record even if file is missing
    }

    await media.deleteOne();

    return res.json({
      success: true,
      message: "Media deleted successfully",
    });
  } catch (err) {
    console.error("DELETE MEDIA ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

