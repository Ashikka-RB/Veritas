const express = require("express");

const router = express.Router();

const upload = require("../config/multer");

const {
  extractAadhaarData
} = require("../controllers/ocrController");

router.post(
  "/aadhaar",
  upload.single("aadhaar"),
  extractAadhaarData
);

module.exports = router;