const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuthMiddleware");
const {
  getAdminMetrics,
  getWeeklyVerifications,
  getFraudDistribution
} = require("../controllers/adminAnalyticsController");

// Protect all analytics endpoints with adminAuth
router.use(adminAuth);

router.get("/metrics", getAdminMetrics);
router.get("/weekly-verifications", getWeeklyVerifications);
router.get("/fraud-distribution", getFraudDistribution);

module.exports = router;
