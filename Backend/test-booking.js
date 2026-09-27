const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testBooking() {
  try {
    const booking = await prisma.booking.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        service: 'Complete Blood Count',
        date: '2026-10-01',
        subTests: ['Hemoglobin'],
      },
    });
    console.log('Booking created:', booking);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testBooking();
