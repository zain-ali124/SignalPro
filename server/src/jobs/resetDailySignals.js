const cron = require("node-cron");
const User = require("../models/User");

// ── Reset every user's signalsUsedToday to 0 at midnight ──
const resetDailySignals = () => {
  // Runs every day at 00:00 (midnight)
  cron.schedule("0 0 * * *", async () => {
    try {
      const result = await User.updateMany(
        { role: "user" },
        {
          $set: {
            signalsUsedToday: 0,
            lastSignalReset: new Date(),
          },
        }
      );

      console.log(
        `✅ Daily signal reset: ${result.modifiedCount} users updated at ${new Date().toISOString()}`
      );
    } catch (error) {
      console.error("❌ Daily signal reset failed:", error.message);
    }
  });

  console.log("⏰ Daily signal reset cron job scheduled (runs at midnight)");
};

module.exports = resetDailySignals;
