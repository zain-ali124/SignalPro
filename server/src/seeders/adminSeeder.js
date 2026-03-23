const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const mongoose = require("mongoose");
const User = require("../models/User");
const Package = require("../models/Package");
const connectDB = require("../config/db");

const seedData = async () => {
  try {
    await connectDB();
    console.log("🌱 Starting database seed...\n");

    // ── Seed Admin ───────────────────────────────────
    const adminExists = await User.findOne({ role: "admin" });

    if (!adminExists) {
      await User.create({
        name: process.env.ADMIN_NAME || "Super Admin",
        email: process.env.ADMIN_EMAIL || "admin@tradingplatform.com",
        password: process.env.ADMIN_PASSWORD || "Admin@123456",
        role: "admin",
        accountStatus: "active",
        package: "diamond",
        signalsPerDay: 999999,
      });
      console.log("✅ Admin account created.");
      console.log(`   Email: ${process.env.ADMIN_EMAIL}`);
      console.log(`   Password: ${process.env.ADMIN_PASSWORD}\n`);
    } else {
      console.log("ℹ️  Admin already exists. Skipping.\n");
    }

    // ── Seed Packages ────────────────────────────────
    const packages = [
      {
        name: "bronze",
        displayName: "Bronze",
        price: 29,
        signalsPerDay: 3,
        color: "#cd7f32",
        isPopular: false,
        features: [
          "3 Trading Signals Per Day",
          "Live TradingView Charts",
          "Basic Market Analysis",
          "Email Support",
        ],
      },
      {
        name: "silver",
        displayName: "Silver",
        price: 49,
        signalsPerDay: 6,
        color: "#c0c0c0",
        isPopular: false,
        features: [
          "6 Trading Signals Per Day",
          "Live TradingView Charts",
          "Daily Market Analysis",
          "Email Support",
          "Signal Notifications",
        ],
      },
      {
        name: "gold",
        displayName: "Gold",
        price: 99,
        signalsPerDay: 10,
        color: "#ffd700",
        isPopular: true,
        features: [
          "10 Trading Signals Per Day",
          "Live TradingView Charts",
          "Premium Market Analysis",
          "Priority Support",
          "Signal Notifications",
          "Risk Management Tips",
        ],
      },
      {
        name: "diamond",
        displayName: "Diamond",
        price: 199,
        signalsPerDay: 999999,
        color: "#b9f2ff",
        isPopular: false,
        features: [
          "Unlimited Trading Signals",
          "Live TradingView Charts",
          "VIP Market Analysis",
          "24/7 Priority Support",
          "Signal Notifications",
          "Risk Management Tips",
          "Telegram VIP Group",
          "1-on-1 Consultation",
        ],
      },
    ];

    for (const pkg of packages) {
      const exists = await Package.findOne({ name: pkg.name });
      if (!exists) {
        await Package.create(pkg);
        console.log(`✅ Package created: ${pkg.displayName} ($${pkg.price}/mo)`);
      } else {
        console.log(`ℹ️  Package already exists: ${pkg.displayName}. Skipping.`);
      }
    }

    console.log("\n🎉 Database seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedData();
