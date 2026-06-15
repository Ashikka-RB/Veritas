const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { getDashboardData, getNotifications, getTimeline } = require("../controllers/dashboardController");

router.get("/dashboard", protect, getDashboardData);
router.get("/notifications", protect, getNotifications);
router.get("/verification-timeline", protect, getTimeline);

module.exports = router;
