const express = require("express");

const router = express.Router();

const upload = require("../config/multer");

const {
  extractAadhaarData,
  extractPanData
} = require("../controllers/ocrController");

router.post(
  "/aadhaar",
  upload.single("aadhaar"),
  extractAadhaarData
);

router.post(
  "/pan",
  upload.single("pan"),
  extractPanData
);

module.exports = router;