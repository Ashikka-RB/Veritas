const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const uploadFace = require("../config/multerFace");

const {
  analyzeVerification,
  getVerificationStatus,
  saveFaceVerification
} = require("../controllers/verificationController");

router.post("/analyze", protect, analyzeVerification);
router.get("/status/:userId", protect, getVerificationStatus);
router.post("/face", protect, uploadFace.single("face"), saveFaceVerification);

module.exports = router;
