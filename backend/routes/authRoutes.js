const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  sendOtp,
  verifyOtp
} = require("../controllers/authController");

const authMiddleware =
  require("../middleware/authMiddleware");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/send-otp", sendOtp);

router.post("/verify-otp", verifyOtp);

router.get(
  "/profile",
  authMiddleware,
  getProfile
);

module.exports = router;