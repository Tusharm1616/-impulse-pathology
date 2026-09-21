const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const seedData = async () => {
  try {
    await prisma.$connect();
    console.log("✅ PostgreSQL connected for seeding...");

    console.log("Clearing existing data...");
    // Prisma deleteMany order matters due to foreign keys
    await prisma.report.deleteMany();
    await prisma.patient.deleteMany();
    await prisma.prescription.deleteMany();
    await prisma.user.deleteMany();

    console.log("Creating admin user...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    const admin = await prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@impulselab.com",
        password: hashedPassword,
        role: "admin",
        isVerified: true
      }
    });

    console.log("Creating test patients...");
    const patient1 = await prisma.patient.create({
      data: {
        name: "John Doe",
        phone: "1234567890",
        email: "john@example.com",
        dob: "1990-01-01",
        address: "123 Main St",
        notes: "Test patient 1"
      }
    });

    const patient2 = await prisma.patient.create({
      data: {
        name: "Jane Smith",
        phone: "0987654321",
        email: "jane@example.com",
        dob: "1985-05-15",
        address: "456 Oak Ave",
        notes: "Test patient 2"
      }
    });

    console.log("Creating dummy report...");
    await prisma.report.create({
      data: {
        patientId: patient1.id,
        test: "Complete Blood Count (CBC)",
        filename: "dummy-report.pdf",
        url: "http://localhost:3001/uploads/reports/dummy-report.pdf",
        uploadedById: admin.id
      }
    });

    console.log("✅ Database seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding database:", err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

seedData();
