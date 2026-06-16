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
    if (!req.file) {
      return res.status(400).json({ message: "No face image uploaded" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.kycStatus === "rejected" || user.kycStatus === "approved") {
      return res.status(400).json({ message: "KYC already completed or rejected." });
    }

    const faceImage = req.file.path; // e.g. uploads/face/face_<userId>_<timestamp>.jpg
    const faceMatchScore = req.body.faceMatchScore ? parseFloat(req.body.faceMatchScore) : 0;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        faceImage,
        faceMatchScore,
        faceVerificationStatus: "COMPLETED",
        faceVerificationTimestamp: new Date()
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

    res.status(200).json({
      success: true,
      message: "Face verification image saved successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Error saving face verification:", error);
    res.status(500).json({
      message: "Failed to save face verification",
      error: error.message
    });
  }
};

module.exports = {
  analyzeVerification,
  getVerificationStatus,
  saveFaceVerification
};