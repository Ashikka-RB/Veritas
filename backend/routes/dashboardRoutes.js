const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { getDashboardData, getNotifications, getTimeline, getKycStatus, getKycProcess, getSecurityLogs } = require("../controllers/dashboardController");

router.get("/dashboard", protect, getDashboardData);
router.get("/notifications", protect, getNotifications);
router.get("/verification-timeline", protect, getTimeline);
router.get("/kyc/status", protect, getKycStatus);
router.get("/kyc/process", protect, getKycProcess);
router.get("/security/logs", protect, getSecurityLogs);

module.exports = router;
