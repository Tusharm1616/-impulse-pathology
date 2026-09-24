const express = require('express');
const router = express.Router();
const prisma = require('../config/db');

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, service, date, subTests } = req.body;

    if (!name || !email || !phone || !service || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

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

module.exports = router;
