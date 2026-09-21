require("dotenv").config();
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

// Extract connection string and remove pgbouncer=true because pg pool doesn't need it or might pass it wrongly
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("✅ PostgreSQL connected via Prisma + pg adapter");
  } catch (err) {
    console.error("❌ Database connection error:", err.message);
    process.exit(1);
  }
};

module.exports = { prisma, connectDB };

