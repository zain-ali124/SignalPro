const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  changePassword,
  getSignalStatus,
} = require("../controllers/userController");
const { protect, activeOnly } = require("../middlewares/authMiddleware");
const { upload } = require("../middlewares/uploadMiddleware");

router.use(protect); // All user routes require login

router.get("/profile", getProfile);
router.put("/profile", upload.single("profilePicture"), updateProfile);
router.put("/change-password", changePassword);
router.get("/signal-status", activeOnly, getSignalStatus);

module.exports = router;
