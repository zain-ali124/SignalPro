const Signal = require("../models/Signal");
const User = require("../models/User");

// ── @route  GET /api/signals
// ── @desc   Get signals based on user package limit
// ── @access Private (active users only)
const getSignals = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    // Check if user has a valid package
    if (!user.package || user.package === "none") {
      return res.status(403).json({
        success: false,
        message: "You don't have an active package to view signals.",
      });
    }

    // Check daily limit
    if (user.signalsUsedToday >= user.signalsPerDay) {
      return res.status(429).json({
        success: false,
        message: `Daily signal limit reached (${user.signalsPerDay} signals/day). Resets at midnight.`,
        signalsUsedToday: user.signalsUsedToday,
        signalsPerDay: user.signalsPerDay,
      });
    }

    // How many signals can user still see today?
    const remaining = user.signalsPerDay - user.signalsUsedToday;

    // Get today's signals visible to user's package
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const signals = await Signal.find({
      isActive: true,
      visibleTo: user.package,
      createdAt: { $gte: today },
    })
      .sort({ createdAt: -1 })
      .limit(remaining);

    // Update user's signals used today
    user.signalsUsedToday += signals.length;
    await user.save();

    res.status(200).json({
      success: true,
      count: signals.length,
      signalsUsedToday: user.signalsUsedToday,
      signalsPerDay: user.signalsPerDay,
      remaining: user.signalsPerDay - user.signalsUsedToday,
      data: signals,
    });
  } catch (error) {
    next(error);
  }
};

// ── @route  GET /api/signals/all
// ── @desc   Get all signals (with package filter, no daily limit deduction)
// ── @access Private (active users only)
const getAllSignals = async (req, res, next) => {
  try {
    const user = req.user;
    const { page = 1, limit = 20 } = req.query;

    const signals = await Signal.find({
      isActive: true,
      visibleTo: user.package,
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Signal.countDocuments({
      isActive: true,
      visibleTo: user.package,
    });

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: signals,
    });
  } catch (error) {
    next(error);
  }
};

// ── ADMIN: Create signal ──────────────────────────
// ── @route  POST /api/signals
// ── @desc   Admin posts a signal
// ── @access Admin only
const createSignal = async (req, res, next) => {
  try {
    const {
      pair,
      entryPrice,
      stopLoss,
      takeProfit,
      signalType,
      description,
      targetLevels,
      visibleTo,
    } = req.body;

    const signal = await Signal.create({
      pair,
      entryPrice,
      stopLoss,
      takeProfit,
      signalType,
      description,
      targetLevels: targetLevels || [],
      visibleTo: visibleTo || ["bronze", "silver", "gold", "diamond"],
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Signal created successfully.",
      data: signal,
    });
  } catch (error) {
    next(error);
  }
};

// ── ADMIN: Update signal result ──────────────────
// ── @route  PUT /api/signals/:id
// ── @access Admin only
const updateSignal = async (req, res, next) => {
  try {
    const signal = await Signal.findById(req.params.id);

    if (!signal) {
      return res.status(404).json({
        success: false,
        message: "Signal not found.",
      });
    }

    const updated = await Signal.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Signal updated.",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// ── ADMIN: Delete signal ──────────────────────────
// ── @route  DELETE /api/signals/:id
// ── @access Admin only
const deleteSignal = async (req, res, next) => {
  try {
    const signal = await Signal.findByIdAndDelete(req.params.id);

    if (!signal) {
      return res.status(404).json({
        success: false,
        message: "Signal not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Signal deleted.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSignals,
  getAllSignals,
  createSignal,
  updateSignal,
  deleteSignal,
};
