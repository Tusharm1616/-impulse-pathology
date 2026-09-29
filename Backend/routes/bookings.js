const express = require('express');
const router = express.Router();
const { prisma } = require('../config/db');

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, service, date, subTests } = req.body;

    if (!name || !email || !phone || !service || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('Prisma object exists:', !!prisma);
    const booking = await prisma.booking.create({
      data: {
        name,
        email,
        phone,
        service,
        date,
        subTests: subTests || [],
      },
    });

    res.status(201).json({ success: true, booking });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// GET /api/bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// PATCH /api/bookings/:id/status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status },
    });
    res.json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
});

module.exports = router;
