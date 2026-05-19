const express = require("express");

const router = express.Router();

const upload = require("../config/multer");

const authMiddleware = require("../middleware/authMiddleware");

const {
  uploadAadhaar,
  uploadPan
} = require("../controllers/uploadController");

router.post(
  "/aadhaar",
  authMiddleware,
  upload.single("aadhaar"),
  uploadAadhaar
);

router.post(
  "/pan",
  authMiddleware,
  upload.single("pan"),
  uploadPan
);

module.exports = router;