// src/middleware/safeSanitize.js
// Small safe sanitizer: removes leading '$' and '.' from object keys recursively.
// Does NOT overwrite node read-only IncomingMessage properties.

function sanitizeObject(obj) {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeObject);

  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    // replace leading $ and dots in keys
    let nk = k.replace(/^\$+/g, "_").replace(/\./g, "_");
    // sanitize strings (basic)
    if (typeof v === "string") {
      out[nk] = v.replace(/\u0000/g, ""); // remove nulls
    } else {
      out[nk] = sanitizeObject(v);
    }
  }
  return out;
}

export default function safeSanitize() {
  return (req, res, next) => {
    try {
      if (req.body && typeof req.body === "object") req.body = sanitizeObject(req.body);
      // req.query sometimes read-only or getter-based — copy safely if present
      if (req.query && typeof req.query === "object") req.query = sanitizeObject(req.query);
      if (req.params && typeof req.params === "object") req.params = sanitizeObject(req.params);
    } catch (e) {
      // Fail-safe: log and continue (we don't want sanitizer to crash app)
      console.warn("safeSanitize warning:", e && e.message ? e.message : e);
    }
    next();
  };
}

