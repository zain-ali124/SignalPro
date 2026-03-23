const User = require("../models/User");
const { uploadToCloudinary } = require("../config/cloudinary");
const fs = require("fs");
const bcrypt = require("bcryptjs");

// ── @route  GET /api/users/profile
// ── @desc   Get user profile
// ── @access Private
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// ── @route  PUT /api/users/profile
// ── @desc   Update user name / profile picture
// ── @access Private
const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;

    // Handle profile picture upload
    if (req.file) {
      const cloudResult = await uploadToCloudinary(
        req.file.path,
        "profile-pictures"
      );
      fs.unlinkSync(req.file.path);

      user.profilePicture = {
        url: cloudResult.secure_url,
        publicId: cloudResult.public_id,
      };
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated.",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// ── @route  PUT /api/users/change-password
// ── @desc   Change password
// ── @access Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select("+password");

    if (!(await user.matchPassword(currentPassword))) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// ── @route  GET /api/users/signal-status
// ── @desc   Get user's today signal usage
// ── @access Private
const getSignalStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      data: {
        package: user.package,
        signalsPerDay: user.signalsPerDay,
        signalsUsedToday: user.signalsUsedToday,
        remaining: Math.max(0, user.signalsPerDay - user.signalsUsedToday),
        lastReset: user.lastSignalReset,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  getSignalStatus,
};
