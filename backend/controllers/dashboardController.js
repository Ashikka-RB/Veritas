const User = require("../models/User");
const AdminQueue = require("../models/AdminQueue");
const AuditLog = require("../models/AuditLog");
const Device = require("../models/Device");

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

const getKycStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const latestQueue = await AdminQueue.findOne({ userId: user._id }).sort({ submittedAt: -1 });

    // Step calculation
    let currentStepKey = "AADHAAR";
    if (latestQueue && latestQueue.adminDecision === "REUPLOAD_REQUIRED") {
      currentStepKey = "AADHAAR";
    } else if (!user.aadhaarFile) {
      currentStepKey = "AADHAAR";
    } else if (!user.aadhaarNumber) {
      currentStepKey = "OCR";
    } else if (!user.panFile) {
      currentStepKey = "PAN";
    } else if (!latestQueue) {
      currentStepKey = "FACE";
    } else if (latestQueue.adminDecision === "PENDING") {
      currentStepKey = "REVIEW";
    } else {
      currentStepKey = "COMPLETED";
    }

    // Verification Status
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

    // Fraud risk category
    let fraudRisk = "—";
    if (latestQueue && latestQueue.rejectedProbability !== undefined) {
      const score = latestQueue.rejectedProbability;
      if (score < 30) fraudRisk = "Low";
      else if (score <= 70) fraudRisk = "Medium";
      else fraudRisk = "High";
    }

    // Admin Review Status
    let adminReviewStatus = "Pending";
    if (latestQueue) {
      if (latestQueue.adminDecision === "PENDING") {
        adminReviewStatus = "In Progress";
      } else {
        adminReviewStatus = latestQueue.adminDecision; // APPROVED / REJECTED / REUPLOAD_REQUIRED
      }
    }

    // Estimated Time
    let estimatedTime = "5–10 min";
    if (currentStepKey === "AADHAAR") estimatedTime = "5 min";
    else if (currentStepKey === "OCR") estimatedTime = "4 min";
    else if (currentStepKey === "PAN") estimatedTime = "3 min";
    else if (currentStepKey === "FACE") estimatedTime = "2 min";
    else if (currentStepKey === "REVIEW") estimatedTime = "5–10 min";
    else if (currentStepKey === "COMPLETED") estimatedTime = "0 min";

    // Build timeline
    const timeline = [];

    // Step 1: Registration
    timeline.push({
      step: "Account Created & OTP Verified",
      status: "Completed",
      completedAt: user.createdAt
    });

    // Step 2: Aadhaar Card Upload
    let aadhaarStatus = "Pending";
    if (user.aadhaarFile) {
      aadhaarStatus = "Completed";
    } else if (currentStepKey === "AADHAAR") {
      aadhaarStatus = "In Progress";
    }
    timeline.push({
      step: "Aadhaar Card Upload",
      status: aadhaarStatus,
      completedAt: user.aadhaarUploadedAt || null
    });

    // Step 3: OCR Extraction & Review
    let ocrStatus = "Pending";
    if (user.aadhaarNumber) {
      ocrStatus = "Completed";
    } else if (currentStepKey === "OCR") {
      ocrStatus = "In Progress";
    }
    timeline.push({
      step: "OCR Extraction & Review",
      status: ocrStatus,
      completedAt: user.ocrCompletedAt || null
    });

    // Step 4: PAN Card Upload
    let panStatus = "Pending";
    if (user.panFile) {
      panStatus = "Completed";
    } else if (currentStepKey === "PAN") {
      panStatus = "In Progress";
    }
    timeline.push({
      step: "PAN Card Upload",
      status: panStatus,
      completedAt: user.panUploadedAt || null
    });

    // Step 5: Live Face Verification
    let faceStatus = "Pending";
    if (latestQueue) {
      faceStatus = "Completed";
    } else if (currentStepKey === "FACE") {
      faceStatus = "In Progress";
    }
    timeline.push({
      step: "Live Face Verification",
      status: faceStatus,
      completedAt: latestQueue ? latestQueue.submittedAt : null
    });

    // Step 6: Admin Review
    let adminStatus = "Pending";
    if (latestQueue) {
      if (latestQueue.adminDecision !== "PENDING") {
        adminStatus = "Completed";
      } else {
        adminStatus = "In Progress";
      }
    }
    timeline.push({
      step: "Admin Review",
      status: adminStatus,
      completedAt: latestQueue && latestQueue.adminDecision !== "PENDING" ? (latestQueue.decidedAt || latestQueue.updatedAt) : null
    });

    res.status(200).json({
      userId: user._id,
      fullName: user.fullName,
      verificationStatus,
      currentStep: currentStepKey,
      ocrScore: latestQueue ? latestQueue.ocrConfidence : null,
      faceMatchScore: latestQueue ? latestQueue.faceMatchScore : null,
      fraudRisk,
      adminReviewStatus,
      estimatedTime,
      timeline,
      adminNotes: latestQueue ? latestQueue.adminNotes : null,
      rejectionReason: latestQueue ? latestQueue.rejectionReason : null,
      reuploadReason: latestQueue ? latestQueue.reuploadReason : null,
      rejectedProbability: latestQueue ? latestQueue.rejectedProbability : null
    });

  } catch (error) {
    console.error("Error in getKycStatus:", error);
    res.status(500).json({
      message: "Failed to fetch KYC status",
      error: error.message
    });
  }
};

const getKycProcess = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const latestQueue = await AdminQueue.findOne({ userId: user._id }).sort({ submittedAt: -1 });

    // Booleans
    const aadhaarUploaded = !!user.aadhaarFile;
    const ocrCompleted = !!user.aadhaarNumber;
    const panUploaded = !!user.panFile;
    const faceVerificationCompleted = !!latestQueue;
    const adminReviewStarted = !!latestQueue;

    // Overall Status
    let status = "Pending";
    if (latestQueue) {
      if (latestQueue.adminDecision === "APPROVED") {
        status = "Approved";
      } else if (latestQueue.adminDecision === "REJECTED") {
        status = "Rejected";
      } else if (latestQueue.adminDecision === "REUPLOAD_REQUIRED") {
        status = "Action Required";
      } else if (latestQueue.adminDecision === "PENDING") {
        status = "Under Review";
      }
    } else if (user.aadhaarFile || user.panFile) {
      status = "In Progress";
    }

    // Step status calculation
    // Step 1: Upload Aadhaar Card
    let step1Status = "Ready";
    if (latestQueue && latestQueue.adminDecision === "REUPLOAD_REQUIRED") {
      step1Status = "Requires Action";
    } else if (aadhaarUploaded) {
      step1Status = "Completed";
    }

    // Step 2: Review OCR Details
    let step2Status = "Not Started";
    if (ocrCompleted) {
      step2Status = "Completed";
    } else if (aadhaarUploaded) {
      step2Status = "Ready";
    }

    // Step 3: Upload PAN Card
    let step3Status = "Not Started";
    if (panUploaded) {
      step3Status = "Completed";
    } else if (ocrCompleted) {
      step3Status = "Ready";
    }

    // Step 4: Live Face Verification
    let step4Status = "Not Started";
    if (faceVerificationCompleted) {
      step4Status = "Completed";
    } else if (panUploaded) {
      step4Status = "Ready";
    }

    // Step 5: Admin Review
    let step5Status = "Not Started";
    if (latestQueue) {
      if (latestQueue.adminDecision === "APPROVED") {
        step5Status = "Completed";
      } else if (latestQueue.adminDecision === "REJECTED") {
        step5Status = "Rejected";
      } else if (latestQueue.adminDecision === "REUPLOAD_REQUIRED") {
        step5Status = "Requires Action";
      } else if (latestQueue.adminDecision === "PENDING") {
        step5Status = "In Progress";
      }
    }

    // currentStep calculation (1 to 5)
    let currentStep = 1;
    if (latestQueue && latestQueue.adminDecision === "REUPLOAD_REQUIRED") {
      currentStep = 1;
    } else if (!aadhaarUploaded) {
      currentStep = 1;
    } else if (!ocrCompleted) {
      currentStep = 2;
    } else if (!panUploaded) {
      currentStep = 3;
    } else if (!faceVerificationCompleted) {
      currentStep = 4;
    } else {
      currentStep = 5;
    }

    const steps = [
      {
        id: 1,
        name: "Upload Aadhaar Card",
        status: step1Status,
        completedAt: user.aadhaarUploadedAt || null
      },
      {
        id: 2,
        name: "Review OCR Details",
        status: step2Status,
        completedAt: user.ocrCompletedAt || null
      },
      {
        id: 3,
        name: "Upload PAN Card",
        status: step3Status,
        completedAt: user.panUploadedAt || null
      },
      {
        id: 4,
        name: "Live Face Verification",
        status: step4Status,
        completedAt: latestQueue ? latestQueue.submittedAt : null
      },
      {
        id: 5,
        name: "Admin Review",
        status: step5Status,
        completedAt: latestQueue && latestQueue.adminDecision !== "PENDING" ? (latestQueue.decidedAt || latestQueue.updatedAt) : null
      }
    ];

    res.status(200).json({
      currentStep,
      status,
      aadhaarUploaded,
      ocrCompleted,
      panUploaded,
      faceVerificationCompleted,
      adminReviewStarted,
      steps,
      adminNotes: latestQueue ? latestQueue.adminNotes : null,
      rejectionReason: latestQueue ? latestQueue.rejectionReason : null,
      reuploadReason: latestQueue ? latestQueue.reuploadReason : null
    });

  } catch (error) {
    console.error("Error in getKycProcess:", error);
    res.status(500).json({
      message: "Failed to fetch KYC process status",
      error: error.message
    });
  }
};

const getSecurityLogs = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 1. Fetch user's audit logs
    const logs = await AuditLog.find({
      $or: [
        { userId: user._id },
        { email: user.email }
      ]
    }).sort({ createdAt: -1 });

    // 2. Fetch user's devices
    const devices = await Device.find({ userId: user._id }).sort({ lastSeenAt: -1 });

    // 3. Calculate metrics
    const totalLogins = await AuditLog.countDocuments({
      userId: user._id,
      eventType: "LOGIN_SUCCESS",
      status: "SUCCESS"
    });

    const failedAttempts = await AuditLog.countDocuments({
      $or: [
        { userId: user._id },
        { email: user.email }
      ],
      eventType: "LOGIN_FAILURE",
      status: "FAILED"
    });

    const totalDevices = devices.length;

    // 4. Format logs for the frontend
    const formattedLogs = logs.map(log => {
      let eventText = log.eventType;
      if (log.eventType === "LOGIN_SUCCESS") {
        eventText = `LOGIN SUCCESS · ${log.browser} · ${log.os} · ${log.location}`;
      } else if (log.eventType === "LOGIN_FAILURE") {
        eventText = `LOGIN FAILED · ${log.details || "Wrong credentials"}`;
      } else if (log.eventType === "ACCOUNT_CREATION") {
        eventText = "ACCOUNT CREATED";
      } else if (log.eventType === "LOGOUT") {
        eventText = `LOGOUT · ${log.browser} · ${log.os}`;
      } else if (log.eventType === "PASSWORD_CHANGE") {
        eventText = "PASSWORD CHANGED";
      } else if (log.eventType === "PASSWORD_RESET_REQUEST") {
        eventText = "PASSWORD RESET LINK REQUESTED";
      } else if (log.eventType === "AADHAAR_UPLOAD") {
        eventText = "AADHAAR UPLOADED";
      } else if (log.eventType === "OCR_COMPLETION") {
        eventText = `OCR COMPLETED · ${log.details}`;
      } else if (log.eventType === "PAN_UPLOAD") {
        eventText = "PAN UPLOADED";
      } else if (log.eventType === "FACE_VERIFICATION") {
        eventText = `FACE VERIFICATION · ${log.details}`;
      } else if (log.eventType === "ADMIN_REVIEW_SUBMISSION") {
        eventText = "SUBMITTED TO REVIEW QUEUE";
      } else if (log.eventType === "ADMIN_DECISION") {
        eventText = `ADMIN DECISION · ${log.details}`;
      }

      return {
        _id: log._id,
        timestamp: log.createdAt,
        eventType: log.eventType,
        eventText,
        status: log.status,
        ipAddress: log.ipAddress
      };
    });

    // 5. Determine active device matching current request user-agent and IP
    const { getIpAddress, parseUserAgent } = require("../utils/auditLogger");
    const currentIp = getIpAddress(req);
    const { browser, os } = parseUserAgent(req.headers["user-agent"]);

    const formattedDevices = devices.map(dev => {
      // Mark active if matches current browser, OS, and IP address
      const isActive = dev.browser === browser && dev.os === os && dev.ipAddress === currentIp;
      return {
        _id: dev._id,
        deviceType: dev.deviceType,
        browser: dev.browser,
        os: dev.os,
        ipAddress: dev.ipAddress,
        lastSeenAt: dev.lastSeenAt,
        isActive
      };
    });

    res.status(200).json({
      metrics: {
        totalLogins,
        failedAttempts,
        totalDevices
      },
      logs: formattedLogs,
      devices: formattedDevices
    });

  } catch (error) {
    console.error("Error in getSecurityLogs:", error);
    res.status(500).json({
      message: "Failed to fetch security logs",
      error: error.message
    });
  }
};

module.exports = {
  getDashboardData,
  getNotifications,
  getTimeline,
  getKycStatus,
  getKycProcess,
  getSecurityLogs
};
