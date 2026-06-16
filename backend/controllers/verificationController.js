const axios = require("axios");
const AdminQueue = require("../models/AdminQueue");
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

module.exports = {
  analyzeVerification,
  getVerificationStatus
};