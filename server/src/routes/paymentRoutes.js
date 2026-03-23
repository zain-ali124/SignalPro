const express = require("express");
const router = express.Router();
const {
  getMyPayments,
  uploadPaymentProof,
  getAllPayments,
  approvePayment,
  rejectPayment,
} = require("../controllers/paymentController");
const { protect } = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/adminMiddleware");
const { upload } = require("../middlewares/uploadMiddleware");

router.use(protect);

// User routes
router.get("/my", getMyPayments);
router.post("/upload-proof", upload.single("screenshot"), uploadPaymentProof);

// Admin routes
router.get("/", adminOnly, getAllPayments);
router.put("/:id/approve", adminOnly, approvePayment);
router.put("/:id/reject", adminOnly, rejectPayment);

module.exports = router;
