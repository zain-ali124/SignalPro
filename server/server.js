require("dotenv").config();
const app = require("./app");
const connectDB = require("./src/config/db");
const resetDailySignals = require("./src/jobs/resetDailySignals");

const PORT = process.env.PORT || 5000;

// ── Connect to MongoDB ─────────────────────────────
connectDB();

// ── Start cron jobs ────────────────────────────────
resetDailySignals();

// ── Start server ───────────────────────────────────
app.listen(PORT, () => {
  console.log("\n╔══════════════════════════════════════╗");
  console.log("║  Trading Signal Platform API         ║");
  console.log(`║  Server running on port ${PORT}         ║`);
  console.log(`║  Mode: ${process.env.NODE_ENV || "development"}               ║`);
  console.log("╚══════════════════════════════════════╝\n");
});

// ── Handle unhandled promise rejections ────────────
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err.message);
  process.exit(1);
});
