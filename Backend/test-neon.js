require('dotenv').config();
const { neon } = require('@neondatabase/serverless');
console.log("URL:", process.env.DATABASE_URL);
try {
  const sql = neon(process.env.DATABASE_URL);
  console.log("neon success");
} catch(e) {
  console.error("neon error:", e.message);
}
