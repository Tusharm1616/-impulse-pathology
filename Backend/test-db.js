require("dotenv").config();
const { prisma } = require("./config/db");

async function test() {
  try {
    // Test DB connection
    await prisma.$connect();
    console.log("✅ DB connected");

    // Count records
    const users = await prisma.user.count();
    const patients = await prisma.patient.count();
    const reports = await prisma.report.count();
    const prescriptions = await prisma.prescription.count();
    console.log(`Users: ${users}, Patients: ${patients}, Reports: ${reports}, Prescriptions: ${prescriptions}`);

    // Verify admin user
    const admin = await prisma.user.findUnique({ where: { email: "admin@impulselab.com" } });
    console.log(`Admin found: ${admin ? 'YES, role=' + admin.role : 'NO'}`);

    // List all table names via raw query
    const tables = await prisma.$queryRaw`
      SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename;
    `;
    console.log("Tables in public schema:", tables.map(t => t.tablename));

    console.log("✅ All checks passed!");
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
