const express = require("express");

const router = express.Router();

const upload = require("../config/multer");

const authMiddleware = require("../middleware/authMiddleware");

const {
  uploadAadhaar
} = require("../controllers/uploadController");

router.post(
  "/aadhaar",
  authMiddleware,
  upload.single("aadhaar"),
  uploadAadhaar
);

module.exports = router;