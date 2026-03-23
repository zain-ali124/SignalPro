const User = require("../models/User");
const Payment = require("../models/Payment");
const generateToken = require("../utils/generateToken");
const { uploadToCloudinary } = require("../config/cloudinary");
const crypto = require("crypto");
const fs = require("fs");

// ── @route  POST /api/auth/register
// ── @desc   Register new user & submit payment proof
// ── @access Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, package: pkg, transactionId } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered.",
      });
    }

    // Payment proof is required
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Payment proof screenshot is required.",
      });
    }

    // Upload screenshot to Cloudinary
    const cloudResult = await uploadToCloudinary(
      req.file.path,
      "payment-proofs"
    );

    // Remove local file after upload
    fs.unlinkSync(req.file.path);

    // Get package price
    const packagePrices = {
      bronze: 29,
      silver: 49,
      gold: 99,
      diamond: 199,
    };

    // Create user (status = pending until admin approves)
    const user = await User.create({
      name,
      email,
      password,
      package: pkg || "bronze",
      accountStatus: "pending",
      paymentProof: {
        url: cloudResult.secure_url,
        publicId: cloudResult.public_id,
      },
    });

    // Set package limits
    user.setPackageLimits();
    await user.save();

    // Create payment record
    await Payment.create({
      userId: user._id,
      package: pkg || "bronze",
      amount: packagePrices[pkg] || packagePrices.bronze,
      screenshot: {
        url: cloudResult.secure_url,
        publicId: cloudResult.public_id,
      },
      transactionId: transactionId || null,
    });

    res.status(201).json({
      success: true,
      message:
        "Registration successful! Your account is pending admin approval.",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        package: user.package,
        accountStatus: user.accountStatus,
      },
    });
  } catch (error) {
    // Remove local file if error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

// ── @route  POST /api/auth/login
// ── @desc   Login user
// ── @access Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user with password
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Check if suspended
    if (user.accountStatus === "suspended") {
      return res.status(403).json({
        success: false,
        message: "Your account has been suspended. Contact support.",
      });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        package: user.package,
        accountStatus: user.accountStatus,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── @route  GET /api/auth/me
// ── @desc   Get current logged-in user
// ── @access Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// ── @route  POST /api/auth/forgot-password
// ── @desc   Send password reset token
// ── @access Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with that email.",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // TODO: Send email with reset link
    // For now, return token in dev mode
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email.",
      ...(process.env.NODE_ENV === "development" && { resetUrl }),
    });
  } catch (error) {
    next(error);
  }
};

// ── @route  POST /api/auth/reset-password/:token
// ── @desc   Reset password using token
// ── @access Public
const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    // Hash the incoming token to compare with DB
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Reset token is invalid or has expired.",
      });
    }

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful. Please log in.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
};
