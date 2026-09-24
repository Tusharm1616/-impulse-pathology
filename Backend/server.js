// ─── Override DNS to use reliable public servers ─────────────────────────────
// The machine's default DNS may fail to resolve cloud hostnames (e.g. Neon DB).
// Using Google DNS (8.8.8.8 / 8.8.4.4) and Cloudflare (1.1.1.1) as fallback.
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

// Patch dns.lookup to bypass broken OS DNS for Neon database
const originalLookup = dns.lookup;
dns.lookup = function (hostname, options, callback) {
  if (typeof options === "function") {
    callback = options;
    options = {};
  }
  if (hostname.includes("neon.tech")) {
    return dns.resolve4(hostname, (err, addresses) => {
      if (err || !addresses || addresses.length === 0) {
        return originalLookup(hostname, options, callback);
      }
      if (options && options.all) {
        const results = addresses.map(addr => ({ address: addr, family: 4 }));
        return callback(null, results);
      }
      callback(null, addresses[0], 4);
    });
  }
  return originalLookup(hostname, options, callback);
};


require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./config/db");

// Import routes
const authRoutes = require("./routes/auth");
const patientRoutes = require("./routes/patients");
const reportRoutes = require("./routes/reports");
const prescriptionRoutes = require("./routes/prescriptions");
const bookingRoutes = require("./routes/bookings");

// Initialize app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes); // The frontend might call /patients, but typically we prefix /api
// Update: looking at the frontend code, we saw apiFetch calling `/patients` which resolves to `/api/patients` usually,
// but let's mount them directly at /api to match next.js api routes structure or standard backend practices
// Frontend api.ts does: const url = base ? `${base}${path}` : path.startsWith("/api") ? path : `/api${path}`;
// So if path is `/patients`, it fetches `/api/patients`. Let's mount them on `/api`
app.use("/api/patients", patientRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/bookings", bookingRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Impulse Pathology Lab API" });
});
app.get("/api", (req, res) => {
  res.json({ message: "Impulse Pathology API is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// For Vercel Serverless, we export the app. For local testing, we listen.
if (process.env.NODE_ENV !== "production" || process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

module.exports = app;
