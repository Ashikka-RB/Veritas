const User = require("../models/User");
const { logSecurityEvent } = require("../utils/auditLogger");

const uploadAadhaar = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("uploadAadhaar controller invoked for user:", userId);

    if (!req.file) {
      console.error("uploadAadhaar failed: req.file is undefined");
      return res.status(400).json({ success: false, message: "No Aadhaar image uploaded", error: "No Aadhaar image uploaded" });
    }

    console.log("uploadAadhaar file details:", {
      path: req.file.path,
      fieldname: req.file.fieldname,
      originalname: req.file.originalname
    });

    const filePath = req.file.path;

    const user = await User.findById(userId);
    if (!user) {
      console.error("uploadAadhaar failed: User not found in DB");
      return res.status(404).json({ success: false, message: "User not found", error: "User not found" });
    }
    if (user.kycStatus === "rejected" || user.kycStatus === "approved") {
      console.error("uploadAadhaar failed: KYC is already approved or rejected. kycStatus:", user.kycStatus);
      return res.status(400).json({ success: false, message: "KYC already completed or rejected.", error: "KYC already completed or rejected." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        aadhaarFile: filePath,
        aadhaarUploadedAt: new Date()
      },
      { new: true }
    );

    // Log Aadhaar upload
    await logSecurityEvent(userId, "AADHAAR_UPLOAD", req, "SUCCESS", "Aadhaar card document uploaded successfully");

    console.log("uploadAadhaar successfully saved and updated user record.");

    res.status(200).json({
      success: true,
      message: "Aadhaar uploaded successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
};

const uploadPan = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("uploadPan controller invoked for user:", userId);

    if (!req.file) {
      console.error("uploadPan failed: req.file is undefined");
      return res.status(400).json({ success: false, message: "No PAN image uploaded", error: "No PAN image uploaded" });
    }

    console.log("uploadPan file details:", {
      path: req.file.path,
      fieldname: req.file.fieldname,
      originalname: req.file.originalname
    });

    const filePath = req.file.path;

    const user = await User.findById(userId);
    if (!user) {
      console.error("uploadPan failed: User not found in DB");
      return res.status(404).json({ success: false, message: "User not found", error: "User not found" });
    }
    if (user.kycStatus === "rejected" || user.kycStatus === "approved") {
      console.error("uploadPan failed: KYC is already approved or rejected. kycStatus:", user.kycStatus);
      return res.status(400).json({ success: false, message: "KYC already completed or rejected.", error: "KYC already completed or rejected." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        panFile: filePath,
        panUploadedAt: new Date()
      },
      { new: true }
    );

    // Log PAN upload
    await logSecurityEvent(userId, "PAN_UPLOAD", req, "SUCCESS", "PAN card document uploaded successfully");

    console.log("uploadPan successfully saved and updated user record.");

    res.status(200).json({
      success: true,
      message: "PAN uploaded successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    });
  }
};

module.exports = {
  uploadAadhaar,
  uploadPan
};