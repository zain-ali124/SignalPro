const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ── Protect routes: verify JWT ─────────────────────
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized. No token provided.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Token is invalid.",
      });
    }

    if (user.accountStatus === "suspended") {
      return res.status(403).json({
        success: false,
        message: "Your account has been suspended. Contact support.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token is invalid or expired.",
    });
  }
};

// ── Allow only active users ────────────────────────
const activeOnly = (req, res, next) => {
  if (req.user.accountStatus !== "active") {
    return res.status(403).json({
      success: false,
      message: "Your account is not active yet. Please wait for approval.",
    });
  }
  next();
};

module.exports = { protect, activeOnly };
