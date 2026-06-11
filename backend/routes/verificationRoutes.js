const express = require("express");
const router = express.Router();

const {
  analyzeVerification,
  getVerificationStatus
} = require("../controllers/verificationController");

router.post("/analyze", analyzeVerification);
router.get("/status/:userId", getVerificationStatus);

module.exports = router;
