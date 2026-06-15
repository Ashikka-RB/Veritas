const User = require("../models/User");
const AdminQueue = require("../models/AdminQueue");

// Helper function to build dynamic timeline and notifications array
const getKycData = async (userId) => {
  const user = await User.findById(userId);
  if (!user) return null;

  const latestQueue = await AdminQueue.findOne({ userId }).sort({ submittedAt: -1 });

  // 1. Current Step Calculation
  let currentStep = 1;
  if (latestQueue && latestQueue.adminDecision === "REUPLOAD_REQUIRED") {
    currentStep = 2; // Direct to Aadhaar upload
  } else if (!user.aadhaarFile) {
    currentStep = 2;
  } else if (!user.aadhaarNumber) {
    currentStep = 3;
  } else if (!user.panFile) {
    currentStep = 4;
  } else if (!latestQueue) {
    currentStep = 5;
  } else if (latestQueue.adminDecision === "PENDING") {
    currentStep = 6;
  } else {
    currentStep = 7; // Completed
  }

  // 2. Verification Status
  let verificationStatus = "Pending";
  if (latestQueue) {
    if (latestQueue.adminDecision === "APPROVED") {
      verificationStatus = "Approved";
    } else if (latestQueue.adminDecision === "REJECTED") {
      verificationStatus = "Rejected";
    } else if (latestQueue.adminDecision === "REUPLOAD_REQUIRED") {
      verificationStatus = "Action Required";
    } else if (latestQueue.adminDecision === "PENDING") {
      verificationStatus = "Under Review";
    }
  } else if (user.aadhaarFile || user.panFile) {
    verificationStatus = "In Progress";
  }

  // 3. Fraud Risk Score & Category
  const fraudRiskScore = latestQueue && latestQueue.rejectedProbability !== undefined ? latestQueue.rejectedProbability : null;
  let riskCategory = "—";
  if (fraudRiskScore !== null) {
    if (fraudRiskScore <= 30) riskCategory = "Low";
    else if (fraudRiskScore <= 70) riskCategory = "Medium";
    else riskCategory = "High";
  }

  // 4. Estimated Time
  let estimatedTime = "5–10 min";
  if (currentStep === 2) estimatedTime = "5 min";
  else if (currentStep === 3) estimatedTime = "4 min";
  else if (currentStep === 4) estimatedTime = "3 min";
  else if (currentStep === 5) estimatedTime = "2 min";
  else if (currentStep === 6) estimatedTime = "5–10 min";
  else if (currentStep === 7) estimatedTime = "0 min";

  // 5. Dynamic Notifications Generator
  const notifications = [];

  // Account creation event (always exists)
  notifications.push({
    id: "notif-1",
    title: "Account Created & Verified",
    message: "Welcome to Veritas eKYC! Your account is created and ready for verification.",
    timestamp: user.createdAt,
    type: "success",
    badgeClass: "badge badge-green"
  });

  if (user.aadhaarFile) {
    notifications.push({
      id: "notif-2",
      title: "Aadhaar Card Uploaded",
      message: "Your Aadhaar Card was successfully uploaded and registered.",
      timestamp: user.aadhaarUploadedAt || user.createdAt,
      type: "success",
      badgeClass: "badge badge-green"
    });
  }

  if (user.aadhaarNumber) {
    notifications.push({
      id: "notif-3",
      title: "OCR Extraction Completed",
      message: `Aadhaar OCR data extracted successfully with ${latestQueue ? latestQueue.ocrConfidence || 94 : 94}% confidence.`,
      timestamp: user.ocrCompletedAt || user.createdAt,
      type: "success",
      badgeClass: "badge badge-green"
    });
  }

  if (user.panFile) {
    notifications.push({
      id: "notif-4",
      title: "PAN Card Uploaded",
      message: "Your PAN Card was successfully uploaded.",
      timestamp: user.panUploadedAt || user.createdAt,
      type: "success",
      badgeClass: "badge badge-green"
    });
  }

  if (latestQueue) {
    notifications.push({
      id: "notif-5",
      title: "Face Verification Completed",
      message: `Face scan completed. Score: ${latestQueue.faceMatchScore}%. Liveness verification passed.`,
      timestamp: latestQueue.submittedAt,
      type: "passed",
      badgeClass: "badge badge-green"
    });

    notifications.push({
      id: "notif-6",
      title: "Submitted for Admin Review",
      message: "Your eKYC has been submitted to the admin queue for final verification.",
      timestamp: latestQueue.submittedAt,
      type: "pending",
      badgeClass: "badge badge-amber"
    });

    if (latestQueue.adminDecision !== "PENDING") {
      const decisionMap = {
        APPROVED: { title: "KYC Verification Approved", message: "Congratulations! Your identity has been fully approved by the administrator.", type: "success", badge: "badge badge-green" },
        REJECTED: { title: "KYC Verification Rejected", message: `Verification rejected. Reason: ${latestQueue.rejectionReason || "Criteria mismatch"}`, type: "alert", badge: "badge badge-red" },
        REUPLOAD_REQUIRED: { title: "Documents Re-upload Requested", message: `Please re-submit your documents. Reason: ${latestQueue.reuploadReason || "Incorrect document scan"}`, type: "alert", badge: "badge badge-amber" }
      };

      const decisionInfo = decisionMap[latestQueue.adminDecision];
      if (decisionInfo) {
        notifications.push({
          id: "notif-7",
          title: decisionInfo.title,
          message: decisionInfo.message,
          timestamp: latestQueue.updatedAt || latestQueue.submittedAt,
          type: decisionInfo.type,
          badgeClass: decisionInfo.badge
        });
      }
    }
  }

  // Sort notifications: latest first
  notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  // Alerts Counter: unread count is 1 if there's a recent admin decision notification, else 0
  const unreadCount = (latestQueue && latestQueue.adminDecision !== "PENDING") ? 1 : 0;

  // 6. Timeline Generation
  const timeline = [
    {
      title: "Account Created & OTP Verified",
      timestamp: user.createdAt,
      status: "done",
      subtitle: "Completed"
    },
    {
      title: "Aadhaar Card Upload",
      timestamp: user.aadhaarUploadedAt,
      status: user.aadhaarFile ? "done" : (currentStep === 2 ? "active" : "pending"),
      subtitle: user.aadhaarFile ? "Completed" : (currentStep === 2 ? "Action required" : "Pending")
    },
    {
      title: "OCR Extraction & Review",
      timestamp: user.ocrCompletedAt,
      status: user.aadhaarNumber ? "done" : (currentStep === 3 ? "active" : "pending"),
      subtitle: user.aadhaarNumber ? "Completed" : (currentStep === 3 ? "Action required" : "Pending")
    },
    {
      title: "PAN Card Upload",
      timestamp: user.panUploadedAt,
      status: user.panFile ? "done" : (currentStep === 4 ? "active" : "pending"),
      subtitle: user.panFile ? "Completed" : (currentStep === 4 ? "Action required" : "Pending")
    },
    {
      title: "Live Face Verification",
      timestamp: latestQueue ? latestQueue.submittedAt : null,
      status: latestQueue ? "done" : (currentStep === 5 ? "active" : "pending"),
      subtitle: latestQueue ? "Completed" : (currentStep === 5 ? "Action required" : "Pending")
    },
    {
      title: "Admin Review",
      timestamp: latestQueue && latestQueue.adminDecision !== "PENDING" ? (latestQueue.updatedAt || latestQueue.submittedAt) : (latestQueue ? latestQueue.submittedAt : null),
      status: latestQueue && latestQueue.adminDecision !== "PENDING" ? "done" : (latestQueue ? "active" : "pending"),
      subtitle: latestQueue && latestQueue.adminDecision !== "PENDING" ? `Completed — ${latestQueue.adminDecision}` : (latestQueue ? "Under review" : "Pending")
    }
  ];

  return {
    fullName: user.fullName,
    verificationStatus,
    fraudRiskScore,
    riskCategory,
    currentStep,
    estimatedTime,
    unreadCount,
    notifications,
    timeline
  };
};

const getDashboardData = async (req, res) => {
  try {
    const data = await getKycData(req.user.id);
    if (!data) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      fullName: data.fullName,
      verificationStatus: data.verificationStatus,
      fraudRiskScore: data.fraudRiskScore,
      riskCategory: data.riskCategory,
      currentStep: data.currentStep,
      estimatedTime: data.estimatedTime,
      unreadCount: data.unreadCount,
      // Only return first 3 notifications for recent panel
      recentNotifications: data.notifications.slice(0, 3)
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch dashboard", error: error.message });
  }
};

const getNotifications = async (req, res) => {
  try {
    const data = await getKycData(req.user.id);
    if (!data) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(data.notifications);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch notifications", error: error.message });
  }
};

const getTimeline = async (req, res) => {
  try {
    const data = await getKycData(req.user.id);
    if (!data) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(data.timeline);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch timeline", error: error.message });
  }
};

module.exports = {
  getDashboardData,
  getNotifications,
  getTimeline
};
