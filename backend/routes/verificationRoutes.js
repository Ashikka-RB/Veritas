const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  analyzeVerification,
  getVerificationStatus
} = require("../controllers/verificationController");

router.post("/analyze", protect, analyzeVerification);
router.get("/status/:userId", protect, getVerificationStatus);

module.exports = router;
