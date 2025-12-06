import Content from "../models/Content.js";
import Media from "../models/Media.js";

/* ------------------------------------------------------------------
   GET ALL CONTENT (public + internal)
------------------------------------------------------------------ */
export const getAllContent = async (req, res) => {
  try {
    const query = {};

    // Public endpoint → only return published & public content
    if (req.path.includes("public")) {
      query.status = "published";
      query.visibility = "public";
    }

    const items = await Content.find(query)
      .sort({ publishedAt: -1, updatedAt: -1 })
      .select("-versions");

    res.json({ success: true, items });
  } catch (err) {
    console.error("GET ALL CONTENT ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ------------------------------------------------------------------
   GET SINGLE CONTENT (by ID or slug)
------------------------------------------------------------------ */
export const getContent = async (req, res) => {
  try {
    const param = req.params.slug || req.params.id;

    let item = null;

    if (req.path.includes("public")) {
      // Public endpoint → only published content visible
      item = await Content.findOne({
        slug: param,
        status: "published",
        visibility: "public",
      });
    } else {
      // Internal admin/editor access
      item = await Content.findById(param).populate("media");
      if (!item) {
        item = await Content.findOne({ slug: param }).populate("media");
      }
    }

    if (!item)
      return res.status(404).json({ success: false, message: "Not found" });

    res.json({ success: true, item });
  } catch (err) {
    console.error("GET CONTENT ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ------------------------------------------------------------------
   CREATE CONTENT
------------------------------------------------------------------ */
export const createContent = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      createdBy: req.user?._id,
      updatedBy: req.user?._id,
      slug: req.body.slug
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
    };

    const created = await Content.create(payload);

    res.json({ success: true, content: created });
  } catch (err) {
    console.error("CREATE CONTENT ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ------------------------------------------------------------------
   UPDATE CONTENT
------------------------------------------------------------------ */
export const updateContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content)
      return res.status(404).json({ success: false, message: "Not found" });

    const fields = [
      "title",
      "summary",
      "body",
      "tags",
      "category",
      "visibility",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        content[field] = req.body[field];
      }
    });

    content.updatedBy = req.user?._id;
    content.updatedAt = new Date();

    await content.save();

    res.json({ success: true, content });
  } catch (err) {
    console.error("UPDATE CONTENT ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ------------------------------------------------------------------
   DELETE CONTENT (soft delete → archive)
------------------------------------------------------------------ */
export const deleteContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content)
      return res
        .status(404)
        .json({ success: false, message: "Content not found" });

    content.status = "archived";
    content.updatedBy = req.user?._id;
    content.updatedAt = new Date();

    await content.save();

    res.json({
      success: true,
      message: "Content archived",
      content,
    });
  } catch (err) {
    console.error("DELETE CONTENT ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ------------------------------------------------------------------
   SUBMIT FOR REVIEW
------------------------------------------------------------------ */
export const submitForReview = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content)
      return res.status(404).json({ success: false, message: "Not found" });

    content.status = "in_review";
    content.updatedBy = req.user?._id;
    content.updatedAt = new Date();

    await content.save();

    res.json({ success: true, content });
  } catch (err) {
    console.error("SUBMIT FOR REVIEW ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ------------------------------------------------------------------
   APPROVE CONTENT (Publish with versioning)
------------------------------------------------------------------ */
export const approveContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content)
      return res.status(404).json({ success: false, message: "Not found" });

    content.status = "published";
    content.publishedBy = req.user?._id;
    content.publishedAt = new Date();

    content.version = (content.version || 1) + 1;

    content.versions.push({
      version: content.version,
      title: content.title,
      summary: content.summary,
      body: content.body,
      updatedBy: req.user?._id,
      updatedAt: new Date(),
    });

    await content.save();

    res.json({ success: true, content });
  } catch (err) {
    console.error("APPROVE CONTENT ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ------------------------------------------------------------------
   PUBLISH CONTENT MANUALLY (admin)
------------------------------------------------------------------ */
export const publishContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content)
      return res.status(404).json({ success: false, message: "Not found" });

    content.status = "published";
    content.publishedBy = req.user?._id;
    content.publishedAt = new Date();

    await content.save();

    res.json({ success: true, content });
  } catch (err) {
    console.error("PUBLISH CONTENT ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ------------------------------------------------------------------
   UPLOAD MEDIA AND LINK TO CONTENT
------------------------------------------------------------------ */
export const uploadMediaToContent = async (req, res) => {
  try {
    const { mediaIds } = req.body;

    const content = await Content.findById(req.params.id);
    if (!content)
      return res.status(404).json({ success: false, message: "Not found" });

    // Validate media
    const validMedia = await Media.find({ _id: { $in: mediaIds } });
    const validIds = validMedia.map((m) => m._id);

    content.media = [...new Set([...content.media, ...validIds])];
    content.updatedAt = new Date();
    content.updatedBy = req.user?._id;

    await content.save();

    res.json({ success: true, content });
  } catch (err) {
    console.error("UPLOAD MEDIA ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ------------------------------------------------------------------
   REVERT TO VERSION
------------------------------------------------------------------ */
export const revertToVersion = async (req, res) => {
  try {
    const { versionNumber } = req.params;

    const content = await Content.findById(req.params.id);
    if (!content)
      return res.status(404).json({ success: false, message: "Not found" });

    const versionData = content.versions.find(
      (v) => v.version == versionNumber
    );

    if (!versionData)
      return res
        .status(404)
        .json({ success: false, message: "Version not found" });

    content.title = versionData.title;
    content.summary = versionData.summary;
    content.body = versionData.body;

    content.version = parseInt(versionNumber);
    content.updatedBy = req.user?._id;
    content.updatedAt = new Date();

    await content.save();

    res.json({ success: true, content });
  } catch (err) {
    console.error("REVERT VERSION ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

