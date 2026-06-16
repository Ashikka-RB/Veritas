const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  sendOtp,
  verifyOtp,
  forgotPassword,
  resetPassword,
  logoutUser
} = require("../controllers/authController");

const authMiddleware =
  require("../middleware/authMiddleware");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", authMiddleware, logoutUser);

router.post("/send-otp", sendOtp);

router.post("/verify-otp", verifyOtp);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

router.get(
  "/profile",
  authMiddleware,
  getProfile
);

module.exports = router;