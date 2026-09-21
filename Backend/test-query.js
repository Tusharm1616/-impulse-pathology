require("dotenv").config();
const { neon } = require("@neondatabase/serverless");
const { PrismaNeonHttp } = require("@prisma/adapter-neon");
const { PrismaClient } = require("@prisma/client");

const adapter = new PrismaNeonHttp(process.env.DATABASE_URL);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Connecting...");
  await prisma.$connect();
  console.log("Connected! Running query...");
  const users = await prisma.user.findMany();
  console.log("Users:", users.length);
}
main().catch(console.error);
