const axios = require("axios");
const AdminQueue = require("../models/AdminQueue");
const User = require("../models/User");
const { logSecurityEvent } = require("../utils/auditLogger");

const analyzeVerification = async (req, res) => {
  try {
    const response = await axios.post(
      "http://127.0.0.1:5001/predict",
      req.body
    );

    // Log successful Face verification
    if (req.user && req.user.id) {
      await logSecurityEvent(
        req.user.id,
        "FACE_VERIFICATION",
        req,
        "SUCCESS",
        `Face match analysis score: ${req.body.faceMatch || 0}%, status: ${response.data.status}`
      );
    }

    res.json(response.data);
  } catch (error) {
    console.log("ML ERROR:", error.message);

    if (req.user && req.user.id) {
      await logSecurityEvent(
        req.user.id,
        "FACE_VERIFICATION",
        req,
        "FAILED",
        `Face match analysis failed: ${error.message}`
      );
    }

    res.status(500).json({
      message: "ML Analysis Failed",
      error: error.message
    });
  }
};

const getVerificationStatus = async (req, res) => {
  try {
    const record = await AdminQueue.findOne({ userId: req.params.userId }).sort({ submittedAt: -1 });
    if (!record) {
      return res.status(404).json({ message: "No verification record found for this user" });
    }
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch status", error: error.message });
  }
};

const saveFaceVerification = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("saveFaceVerification controller invoked for user:", userId);

    if (!req.file) {
      console.error("saveFaceVerification failed: req.file is undefined");
      return res.status(400).json({ success: false, message: "No face image uploaded", error: "No face image uploaded" });
    }

    console.log("saveFaceVerification file details:", {
      path: req.file.path,
      fieldname: req.file.fieldname,
      originalname: req.file.originalname
    });

    const user = await User.findById(userId);
    if (!user) {
      console.error("saveFaceVerification failed: User not found in DB");
      return res.status(404).json({ success: false, message: "User not found", error: "User not found" });
    }
    if (user.kycStatus === "rejected" || user.kycStatus === "approved") {
      console.error("saveFaceVerification failed: KYC is already approved or rejected. kycStatus:", user.kycStatus);
      return res.status(400).json({ success: false, message: "KYC already completed or rejected.", error: "KYC already completed or rejected." });
    }

    const faceImage = req.file.path; // e.g. Cloudinary URL
    const faceMatchScore = req.body.faceMatchScore ? parseFloat(req.body.faceMatchScore) : 0;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        faceImage,
        faceMatchScore,
        faceVerificationStatus: "COMPLETED",
        faceVerificationTimestamp: new Date(),
        livenessPassed: true
      },
      { new: true }
    );

    // Log the persistent face verification image upload
    await logSecurityEvent(
      userId,
      "FACE_VERIFICATION",
      req,
      "SUCCESS",
      `Face verification webcam image persisted successfully. Match score: ${faceMatchScore}%`
    );

    console.log("saveFaceVerification successfully saved face image URL to DB.");

    res.status(200).json({
      success: true,
      message: "Face verification image saved successfully",
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
  analyzeVerification,
  getVerificationStatus,
  saveFaceVerification
};