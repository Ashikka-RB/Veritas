const authMiddleware = require("../middleware/authMiddleware");

const express = require("express");

const router = express.Router();

const upload = require("../config/multer");

const {
  extractAadhaarData,
  extractPanData
} = require("../controllers/ocrController");

router.post(
  "/aadhaar",
  authMiddleware,
  upload.single("aadhaar"),
  extractAadhaarData
);

router.post(
  "/pan",
  authMiddleware,
  upload.single("pan"),
  extractPanData
);

module.exports = router;