const mongoose = require("mongoose");

const targetLevelSchema = new mongoose.Schema({
  level: { type: String },   // e.g. "TP1", "TP2", "TP3"
  price: { type: Number },
  hit: { type: Boolean, default: false },
});

const signalSchema = new mongoose.Schema(
  {
    pair: {
      type: String,
      required: [true, "Trading pair is required"],
      trim: true,
      uppercase: true,
      // e.g. BTC/USDT, ETH/USDT, EUR/USD
    },

    entryPrice: {
      type: Number,
      required: [true, "Entry price is required"],
    },

    stopLoss: {
      type: Number,
      required: [true, "Stop loss is required"],
    },

    takeProfit: {
      type: Number,
      required: [true, "Take profit is required"],
    },

    signalType: {
      type: String,
      enum: ["BUY", "SELL"],
      required: [true, "Signal type is required"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },

    // Multiple target levels (optional)
    targetLevels: [targetLevelSchema],

    // Signal result tracking
    result: {
      type: String,
      enum: ["WIN", "LOSS", "PENDING", "CANCELLED"],
      default: "PENDING",
    },

    profitPercent: {
      type: Number,
      default: null,
    },

    // Which packages can see this signal
    // Admin posts once, system filters by package
    visibleTo: {
      type: [String],
      enum: ["bronze", "silver", "gold", "diamond"],
      default: ["bronze", "silver", "gold", "diamond"],
    },

    // Is signal active / published
    isActive: {
      type: Boolean,
      default: true,
    },

    // Posted by (admin reference)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Signal", signalSchema);
