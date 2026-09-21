const express = require("express");
const router = express.Router();
const { prisma } = require("../config/db");
const { protect, adminOnly } = require("../middleware/auth");

// ─── GET /patients ─────────────────────────────────────────────────────────
// Returns all patients, sorted newest first
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { createdAt: 'desc' }
    });
    // Prisma returns id as string automatically since we used @id @default(uuid())
    res.json(patients);
  } catch (err) {
    console.error("Get patients error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ─── POST /patients ────────────────────────────────────────────────────────
// Create a new patient
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { name, phone, email, dob, address, notes } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const patient = await prisma.patient.create({
      data: { name, phone, email, dob, address, notes }
    });
    res.status(201).json(patient);
  } catch (err) {
    console.error("Create patient error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ─── GET /patients/:id ─────────────────────────────────────────────────────
router.get("/:id", protect, adminOnly, async (req, res) => {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: req.params.id }
    });
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ─── PUT /patients/:id ─────────────────────────────────────────────────────
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const { name, phone, email, dob, address, notes } = req.body;
    
    // Check if exists
    const exists = await prisma.patient.findUnique({ where: { id: req.params.id }});
    if (!exists) return res.status(404).json({ message: "Patient not found" });

    const updated = await prisma.patient.update({
      where: { id: req.params.id },
      data: { name, phone, email, dob, address, notes }
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ─── DELETE /patients/:id ──────────────────────────────────────────────────
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    // Check if exists
    const exists = await prisma.patient.findUnique({ where: { id: req.params.id }});
    if (!exists) return res.status(404).json({ message: "Patient not found" });

    await prisma.patient.delete({ where: { id: req.params.id } });
    res.json({ message: "Patient deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
