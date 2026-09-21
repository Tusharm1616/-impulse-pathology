const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { prisma } = require("../config/db");
const { protect, adminOnly } = require("../middleware/auth");

// ─── Multer setup (store reports in /uploads/reports) ─────────────────────
const uploadDir = path.join(__dirname, "../uploads/reports");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}-${file.originalname.replace(/\s+/g, "_")}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
  fileFilter: (_req, file, cb) => {
    const allowed = /pdf|jpeg|jpg|png|docx?/i;
    cb(null, allowed.test(path.extname(file.originalname)));
  },
});

// ─── GET /reports ──────────────────────────────────────────────────────────
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const reports = await prisma.report.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        patient: {
          select: { name: true, phone: true }
        }
      }
    });

    const base = process.env.CLIENT_URL || "http://localhost:3001";
    const data = reports.map((r) => ({
      id: r.id,
      patientId: r.patientId || "",
      patientName: r.patient?.name || "",
      test: r.test,
      filename: r.filename,
      url: `${base}/uploads/reports/${r.filename}`,
      createdAt: r.createdAt,
    }));
    res.json(data);
  } catch (err) {
    console.error("Get reports error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ─── POST /reports ─────────────────────────────────────────────────────────
router.post("/", protect, adminOnly, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "File is required" });

    const { patientId, test } = req.body;
    
    // Check if patient exists if patientId provided
    if (patientId) {
      const patientExists = await prisma.patient.findUnique({ where: { id: patientId }});
      if (!patientExists) return res.status(400).json({ message: "Patient not found" });
    }

    const report = await prisma.report.create({
      data: {
        patientId: patientId || null,
        test: test || "General Report",
        filename: req.file.filename,
        url: req.file.path,
        uploadedById: req.user.id,
      }
    });

    const base = process.env.CLIENT_URL || "http://localhost:3001";
    res.status(201).json({
      id: report.id,
      patientId: patientId || "",
      test: report.test,
      filename: report.filename,
      url: `${base}/uploads/reports/${report.filename}`,
    });
  } catch (err) {
    console.error("Upload report error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ─── DELETE /reports/:id ───────────────────────────────────────────────────
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const report = await prisma.report.findUnique({ where: { id: req.params.id }});
    if (!report) return res.status(404).json({ message: "Report not found" });

    // Remove file from disk
    const filePath = path.join(uploadDir, report.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await prisma.report.delete({ where: { id: req.params.id } });
    res.json({ message: "Report deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
