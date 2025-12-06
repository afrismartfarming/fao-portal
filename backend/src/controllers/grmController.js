import Grm from "../models/Grm.js";

/* ---------------------------------------------
   GET ALL GRM RECORDS
--------------------------------------------- */
export const getAllGrm = async (req, res) => {
  try {
    const results = await Grm.find().sort({ createdAt: -1 });

    const formatted = results.map((r) => ({
      id: r._id.toString(),
      reportId: r.reportId || "N/A",
      reporterName: r.reporterName || "Unknown",
      reporterPhone: r.reporterPhone || "—",
      reporterEmail: r.reporterEmail || "—",
      district: r.district || "N/A",
      chiefdom: r.chiefdom || "N/A",
      village: r.village || "N/A",
      category: r.category || "Other",
      description: r.description || "—",
      status: r.status || "open",
      priority: r.priority || "Low",
      submittedAt: r.submittedAt,
      createdAt: r.createdAt,
    }));

    return res.json({
      success: true,
      data: {
        count: formatted.length,
        results: formatted,
      },
    });
  } catch (err) {
    console.error("GET ALL GRM ERROR:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ---------------------------------------------
   GET SINGLE RECORD
--------------------------------------------- */
export const getGrmById = async (req, res) => {
  try {
    const record = await Grm.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!record) {
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });
    }

    return res.json({ success: true, report: record });
  } catch (err) {
    console.error("GET GRM BY ID ERROR:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ---------------------------------------------
   CREATE NEW GRM REPORT
--------------------------------------------- */
export const createGrm = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      status: "open",
      createdBy: req.user?._id || null,
      submittedAt: new Date(),
    };

    const record = await Grm.create(payload);

    return res.status(201).json({
      success: true,
      report: record,
    });
  } catch (err) {
    console.error("CREATE GRM ERROR:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ---------------------------------------------
   UPDATE STATUS (FAO-compliant + Sanitize)
--------------------------------------------- */
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["open", "in_progress", "resolved", "closed"];

    const normalizeMap = {
      pending: "open",
      reviewing: "in_progress",
      escalated: "in_progress",
      rejected: "closed",
    };

    const normalizedStatus = normalizeMap[status] || status;

    if (!allowedStatuses.includes(normalizedStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed: ${allowedStatuses.join(", ")}`,
      });
    }

    const record = await Grm.findById(req.params.id);

    if (!record) {
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });
    }

    /* -----------------------------------------------------
       SANITIZE BAD HISTORY ENTRIES
    ----------------------------------------------------- */
    record.statusHistory = (record.statusHistory || []).filter((h) => {
      if (!h) return false;
      if (!h.action || !h.date) return false;
      return true;
    });

    record.statusHistory = record.statusHistory.map((h) => ({
      ...h,
      status: normalizeMap[h.status] || h.status,
    }));

    /* -----------------------------------------------------
       SLA TIMESTAMPS
    ----------------------------------------------------- */
    if (normalizedStatus === "in_progress" && !record.firstResponseAt) {
      record.firstResponseAt = new Date();
    }

    if (normalizedStatus === "resolved" && !record.resolvedAt) {
      record.resolvedAt = new Date();
    }

    /* -----------------------------------------------------
       APPLY STATUS + HISTORY
    ----------------------------------------------------- */
    const actorName = req.user?.name || req.user?.email || "System";

    record.status = normalizedStatus;

    record.statusHistory.push({
      status: normalizedStatus,
      action: `Status changed to ${normalizedStatus}`,
      by: actorName,
      date: new Date(),
    });

    await record.save();

    return res.json({ success: true, report: record });
  } catch (err) {
    console.error("STATUS UPDATE ERROR:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
