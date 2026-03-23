const express = require("express");
const router = express.Router();
const {
  getSignals,
  getAllSignals,
  createSignal,
  updateSignal,
  deleteSignal,
} = require("../controllers/signalController");
const { protect, activeOnly } = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/adminMiddleware");
const { signalRules, validate } = require("../utils/validators");

router.use(protect);

// User routes
router.get("/", activeOnly, getSignals);           // Applies daily limit
router.get("/all", activeOnly, getAllSignals);      // Browse all (no limit deduct)

// Admin routes
router.post("/", adminOnly, signalRules, validate, createSignal);
router.put("/:id", adminOnly, updateSignal);
router.delete("/:id", adminOnly, deleteSignal);

module.exports = router;
