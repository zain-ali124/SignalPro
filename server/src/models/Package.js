const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: ["bronze", "silver", "gold", "diamond"],
      required: true,
      unique: true,
    },

    displayName: {
      type: String,
      required: true,
      // e.g. "Bronze", "Silver", "Gold", "Diamond"
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
    },

    signalsPerDay: {
      type: Number,
      required: true,
    },

    features: {
      type: [String],
      default: [],
      // e.g. ["3 signals per day", "Live TradingView", "Email alerts"]
    },

    isPopular: {
      type: Boolean,
      default: false,
      // Highlight one package as "Most Popular"
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    color: {
      type: String,
      default: "#f97316",
      // Used for UI card border/glow color
    },

    durationDays: {
      type: Number,
      default: 30,
      // How many days the subscription lasts
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Package", packageSchema);
