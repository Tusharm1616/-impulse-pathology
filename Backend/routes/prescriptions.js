const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { prisma } = require("../config/db");
const { protect, adminOnly } = require("../middleware/auth");

// ─── Multer setup ──────────────────────────────────────────────────────────
const uploadDir = path.join(__dirname, "../uploads/prescriptions");
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
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    const allowed = /pdf|jpeg|jpg|png/i;
    cb(null, allowed.test(path.extname(file.originalname)));
  },
});

// ─── POST /prescriptions/upload ────────────────────────────────────────────
// Public endpoint — patients upload prescriptions without auth
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "File is required" });

    const { name, phone, email } = req.body;
    const prescription = await prisma.prescription.create({
      data: {
        name,
        phone,
        email,
        filename: req.file.filename,
        storedAt: new Date(),
      }
    });

    res.status(201).json({
      message: "Prescription uploaded successfully",
      id: prescription.id,
    });
  } catch (err) {
    console.error("Upload prescription error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ─── GET /prescriptions/list ───────────────────────────────────────────────
// Admin only — list all prescription submissions
router.get("/list", protect, adminOnly, async (req, res) => {
  try {
    const items = await prisma.prescription.findMany({
      orderBy: { storedAt: 'desc' }
    });
    const data = items.map((p) => ({
      id: p.id,
      name: p.name || "",
      phone: p.phone || "",
      email: p.email || "",
      filename: p.filename,
      storedAt: p.storedAt,
    }));
    res.json(data);
  } catch (err) {
    console.error("List prescriptions error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ─── GET /prescriptions/file ───────────────────────────────────────────────
// Admin only — serve a prescription file by filename
router.get("/file", protect, adminOnly, (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(400).json({ message: "Filename required" });

  // Prevent path traversal
  const safe = path.basename(name);
  const filePath = path.join(uploadDir, safe);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "File not found" });
  }
  res.download(filePath, safe);
});

// ─── DELETE /prescriptions/:id ─────────────────────────────────────────────
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const pres = await prisma.prescription.findUnique({ where: { id: req.params.id }});
    if (!pres) return res.status(404).json({ message: "Not found" });

    const filePath = path.join(uploadDir, pres.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await prisma.prescription.delete({ where: { id: req.params.id } });
    res.json({ message: "Prescription deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
