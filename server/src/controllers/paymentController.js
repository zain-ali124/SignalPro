const Payment = require("../models/Payment");
const User = require("../models/User");
const { uploadToCloudinary } = require("../config/cloudinary");
const fs = require("fs");

// ── @route  GET /api/payments/my
// ── @desc   Get logged-in user's payment history
// ── @access Private
const getMyPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments,
    });
  } catch (error) {
    next(error);
  }
};

// ── @route  POST /api/payments/upload-proof
// ── @desc   User uploads payment proof (for package renewal)
// ── @access Private
const uploadPaymentProof = async (req, res, next) => {
  try {
    const { package: pkg, transactionId } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Payment screenshot is required.",
      });
    }

    // Upload to Cloudinary
    const cloudResult = await uploadToCloudinary(
      req.file.path,
      "payment-proofs"
    );
    fs.unlinkSync(req.file.path);

    const packagePrices = {
      bronze: 29,
      silver: 49,
      gold: 99,
      diamond: 199,
    };

    // Create pending payment
    const payment = await Payment.create({
      userId: req.user._id,
      package: pkg,
      amount: packagePrices[pkg] || 0,
      screenshot: {
        url: cloudResult.secure_url,
        publicId: cloudResult.public_id,
      },
      transactionId: transactionId || null,
    });

    res.status(201).json({
      success: true,
      message: "Payment proof submitted. Awaiting admin approval.",
      data: payment,
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

// ── ADMIN: Get all payments ───────────────────────
// ── @route  GET /api/payments
// ── @access Admin only
const getAllPayments = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const filter = status ? { status } : {};

    const payments = await Payment.find(filter)
      .populate("userId", "name email package accountStatus")
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Payment.countDocuments(filter);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: payments,
    });
  } catch (error) {
    next(error);
  }
};

// ── ADMIN: Approve payment ────────────────────────
// ── @route  PUT /api/payments/:id/approve
// ── @access Admin only
const approvePayment = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found.",
      });
    }

    if (payment.status === "approved") {
      return res.status(400).json({
        success: false,
        message: "Payment is already approved.",
      });
    }

    // Update payment status
    payment.status = "approved";
    payment.reviewedBy = req.user._id;
    payment.reviewedAt = new Date();
    await payment.save();

    // Activate user account & update package
    const user = await User.findById(payment.userId);
    if (user) {
      user.accountStatus = "active";
      user.package = payment.package;
      user.setPackageLimits();
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: `Payment approved. User account activated with ${payment.package} package.`,
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

// ── ADMIN: Reject payment ─────────────────────────
// ── @route  PUT /api/payments/:id/reject
// ── @access Admin only
const rejectPayment = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found.",
      });
    }

    payment.status = "rejected";
    payment.reviewedBy = req.user._id;
    payment.reviewedAt = new Date();
    payment.rejectionReason = reason || "Payment could not be verified.";
    await payment.save();

    // Update user account status to rejected
    await User.findByIdAndUpdate(payment.userId, {
      accountStatus: "rejected",
    });

    res.status(200).json({
      success: true,
      message: "Payment rejected.",
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyPayments,
  uploadPaymentProof,
  getAllPayments,
  approvePayment,
  rejectPayment,
};
