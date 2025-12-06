// backend/src/startup/createContentIndexes.js

import Content from "../models/Content.js";

export default async function createContentIndexes() {
  console.log("🟦 Ensuring Content Manager indexes...");

  try {
    /* -------------------------------------------------------------
       TEXT SEARCH INDEX
    ------------------------------------------------------------- */
    try {
      await Content.collection.createIndex(
        {
          title: "text",
          summary: "text",
          body: "text",
          tags: "text",
          category: "text",
        },
        { name: "content_text_idx" }
      );
    } catch (err) {
      if (err.code === 85) {
        console.log("🔵 text index already exists — skipping");
      } else throw err;
    }

    /* -------------------------------------------------------------
       SLUG INDEX (unique)
    ------------------------------------------------------------- */
    try {
      await Content.collection.createIndex(
        { slug: 1 },
        { unique: true, name: "content_slug_idx" }
      );
    } catch (err) {
      if (err.code === 85) {
        console.log("🔵 slug index already exists — skipping");
      } else throw err;
    }

    /* -------------------------------------------------------------
       STATUS / CATEGORY SORTING
    ------------------------------------------------------------- */
    try {
      await Content.collection.createIndex(
        { category: 1, status: 1, publishedAt: -1 },
        { name: "content_filter_idx" }
      );
    } catch (err) {
      if (err.code === 85) {
        console.log("🔵 filter index already exists — skipping");
      } else throw err;
    }

    /* -------------------------------------------------------------
       AUTHOR LOOKUP INDEX
    ------------------------------------------------------------- */
    try {
      await Content.collection.createIndex(
        { createdBy: 1, status: 1 },
        { name: "content_author_idx" }
      );
    } catch (err) {
      if (err.code === 85) {
        console.log("🔵 author index already exists — skipping");
      } else throw err;
    }

    /* -------------------------------------------------------------
       GEO INDEXES (district + chiefdom lookups)
    ------------------------------------------------------------- */
    try {
      await Content.collection.createIndex(
        { district: 1, chiefdom: 1 },
        { name: "content_geo_idx" }
      );
    } catch (err) {
      if (err.code === 85) {
        console.log("🔵 geo index already exists — skipping");
      } else throw err;
    }

    console.log("🟢 Content indexes ensured");
  } catch (err) {
    console.error("❌ Failed to ensure content indexes:", err);
  }
}

