const User = require("../models/User");
const Signal = require("../models/Signal");
const Payment = require("../models/Payment");
const Package = require("../models/Package");

// ── @route  GET /api/admin/stats
// ── @desc   Get admin dashboard stats
// ── @access Admin only
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      activeUsers,
      pendingPayments,
      approvedPayments,
      totalSignalsToday,
    ] = await Promise.all([
      User.countDocuments({ role: "user" }),
      User.countDocuments({ role: "user", accountStatus: "active" }),
      Payment.countDocuments({ status: "pending" }),
      Payment.countDocuments({ status: "approved" }),
      Signal.countDocuments({
        createdAt: {
          $gte: new Date().setHours(0, 0, 0, 0),
        },
      }),
    ]);

    // Revenue: sum of approved payments
    const revenueResult = await Payment.aggregate([
      { $match: { status: "approved" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // Monthly user registrations (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyUsers = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo }, role: "user" } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Package distribution
    const packageStats = await User.aggregate([
      { $match: { role: "user", accountStatus: "active" } },
      { $group: { _id: "$package", count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        pendingPayments,
        approvedPayments,
        totalSignalsToday,
        totalRevenue,
        monthlyUsers,
        packageStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── @route  GET /api/admin/users
// ── @desc   Get all users
// ── @access Admin only
const getAllUsers = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      package: pkg,
      search,
    } = req.query;

    const filter = { role: "user" };
    if (status) filter.accountStatus = status;
    if (pkg) filter.package = pkg;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// ── @route  PUT /api/admin/users/:id/status
// ── @desc   Update user account status
// ── @access Admin only
const updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ["active", "suspended", "pending", "rejected"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value.",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { accountStatus: status },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: `User status updated to ${status}.`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// ── @route  PUT /api/admin/users/:id/package
// ── @desc   Upgrade/change user package
// ── @access Admin only
const updateUserPackage = async (req, res, next) => {
  try {
    const { package: pkg } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.package = pkg;
    user.setPackageLimits();
    await user.save();

    res.status(200).json({
      success: true,
      message: `User package updated to ${pkg}.`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// ── @route  GET /api/admin/packages
// ── @desc   Get all packages
// ── @access Admin only
const getPackages = async (req, res, next) => {
  try {
    const packages = await Package.find().sort({ price: 1 });
    res.status(200).json({ success: true, data: packages });
  } catch (error) {
    next(error);
  }
};

// ── @route  PUT /api/admin/packages/:id
// ── @desc   Update a package
// ── @access Admin only
const updatePackage = async (req, res, next) => {
  try {
    const pkg = await Package.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!pkg) {
      return res.status(404).json({
        success: false,
        message: "Package not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Package updated.",
      data: pkg,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  updateUserPackage,
  getPackages,
  updatePackage,
};
