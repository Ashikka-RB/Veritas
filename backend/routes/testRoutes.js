const express = require("express");
const router = express.Router();
const cloudinary = require("../config/cloudinary");

router.get("/cloudinary", async (req, res) => {
  try {
    console.log("TEST ROUTE: Testing Cloudinary configuration...");
    const resolvedConfig = {
      cloud_name: cloudinary.config().cloud_name,
      api_key: cloudinary.config().api_key ? "PRESENT" : "MISSING",
      api_secret: cloudinary.config().api_secret ? "PRESENT" : "MISSING"
    };
    console.log("Cloudinary Resolved Config in Test Route:", resolvedConfig);

    if (!resolvedConfig.cloud_name || resolvedConfig.api_key === "MISSING" || resolvedConfig.api_secret === "MISSING") {
      throw new Error("Cloudinary configuration keys are missing or undefined.");
    }

    const testImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

    console.log("TEST ROUTE: Uploading dummy base64 pixel to Cloudinary...");
    const uploadResult = await cloudinary.uploader.upload(testImage, {
      folder: "veritas-ekyc/test"
    });

    console.log("TEST UPLOAD SUCCESS:", uploadResult);
    res.json({
      success: true,
      message: "Cloudinary configuration is valid and test upload succeeded!",
      uploadResult: {
        public_id: uploadResult.public_id,
        secure_url: uploadResult.secure_url,
        format: uploadResult.format
      }
    });
  } catch (error) {
    console.error("TEST ROUTE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Cloudinary test upload failed",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
});

module.exports = router;
