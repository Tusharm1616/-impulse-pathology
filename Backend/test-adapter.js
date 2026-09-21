require("dotenv").config();
const { neon } = require("@neondatabase/serverless");
const adapterNeon = require("@prisma/adapter-neon");

console.log("adapter exports:", Object.keys(adapterNeon));
const { PrismaNeonHTTP, PrismaNeonHttp, PrismaNeon } = adapterNeon;
const adapterClass = PrismaNeonHTTP || PrismaNeonHttp;
console.log("Class is:", adapterClass ? adapterClass.name : "not found");

try {
  const sql = neon(process.env.DATABASE_URL);
  const adapter = new adapterClass(sql);
  console.log("adapter instantiated successfully!");
} catch (e) {
  console.error("Error:", e.message);
}
