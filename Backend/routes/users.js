const express = require('express');
const router = express.Router();
const { prisma } = require('../config/db');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/users
// Returns all users
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
      }
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET /api/users/:id/history
// Returns full history for a single user (bookings, reports, prescriptions)
router.get('/:id/history', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true, isVerified: true, createdAt: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const emailMatch = user.email || "---NO_MATCH---";

    const [bookings, reports, prescriptions] = await Promise.all([
      prisma.booking.findMany({ where: { email: emailMatch }, orderBy: { createdAt: 'desc' } }),
      prisma.report.findMany({ where: { uploadedById: id }, orderBy: { createdAt: 'desc' } }),
      prisma.prescription.findMany({ where: { email: emailMatch }, orderBy: { createdAt: 'desc' } })
    ]);

    res.json({
      user,
      bookings,
      reports,
      prescriptions
    });
  } catch (error) {
    console.error('Error fetching user history:', error);
    res.status(500).json({ error: 'Failed to fetch user history' });
  }
});

module.exports = router;
