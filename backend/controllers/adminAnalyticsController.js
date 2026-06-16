const User = require("../models/User");
const AdminQueue = require("../models/AdminQueue");

// GET /api/admin/analytics/metrics
const getAdminMetrics = async (req, res) => {
  try {
    // 1. Total registered users
    const totalUsers = await User.countDocuments();

    // 2. New users registered today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: startOfToday }
    });

    // 3. Pending reviews
    const pendingReviews = await AdminQueue.countDocuments({
      adminDecision: "PENDING"
    });

    // 4. Avg. wait time (in minutes) between submission and review decision
    const completedReviews = await AdminQueue.find({
      adminDecision: { $ne: "PENDING" },
      decidedAt: { $exists: true, $ne: null }
    });

    let totalWaitTimeMs = 0;
    let completedCount = 0;
    for (const doc of completedReviews) {
      if (doc.submittedAt && doc.decidedAt) {
        totalWaitTimeMs += (doc.decidedAt - doc.submittedAt);
        completedCount++;
      }
    }
    // Default to 4 minutes fallback if no data exists
    const avgWaitTime = completedCount > 0 
      ? Math.round((totalWaitTimeMs / completedCount) / 60000) 
      : 4;

    // 5. Fraud alerts (pending queue with score > 70)
    const fraudAlerts = await AdminQueue.countDocuments({
      adminDecision: "PENDING",
      rejectedProbability: { $gt: 70 }
    });

    // 6. Locked accounts
    const lockedAccounts = await User.countDocuments({
      isLocked: true
    });

    res.status(200).json({
      totalUsers,
      newUsersToday,
      pendingReviews,
      avgWaitTime,
      fraudAlerts,
      lockedAccounts
    });
  } catch (error) {
    console.error("Error in getAdminMetrics:", error);
    res.status(500).json({
      message: "Failed to fetch admin metrics",
      error: error.message
    });
  }
};

// GET /api/admin/analytics/weekly-verifications
const getWeeklyVerifications = async (req, res) => {
  try {
    // Completed verifications (APPROVED or REJECTED) in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const completed = await AdminQueue.find({
      adminDecision: { $in: ["APPROVED", "REJECTED"] },
      decidedAt: { $gte: sevenDaysAgo }
    });

    const weekdayCounts = {
      mon: 0,
      tue: 0,
      wed: 0,
      thu: 0,
      fri: 0,
      sat: 0,
      sun: 0
    };

    const dayNames = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

    completed.forEach(doc => {
      if (doc.decidedAt) {
        const dayIndex = new Date(doc.decidedAt).getDay();
        const dayKey = dayNames[dayIndex];
        if (weekdayCounts[dayKey] !== undefined) {
          weekdayCounts[dayKey]++;
        }
      }
    });

    res.status(200).json(weekdayCounts);
  } catch (error) {
    console.error("Error in getWeeklyVerifications:", error);
    res.status(500).json({
      message: "Failed to fetch weekly verifications",
      error: error.message
    });
  }
};

// GET /api/admin/analytics/fraud-distribution
const getFraudDistribution = async (req, res) => {
  try {
    const total = await AdminQueue.countDocuments();

    if (total === 0) {
      return res.status(200).json({
        low: 0,
        medium: 0,
        high: 0,
        counts: { low: 0, medium: 0, high: 0 }
      });
    }

    const lowCount = await AdminQueue.countDocuments({
      rejectedProbability: { $lt: 30 }
    });

    const mediumCount = await AdminQueue.countDocuments({
      rejectedProbability: { $gte: 30, $lte: 70 }
    });

    const highCount = await AdminQueue.countDocuments({
      rejectedProbability: { $gt: 70 }
    });

    res.status(200).json({
      low: Math.round((lowCount / total) * 100),
      medium: Math.round((mediumCount / total) * 100),
      high: Math.round((highCount / total) * 100),
      counts: {
        low: lowCount,
        medium: mediumCount,
        high: highCount
      }
    });
  } catch (error) {
    console.error("Error in getFraudDistribution:", error);
    res.status(500).json({
      message: "Failed to fetch fraud distribution",
      error: error.message
    });
  }
};

module.exports = {
  getAdminMetrics,
  getWeeklyVerifications,
  getFraudDistribution
};
