const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");

const { errorHandler, notFound } = require("./src/middlewares/errorHandler");
const { multerErrorHandler } = require("./src/middlewares/uploadMiddleware");

const authRoutes    = require("./src/routes/authRoutes");
const userRoutes    = require("./src/routes/userRoutes");
const signalRoutes  = require("./src/routes/signalRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");
const adminRoutes   = require("./src/routes/adminRoutes");

const app = express();

// ── Security headers ───────────────────────────────
app.use(helmet());

// ── CORS ───────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ── Request logger (dev only) ──────────────────────
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ── Rate limiting ──────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // max 100 requests per window
  message: {
    success: false,
    message: "Too many requests from this IP. Please try again later.",
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // max 10 login attempts
  message: {
    success: false,
    message: "Too many login attempts. Please try again after 15 minutes.",
  },
});

app.use("/api", limiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

// ── Body parsers ───────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ── Static files (local upload fallback) ──────────
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Health check ───────────────────────────────────
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Trading Signal Platform API is running 🚀",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ─────────────────────────────────────
app.use("/api/auth",     authRoutes);
app.use("/api/users",    userRoutes);
app.use("/api/signals",  signalRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin",    adminRoutes);

// ── 404 & Error Handlers ───────────────────────────
app.use(notFound);
// Multer errors (file too large, invalid type) -> respond cleanly before generic handler
app.use(multerErrorHandler);
app.use(errorHandler);

module.exports = app;
