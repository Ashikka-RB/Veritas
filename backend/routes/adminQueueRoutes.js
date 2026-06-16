const express = require("express");
const router = express.Router();

const adminAuth = require("../middleware/adminAuthMiddleware");
const { adminLogin } = require("../controllers/adminAuthController");

const {
  submitToQueue,
  getReviewQueue,
  getSingleQueueItem,
  approveUser,
  rejectUser,
  reuploadUser,
  flagFraudUser
} = require("../controllers/adminQueueController");

// Public admin routes
router.post("/login", adminLogin);

// Public queue submission route (accessed by users in Processing.jsx)
router.post("/submit", submitToQueue);

// Protected admin routes
router.use(adminAuth);

router.get("/review-queue", getReviewQueue);
router.get("/review-queue/:id", getSingleQueueItem);
router.get("/review-item/:id", getSingleQueueItem);
router.post("/approve/:id", approveUser);
router.post("/reject/:id", rejectUser);
router.post("/reupload/:id", reuploadUser);
router.post("/flag-fraud/:id", flagFraudUser);

module.exports = router;