const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const { upload } = require("../middlewares/uploadMiddleware");
const { registerRules, loginRules, validate } = require("../utils/validators");

// Public routes
router.post("/register", upload.single("paymentProof"), registerRules, validate, register);
router.post("/login", loginRules, validate, login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Private routes
router.get("/me", protect, getMe);

module.exports = router;
