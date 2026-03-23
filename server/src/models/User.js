const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Never return password in queries by default
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // ── Package Info ──────────────────────────────
    package: {
      type: String,
      enum: ["bronze", "silver", "gold", "diamond", "none"],
      default: "none",
    },

    signalsPerDay: {
      type: Number,
      default: 0,
    },

    signalsUsedToday: {
      type: Number,
      default: 0,
    },

    lastSignalReset: {
      type: Date,
      default: Date.now,
    },

    // ── Account Status ────────────────────────────
    accountStatus: {
      type: String,
      enum: ["pending", "active", "suspended", "rejected"],
      default: "pending",
    },

    // ── Payment Proof ─────────────────────────────
    paymentProof: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
    },

    // ── Profile ───────────────────────────────────
    profilePicture: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
    },

    // ── Password Reset ────────────────────────────
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },

    // ── Referral ──────────────────────────────────
    referralCode: { type: String, unique: true, sparse: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

// ── Hash password before saving ──────────────────
userSchema.pre("save", async function () {
  // Use async pre-hook (no `next` param). If password not modified, do nothing.
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// ── Compare entered password with hashed password ─
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ── Auto set signalsPerDay based on package ───────
userSchema.methods.setPackageLimits = function () {
  const limits = {
    bronze: 3,
    silver: 6,
    gold: 10,
    diamond: 999999,
    none: 0,
  };
  this.signalsPerDay = limits[this.package] || 0;
};

module.exports = mongoose.model("User", userSchema);
