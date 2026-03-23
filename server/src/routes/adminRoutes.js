const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  updateUserPackage,
  getPackages,
  updatePackage,
} = require("../controllers/adminController");
const { protect } = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/adminMiddleware");

router.use(protect, adminOnly); // All admin routes: must be logged in + admin

router.get("/stats", getDashboardStats);

router.get("/users", getAllUsers);
router.put("/users/:id/status", updateUserStatus);
router.put("/users/:id/package", updateUserPackage);

router.get("/packages", getPackages);
router.put("/packages/:id", updatePackage);

module.exports = router;
